const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { generateOTP, hashOTP } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/mailer');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Temporary token for pre-OTP state (short-lived, 10 min)
const signTempToken = (id) =>
  jwt.sign({ id, temp: true }, process.env.JWT_SECRET, { expiresIn: '10m' });

// POST /api/auth/check-email — check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    res.json({ exists: !!user, providers: user ? user.authProviders : [] });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /api/auth/register — create account with email + password
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      authProviders: ['local'],
    });

    // Generate and send OTP
    const otp = generateOTP();
    user.otpCodeHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
    }

    const tempToken = signTempToken(user._id);
    res.status(201).json({
      tempToken,
      requiresOTP: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /api/auth/login — login with email + password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and send OTP
    const otp = generateOTP();
    user.otpCodeHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
    }

    const tempToken = signTempToken(user._id);
    res.json({
      tempToken,
      requiresOTP: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /api/auth/otp/send — resend OTP (requires temp token)
router.post('/otp/send', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    user.otpCodeHash = hashOTP(otp);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOTPEmail(user.email, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /api/auth/otp/verify — verify OTP and issue real JWT
router.post('/otp/verify', async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ message: 'OTP is required' });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('+otpCodeHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check expiration
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Check attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
    }

    // Verify OTP
    const hashedInput = hashOTP(otp);
    if (hashedInput !== user.otpCodeHash) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP verified — clear OTP fields, update lastLoginAt
    user.otpCodeHash = undefined;
    user.otpExpiresAt = undefined;
    user.otpAttempts = 0;
    user.emailVerified = true;
    user.lastLoginAt = new Date();
    await user.save();

    // Issue real JWT
    const realToken = signToken(user._id);
    res.json({
      token: realToken,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, createdAt: user.createdAt },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({ message: 'Google OAuth is not configured' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=google_failed` })(req, res, next);
  },
  async (req, res) => {
    try {
      const user = req.user;
      const otp = generateOTP();
      user.otpCodeHash = hashOTP(otp);
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      user.otpAttempts = 0;
      await user.save();

      try { await sendOTPEmail(user.email, otp); } catch (e) { console.error('OTP email failed:', e.message); }

      const tempToken = signTempToken(user._id);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?step=otp&tempToken=${tempToken}`);
    } catch (err) {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=server_error`);
    }
  }
);

// GitHub OAuth routes
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.status(501).json({ message: 'GitHub OAuth is not configured' });
  }
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
});

router.get('/github/callback',
  (req, res, next) => {
    passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=github_failed` })(req, res, next);
  },
  async (req, res) => {
    try {
      const user = req.user;
      const otp = generateOTP();
      user.otpCodeHash = hashOTP(otp);
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      user.otpAttempts = 0;
      await user.save();

      try { await sendOTPEmail(user.email, otp); } catch (e) { console.error('OTP email failed:', e.message); }

      const tempToken = signTempToken(user._id);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?step=otp&tempToken=${tempToken}`);
    } catch (err) {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth?error=server_error`);
    }
  }
);

// GET /api/auth/me — get current user (requires full JWT, not temp)
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      authProviders: req.user.authProviders,
      createdAt: req.user.createdAt,
    },
  });
});

// PUT /api/auth/profile — update name and avatar
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const update = {};
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Name cannot be empty' });
      if (name.trim().length > 60) return res.status(400).json({ message: 'Name cannot exceed 60 characters' });
      update.name = name.trim();
    }
    if (avatar !== undefined) {
      update.avatar = avatar;
    }
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, authProviders: user.authProviders, createdAt: user.createdAt },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// PUT /api/auth/password — change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    // If user has a password (local auth), verify current password
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    if (!user.authProviders.includes('local')) {
      user.authProviders.push('local');
    }
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
