const express = require('express');
const crypto = require('crypto');
const midtransClient = require('midtrans-client');

const PACKAGE_CATALOG = Object.freeze({
    reguler_basic: { name: 'Kelas Reguler - Basic Level', amount: 350000, packageId: 1, durationDays: 90 },
    reguler_intermediate: { name: 'Kelas Reguler - Intermediate Level', amount: 500000, packageId: 1, durationDays: 90 },
    reguler_advanced: { name: 'Kelas Reguler - Advanced Level', amount: 750000, packageId: 1, durationDays: 90 },
    semi_private_basic: { name: 'Kelas Semi Private - Basic Level', amount: 650000, packageId: 2, durationDays: 90 },
    semi_private_intermediate: { name: 'Kelas Semi Private - Intermediate Level', amount: 850000, packageId: 2, durationDays: 90 },
    semi_private_advanced: { name: 'Kelas Semi Private - Advanced Level', amount: 1200000, packageId: 2, durationDays: 90 },
    private_basic: { name: 'Kelas Private - Basic Level', amount: 1200000, packageId: 3, durationDays: 90 },
    private_intermediate: { name: 'Kelas Private - Intermediate Level', amount: 1500000, packageId: 3, durationDays: 90 },
    private_advanced: { name: 'Kelas Private - Advanced Level', amount: 2000000, packageId: 3, durationDays: 90 }
});

const normalizeStatus = ({ transaction_status: status, fraud_status: fraudStatus }) => {
    if (status === 'settlement') return 'paid';
    if (status === 'capture') return fraudStatus === 'challenge' ? 'pending' : 'paid';
    if (status === 'pending') return 'pending';
    if (['deny', 'cancel', 'failure'].includes(status)) return 'failed';
    if (status === 'expire') return 'expired';
    if (['refund', 'partial_refund'].includes(status)) return 'refunded';
    return 'pending';
};

module.exports = function createPaymentRouter({ db, requireAuth }) {
    if (!db || typeof db.query !== 'function') throw new Error('payment.routes membutuhkan db.query');
    if (typeof requireAuth !== 'function') throw new Error('payment.routes membutuhkan middleware requireAuth');

    const router = express.Router();
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) console.warn('[Midtrans] MIDTRANS_SERVER_KEY belum diisi.');

    const snap = new midtransClient.Snap({
        isProduction,
        serverKey,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    router.post('/create-transaction', requireAuth, async (req, res) => {
        const userId = req.user?.id;
        const packageCode = String(req.body?.package_code || '').trim();
        const selectedPackage = PACKAGE_CATALOG[packageCode];

        if (!userId) return res.status(401).json({ success: false, message: 'Silakan masuk terlebih dahulu.' });
        if (!selectedPackage) return res.status(400).json({ success: false, message: 'Paket tidak valid.' });
        if (!serverKey) return res.status(503).json({ success: false, message: 'Midtrans Sandbox belum dikonfigurasi.' });

        try {
            const userResult = await db.query(
                'SELECT id, full_name, email, whatsapp FROM users WHERE id = $1 LIMIT 1',
                [userId]
            );
            const user = userResult.rows[0];
            if (!user) return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });

            const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
            const orderId = `MS-${Date.now()}-${userId}-${randomPart}`;

            await db.query(
                `INSERT INTO payment_transactions
          (order_id, user_id, package_code, package_name, gross_amount, payment_status)
         VALUES ($1, $2, $3, $4, $5, 'pending')`,
                [orderId, userId, packageCode, selectedPackage.name, selectedPackage.amount]
            );

            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: selectedPackage.amount
                },
                item_details: [{
                    id: packageCode,
                    price: selectedPackage.amount,
                    quantity: 1,
                    name: selectedPackage.name.slice(0, 50)
                }],
                customer_details: {
                    first_name: user.full_name || 'Mahir Speaking Student',
                    email: user.email,
                    phone: user.whatsapp || undefined
                },
                callbacks: {
                    finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?payment=finish`,
                    error: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?payment=error`,
                    pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?payment=pending`
                }
            };

            const transaction = await snap.createTransaction(parameter);
            await db.query(
                'UPDATE payment_transactions SET snap_token = $1, updated_at = NOW() WHERE order_id = $2',
                [transaction.token, orderId]
            );

            return res.json({
                success: true,
                order_id: orderId,
                token: transaction.token,
                redirect_url: transaction.redirect_url
            });
        } catch (error) {
            console.error('[Midtrans] create transaction:', error);
            return res.status(500).json({ success: false, message: 'Gagal membuat transaksi pembayaran.' });
        }
    });

    router.post('/notification', async (req, res) => {
        const notification = req.body || {};
        const expectedSignature = crypto
            .createHash('sha512')
            .update(`${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`)
            .digest('hex');

        if (!serverKey || expectedSignature !== notification.signature_key) {
            return res.status(403).json({ success: false, message: 'Signature Midtrans tidak valid.' });
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const paymentResult = await client.query(
                'SELECT * FROM payment_transactions WHERE order_id = $1 FOR UPDATE',
                [notification.order_id]
            );
            const payment = paymentResult.rows[0];
            if (!payment) {
                await client.query('ROLLBACK');
                return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
            }

            const status = normalizeStatus(notification);
            await client.query(
                `UPDATE payment_transactions
         SET payment_status = $1,
             payment_type = $2,
             transaction_id = $3,
             midtrans_payload = $4::jsonb,
             paid_at = CASE WHEN $1 = 'paid' AND paid_at IS NULL THEN NOW() ELSE paid_at END,
             updated_at = NOW()
         WHERE order_id = $5`,
                [status, notification.payment_type || null, notification.transaction_id || null, JSON.stringify(notification), notification.order_id]
            );

            if (status === 'paid' && payment.payment_status !== 'paid') {
                const selectedPackage = PACKAGE_CATALOG[payment.package_code];
                if (selectedPackage) {
                    await client.query(
                        `UPDATE users
             SET package_id = $1,
                 package_name = $2,
                 package_expires = (CURRENT_DATE + $3::integer),
                 is_trial = false
             WHERE id = $4`,
                        [selectedPackage.packageId, selectedPackage.name, selectedPackage.durationDays, payment.user_id]
                    );
                }
            }

            await client.query('COMMIT');
            return res.json({ success: true });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Midtrans] notification:', error);
            return res.status(500).json({ success: false });
        } finally {
            client.release();
        }
    });

    router.get('/status/:orderId', requireAuth, async (req, res) => {
        try {
            const result = await db.query(
                `SELECT order_id, package_name, gross_amount, payment_status, payment_type, paid_at, created_at
         FROM payment_transactions
         WHERE order_id = $1 AND user_id = $2 LIMIT 1`,
                [req.params.orderId, req.user.id]
            );
            if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Order tidak ditemukan.' });
            return res.json({ success: true, transaction: result.rows[0] });
        } catch (error) {
            console.error('[Midtrans] status:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil status pembayaran.' });
        }
    });

    return router;
};

