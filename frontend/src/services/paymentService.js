// Layanan Pembayaran (paymentService): Mengelola komunikasi API untuk pembuatan transaksi baru dan pengecekan status pembayaran menggunakan gerbang pembayaran Midtrans.
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Fungsi pembantu untuk mengambil token autentikasi siswa.
const getToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('mahir_token');

export const paymentService = {
    // Mengirim permintaan ke backend untuk membuat transaksi baru dengan paket yang dipilih.
    async createTransaction(packageCode) {
        const response = await fetch(`${API_BASE_URL}/api/payments/create-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken() || ''}`
            },
            body: JSON.stringify({ package_code: packageCode })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Gagal memulai pembayaran.');
        }
        return data;
    },

    // Mengambil status terkini transaksi pembayaran berdasarkan ID order.
    async getStatus(orderId) {
        const response = await fetch(`${API_BASE_URL}/api/payments/status/${encodeURIComponent(orderId)}`, {
            headers: { Authorization: `Bearer ${getToken() || ''}` }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.success) throw new Error(data.message || 'Gagal memeriksa pembayaran.');
        return data.transaction;
    }
};

