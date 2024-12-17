const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String }, // Nullable
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [String],
  ratings: [
    { user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }
  ],
  average_rating: { type: Number, default: 0 },
  comments: [
    { user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, created_at: { type: Date, default: Date.now } }
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
