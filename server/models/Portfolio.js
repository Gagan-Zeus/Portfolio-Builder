const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'],
    required: true
  },
  order: { type: Number, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Portfolio title is required'],
    trim: true,
    maxlength: [80, 'Title cannot exceed 80 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#8b5cf6' },
    backgroundColor: { type: String, default: '#070712' },
    textColor: { type: String, default: '#f1f5f9' },
    fontFamily: { type: String, default: 'Inter' }
  },
  sections: [sectionSchema],
  published: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

portfolioSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

portfolioSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
