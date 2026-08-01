// 🔐 Route Autentikasi Mahir Speaking: Tempat pendaftaran, login & reset password para pejuang English! ✨
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, dbRegisterUser } from '../database/db.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// 📝 Endpoint Register User Baru (Auto Happy, Dapet Bonus XP & Point Slay!) 🚀
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
      xp: 100,
      points: 50,
      streak: 1
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

export default router;
