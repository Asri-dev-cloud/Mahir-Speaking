// Pembatasan Akses Kustom (Rate Limiter) dalam Memori: Menjaga stabilitas server dan mencegah serangan brute force.
const rateLimitStore = new Map();

// Pembersihan berkala memori dari entri kedaluwarsa secara terjadwal untuk mencegah kebocoran memori.
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Bersihkan setiap 5 menit

export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // Default 15 menit
    max = 100,                 // Default maksimal 100 request
    message = 'Too many requests, please try again later.',
    statusCode = 429
  } = options;

  return (req, res, next) => {
    // Ambil IP asli (bisa di belakang proxy Vercel/Cloudflare)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const key = `${req.baseUrl || ''}${req.path}_${ip}`;

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    const record = rateLimitStore.get(key);

    if (now > record.resetTime) {
      // Reset window waktu pembatasan
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }

    record.count++;

    if (record.count > max) {
      return res.status(statusCode).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    next();
  };
};

// Limiter Global (Semua route API): 1500 request / 15 menit
export const globalLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: 'Permintaan akses terlalu padat. Mohon tunggu beberapa menit sebelum mencoba kembali.'
});

// Limiter Khusus Auth (Register, Login, Lupa Password): 45 request / 15 menit (Anti Brute Force & Spam Bot!)
export const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 45,
  message: 'Terlalu banyak percobaan autentikasi dari perangkat ini. Silakan coba kembali dalam 15 menit untuk menjaga keamanan akun Anda.'
});
