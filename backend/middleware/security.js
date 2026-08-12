// Proteksi Keamanan HTTP: Konfigurasi header keamanan, deteksi bot mencurigakan, dan sanitasi serangan XSS.

// Daftar User-Agent bot/script yang sering dipakai untuk spamming atau scraping
const BAD_BOT_USER_AGENTS = [
  'curl', 'wget', 'python-requests', 'httpie', 'postmanruntime',
  'scrapy', 'headless', 'selenium', 'puppeteer', 'phantomjs',
  'sqlmap', 'nikto', 'dirbuster'
];

/**
 * Middleware Keamanan Header: Melindungi aplikasi dari serangan clickjacking, content sniffing, dan XSS.
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

/**
 * Middleware Penyaringan Bot: Memblokir agen pengguna (User-Agent) berupa skrip otomatis atau alat peretas.
 */
export const botFilter = (req, res, next) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  if (!userAgent) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: User-Agent wajib disertakan untuk alasan keamanan.'
    });
  }

  const isSuspicious = BAD_BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  if (isSuspicious) {
    console.warn(`[Security Blocked] IP ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} diblokir. User-Agent: ${userAgent}`);
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: Permintaan dari perangkat atau skrip otomatis tidak diizinkan.'
    });
  }

  next();
};

/**
 * Middleware Sanitasi Input: Membersihkan tag html berbahaya dari parameter masukan untuk mencegah serangan XSS.
 */
export const sanitizeInput = (req, res, next) => {
  const cleanXSS = (val) => {
    if (typeof val === 'string') {
      // Hapus script tag beserta isinya
      return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    if (typeof val === 'object' && val !== null) {
      for (const key in val) {
        val[key] = cleanXSS(val[key]);
      }
    }
    return val;
  };

  req.body = cleanXSS(req.body);
  req.query = cleanXSS(req.query);
  req.params = cleanXSS(req.params);

  next();
};
