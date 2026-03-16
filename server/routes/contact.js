const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendContactEmail } = require('../utils/mailer');

const VALID_TYPES = ['Bug Report', 'Feature Request', 'General Inquiry', 'Account Issue'];

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many contact requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, message, type } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({ message: 'Valid request type is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    await sendContactEmail(name.trim(), type, message.trim());
    res.json({ message: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Contact email failed:', err.message);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
