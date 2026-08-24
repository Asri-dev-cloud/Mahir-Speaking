// Rute Autentikasi Mahir Speaking: Mengatur pendaftaran akun, login, dan pemulihan kata sandi pengguna.
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, dbRegisterUser } from '../database/db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Pendaftaran Pengguna Baru: Menyimpan informasi profil dasar siswa baru.
router.post('/register', async (req, res) => {
  try {
    const { full_name, username, email, whatsapp, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    // Generate username dari email jika tidak dikirim dari frontend
    const userUsername = username || email.split('@')[0];
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role && ['student', 'tutor', 'admin'].includes(role) ? role : 'student';

    // Validasi domain email untuk tutor dan admin
    if ((userRole === 'tutor' || userRole === 'admin') && !email.toLowerCase().endsWith('@mahirspeaking.com')) {
      return res.status(400).json({
        success: false,
        message: 'Registrasi ditolak. Akun Tutor/Admin wajib menggunakan domain email @mahirspeaking.com.'
      });
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userUsername}`;

    // Jalankan Stored Procedure / Transaksi Aman pendaftaran user
    const regResult = await dbRegisterUser(
      full_name,
      userUsername,
      email,
      whatsapp,
      hashedPassword,
      userRole,
      avatar
    );

    if (regResult.status_code === 'EMAIL_EXISTS') {
      return res.status(400).json({ success: false, message: 'Email or Username is already registered.' });
    }
    if (regResult.status_code === 'USERNAME_EXISTS') {
      return res.status(400).json({ success: false, message: 'Email or Username is already registered.' });
    }

    const newUser = {
      id: regResult.user_id,
      full_name,
      username: userUsername.toLowerCase(),
      email: email.toLowerCase(),
      whatsapp: whatsapp || '',
      role: userRole,
      package_id: 1,
      xp: 0,
      points: 0,
      streak: 0
    };

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    delete user.password;

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Forgot Password / Reset Password Simulation
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found in our system.' });
    }

    return res.json({
      success: true,
      message: 'Password reset link has been sent to your email and WhatsApp.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error sending reset password.' });
  }
});

// Google Login Verification Route: Memvalidasi access token atau ID token dari Google, mencari/mendaftarkan pengguna ke database, dan mengembalikan token JWT resmi.
router.post('/google', async (req, res) => {
  try {
    const { accessToken, idToken } = req.body;

    if (!accessToken && !idToken) {
      return res.status(400).json({ success: false, message: 'Google access token or ID token is required.' });
    }

    let email, name, picture;
    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

    if (idToken) {
      // Panggil API Google TokenInfo untuk memverifikasi ID Token JWT (mengecek tanda tangan digital & kedaluwarsa)
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      if (!googleRes.ok) {
        return res.status(400).json({ success: false, message: 'Invalid or expired Google ID token.' });
      }
      const googleUser = await googleRes.json();
      
      // Verifikasi Audience untuk mencegah peminjaman token (token hijacking) dari aplikasi lain
      if (googleClientId && googleUser.aud !== googleClientId) {
        return res.status(400).json({ success: false, message: 'Security verification failed: Google Client ID mismatch.' });
      }

      email = googleUser.email;
      name = googleUser.name;
      picture = googleUser.picture;
    } else {
      // Panggil API Google UserInfo menggunakan Access Token
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (!googleRes.ok) {
        return res.status(400).json({ success: false, message: 'Invalid or expired Google access token.' });
      }
      const googleUser = await googleRes.json();

      // Verifikasi Client ID / Issued To dari Access Token demi keamanan
      if (googleClientId) {
        try {
          const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
          if (tokenInfoRes.ok) {
            const tokenInfo = await tokenInfoRes.json();
            const audToVerify = tokenInfo.aud || tokenInfo.issued_to;
            if (audToVerify !== googleClientId) {
              return res.status(400).json({ success: false, message: 'Security verification failed: Google Access Token client mismatch.' });
            }
          }
        } catch (e) {
          console.error('Error verifying access token audience:', e);
        }
      }

      email = googleUser.email;
      name = googleUser.name;
      picture = googleUser.picture;
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account does not provide an email address.' });
    }

    // Cari user di database
    let users = await query('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    let user;

    if (users.length === 0) {
      // Jika pengguna belum terdaftar, daftarkan secara otomatis
      const username = email.split('@')[0].toLowerCase() + Math.floor(100 + Math.random() * 900);
      const dummyPassword = await bcrypt.hash(Math.random().toString(36).substring(2, 15), 10);
      const avatar = picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      const regResult = await dbRegisterUser(
        name,
        username,
        email,
        '', // whatsapp
        dummyPassword,
        'student', // role
        avatar
      );

      if (regResult.status_code !== 'SUCCESS') {
        return res.status(500).json({ success: false, message: 'Failed to create user from Google account.' });
      }

      const freshUsers = await query('SELECT * FROM users WHERE id = ?', [regResult.user_id]);
      user = freshUsers[0];
    } else {
      user = users[0];
      // Perbarui avatar jika ada yang baru dari Google
      if (picture && user.avatar !== picture) {
        await query('UPDATE users SET avatar = ? WHERE id = ?', [picture, user.id]);
        user.avatar = picture;
      }
    }

    // Generate JWT token untuk sesi Mahir Speaking
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Hapus password hash dari respon demi keamanan
    delete user.password;

    return res.json({
      success: true,
      message: 'Google login successful!',
      token,
      user
    });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during Google authentication.' });
  }
});

export default router;
