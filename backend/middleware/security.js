// 🛡️ Security Middleware: Proteksi Header HTTP, Deteksi Crawler Jahat & Sanitasi XSS

// Daftar User-Agent bot/script yang sering dipakai untuk spamming atau scraping
const BAD_BOT_USER_AGENTS = [
  'curl', 'wget', 'python-requests', 'httpie', 'postmanruntime',
  'scrapy', 'headless', 'selenium', 'puppeteer', 'phantomjs',
  'sqlmap', 'nikto', 'dirbuster'
];

/**
 * 🔒 Middleware Security Headers: Melindungi dari Clickjacking, Sniffing, dan XSS dasar.
 */
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

/**
 * 🤖 Middleware Bot Filter: Memblokir script crawler, spider, dan library hacking otomatis.
 */
export const botFilter = (req, res, next) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  if (!userAgent) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: User-Agent tidak boleh kosong ya bestie! 🚫'
    });
  }

  const isSuspicious = BAD_BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
  if (isSuspicious) {
    console.warn(`🛡️ [Security Blocked] IP ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} diblokir. User-Agent: ${userAgent}`);
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: Script/Bot terdeteksi oleh sistem pertahanan Mahir Speaking! 🛡️'
    });
  }

  next();
};

/**
 * 🧹 Middleware Sanitasi Input (XSS Prevention): Menghilangkan script tag nakal sebelum masuk DB.
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
