const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
}, { _id: false });

const educationSchema = new mongoose.Schema({
  school: { type: String, default: '' },
  degree: { type: String, default: '' },
  field: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  tech: { type: String, default: '' },
  link: { type: String, default: '' },
  image: { type: String, default: '' },
}, { _id: false });

const sideProjectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: false });

const volunteeringSchema = new mongoose.Schema({
  organization: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: false });

const speakingSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  event: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: false });

const writingSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  publication: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: false });

const contactLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  label: { type: String, default: '' },
}, { _id: false });

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
  general: {
    displayName: { type: String, default: '' },
    profession: { type: String, default: '' },
    location: { type: String, default: '' },
    pronouns: { type: String, default: '' },
    website: { type: String, default: '' },
    about: { type: String, default: '' },
    avatar: { type: String, default: '' },
    media: [{ type: String }],
  },
  workExperience: [workExperienceSchema],
  education: [educationSchema],
  certifications: [certificationSchema],
  projects: [projectSchema],
  sideProjects: [sideProjectSchema],
  volunteering: [volunteeringSchema],
  speaking: [speakingSchema],
  writing: [writingSchema],
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    links: [contactLinkSchema],
  },
  background: {
    type: { type: String, enum: ['color', 'gradient', 'effect'], default: 'color' },
    value: { type: String, default: '#070712' },
    config: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
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
