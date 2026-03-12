const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');
const slugify = require('slugify');

const generateSlug = async (title, userId) => {
  let base = slugify(title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await Portfolio.findOne({ slug, user: { $ne: userId } })) {
    slug = `${base}-${count++}`;
  }
  return slug;
};

// List all portfolios for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id })
      .select('title slug published views updatedAt createdAt')
      .sort({ updatedAt: -1 });
    res.json({ portfolios });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new portfolio
router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const slug = await generateSlug(title, req.user._id);

    const portfolio = await Portfolio.create({
      user: req.user._id,
      title,
      slug,
      general: { displayName: req.user.name || '' },
    });

    res.status(201).json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public portfolio by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      slug: req.params.slug,
      published: true
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    await Portfolio.findByIdAndUpdate(portfolio._id, { $inc: { views: 1 } });
    res.json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single portfolio (owner only)
router.get('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update portfolio
router.put('/:id', auth, async (req, res) => {
  try {
    const allowedFields = [
      'title', 'general', 'workExperience', 'education', 'certifications',
      'projects', 'sideProjects', 'volunteering', 'speaking', 'writing',
      'contact', 'background', 'published'
    ];

    const update = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        update[field] = req.body[field];
      }
    }

    if (update.title) {
      update.slug = await generateSlug(update.title, req.user._id);
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete portfolio
router.delete('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
