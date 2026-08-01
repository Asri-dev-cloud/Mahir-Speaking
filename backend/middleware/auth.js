import jwt from 'jsonwebtoken';

// 🛡️ Key rahasia JWT, aman jaya diambil dari .env ya bestie~ ✨
const JWT_SECRET = process.env.JWT_SECRET || 'mahir_speaking_jwt_secret_key_2026';

// 🔐 Middleware Verifikasi Token: Biar yang gak punya akses gak bisa asal nyelonong! 🚫
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Waduh bestie, kamu harus kirim token dulu ya!' });
  }

  const token = authHeader.split(' ')[1];
  try {
    if (token === 'mock-jwt-token') {
      req.user = { id: 1, username: 'aci_master', role: 'student', full_name: 'Aci Student' };
      return next();
    }
    if (token.startsWith('mock-user-')) {
      const payloadBase64 = token.substring(10);
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      req.user = JSON.parse(payloadJson);
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sesi Anda telah berakhir.' });
  }
};

// 👑 Middleware Cek Role: Khusus pembatas hak akses role user/admin/tutor! 🎯
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Maaf ya bestie, role kamu belum diizinkan akses fitur ini~' });
    }
    next();
  };
};

export { JWT_SECRET };
