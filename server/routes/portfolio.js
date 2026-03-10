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

router.get('/', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id })
      .select('-sections')
      .sort({ updatedAt: -1 });
    res.json({ portfolios });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const slug = await generateSlug(title, req.user._id);

    const portfolio = await Portfolio.create({
      user: req.user._id,
      title,
      slug,
      sections: [
        {
          id: 'hero-default',
          type: 'hero',
          order: 0,
          data: {
            name: req.user.name,
            title: 'Full Stack Developer',
            subtitle: 'Building exceptional digital experiences',
            ctaText: 'View My Work',
            ctaLink: '#projects'
          }
        }
      ]
    });

    res.status(201).json({ portfolio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, theme, sections, published } = req.body;

    const update = {};
    if (title !== undefined) {
      update.title = title;
      update.slug = await generateSlug(title, req.user._id);
    }
    if (theme !== undefined) update.theme = theme;
    if (sections !== undefined) update.sections = sections;
    if (published !== undefined) update.published = published;

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
