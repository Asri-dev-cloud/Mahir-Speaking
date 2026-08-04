import express from 'express';
import crypto from 'crypto';
import midtransClient from 'midtrans-client';
import { query } from '../database/db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const PACKAGE_CATALOG = Object.freeze({
    reguler_basic: { name: 'Kelas Reguler - Basic Level', amount: 350000, packageId: 2, durationDays: 90 },
    reguler_intermediate: { name: 'Kelas Reguler - Intermediate Level', amount: 500000, packageId: 3, durationDays: 90 },
    reguler_advanced: { name: 'Kelas Reguler - Advanced Level', amount: 750000, packageId: 4, durationDays: 90 },
    semi_private_basic: { name: 'Kelas Semi Private - Basic Level', amount: 650000, packageId: 5, durationDays: 90 },
    semi_private_intermediate: { name: 'Kelas Semi Private - Intermediate Level', amount: 850000, packageId: 6, durationDays: 90 },
    semi_private_advanced: { name: 'Kelas Semi Private - Advanced Level', amount: 1200000, packageId: 7, durationDays: 90 },
    private_basic: { name: 'Kelas Private - Basic Level', amount: 1200000, packageId: 8, durationDays: 90 },
    private_intermediate: { name: 'Kelas Private - Intermediate Level', amount: 1500000, packageId: 9, durationDays: 90 },
    private_advanced: { name: 'Kelas Private - Advanced Level', amount: 2000000, packageId: 10, durationDays: 90 },
});

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const serverKey = process.env.MIDTRANS_SERVER_KEY;

const snap = new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const normalizeStatus = (notification) => {
    const status = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    if (status === 'settlement') return 'paid';
    if (status === 'capture') return fraudStatus === 'challenge' ? 'pending' : 'paid';
    if (status === 'pending') return 'pending';
    if (['deny', 'cancel', 'failure'].includes(status)) return 'failed';
    if (status === 'expire') return 'expired';
    if (['refund', 'partial_refund'].includes(status)) return 'refunded';
    return 'pending';
};

router.post('/create-transaction', verifyToken, async (req, res) => {
    const userId = req.user?.id;
    const packageCode = String(req.body?.package_code || '').trim();
    const selectedPackage = PACKAGE_CATALOG[packageCode];

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Silakan masuk terlebih dahulu.' });
    }

    if (!selectedPackage) {
        return res.status(400).json({ success: false, message: 'Paket tidak valid.' });
    }

    if (!serverKey) {
        return res.status(503).json({ success: false, message: 'Midtrans belum dikonfigurasi.' });
    }

    try {
        const users = await query(
            'SELECT id, full_name, email, whatsapp FROM users WHERE id = ? LIMIT 1',
            [userId]
        );
        const user = users[0];

        if (!user) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
        }

        const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
        const orderId = `MS-${Date.now()}-${userId}-${randomPart}`;

        await query(
            `INSERT INTO payment_transactions
       (order_id, user_id, package_code, package_name, gross_amount, payment_status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
            [orderId, userId, packageCode, selectedPackage.name, selectedPackage.amount]
        );

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: selectedPackage.amount,
            },
            item_details: [{
                id: packageCode,
                price: selectedPackage.amount,
                quantity: 1,
                name: selectedPackage.name.slice(0, 50),
            }],
            customer_details: {
                first_name: user.full_name || 'Mahir Speaking Student',
                email: user.email,
                phone: user.whatsapp || undefined,
            },
            callbacks: {
                finish: `${frontendUrl}/?payment=finish`,
                error: `${frontendUrl}/?payment=error`,
                pending: `${frontendUrl}/?payment=pending`,
            },
        });

        await query(
            'UPDATE payment_transactions SET snap_token = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
            [transaction.token, orderId]
        );

        return res.json({
            success: true,
            order_id: orderId,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });
    } catch (error) {
        console.error('[Midtrans] create transaction:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal membuat transaksi pembayaran.',
            detail: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
});

router.post('/notification', async (req, res) => {
    const notification = req.body || {};

    if (!serverKey) {
        return res.status(503).json({ success: false, message: 'Midtrans belum dikonfigurasi.' });
    }

    const expectedSignature = crypto
        .createHash('sha512')
        .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`)
        .digest('hex');

    if (expectedSignature !== notification.signature_key) {
        return res.status(403).json({ success: false, message: 'Signature Midtrans tidak valid.' });
    }

    try {
        const payments = await query(
            'SELECT * FROM payment_transactions WHERE order_id = ? LIMIT 1',
            [notification.order_id]
        );
        const payment = payments[0];

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
        }

        const incomingStatus = normalizeStatus(notification);
        const finalStatus = payment.payment_status === 'paid' ? 'paid' : incomingStatus;

        await query(
            `UPDATE payment_transactions
       SET payment_status = ?,
           payment_type = ?,
           transaction_id = ?,
           midtrans_payload = ?::jsonb,
           paid_at = CASE
             WHEN ? = 'paid' AND paid_at IS NULL THEN CURRENT_TIMESTAMP
             ELSE paid_at
           END,
           updated_at = CURRENT_TIMESTAMP
       WHERE order_id = ?`,
            [
                finalStatus,
                notification.payment_type || null,
                notification.transaction_id || null,
                JSON.stringify(notification),
                finalStatus,
                notification.order_id,
            ]
        );

        if (finalStatus === 'paid' && payment.payment_status !== 'paid') {
            const selectedPackage = PACKAGE_CATALOG[payment.package_code];

            if (selectedPackage) {
                await query(
                    `UPDATE users
           SET package_id = ?,
               package_name = ?,
               package_expires = CURRENT_DATE + ?,
               is_trial = false
           WHERE id = ?`,
                    [
                        selectedPackage.packageId,
                        selectedPackage.name,
                        selectedPackage.durationDays,
                        payment.user_id,
                    ]
                );
            }
        }

        return res.json({ success: true });
    } catch (error) {
        console.error('[Midtrans] notification:', error);
        return res.status(500).json({ success: false });
    }
});

router.get('/status/:orderId', verifyToken, async (req, res) => {
    try {
        const transactions = await query(
            `SELECT order_id, package_name, gross_amount, payment_status,
              payment_type, paid_at, created_at
       FROM payment_transactions
       WHERE order_id = ? AND user_id = ?
       LIMIT 1`,
            [req.params.orderId, req.user.id]
        );

        if (!transactions[0]) {
            return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
        }

        return res.json({ success: true, transaction: transactions[0] });
    } catch (error) {
        console.error('[Midtrans] status:', error);
        return res.status(500).json({ success: false, message: 'Gagal mengambil status pembayaran.' });
    }
});

export default router;
