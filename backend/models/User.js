const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'reader'], default: 'reader' },
  profile_picture: String,
  bio: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema, 'users');
