const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // Story content
    author: { type: String }, // Nullable
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    ratings: [
      { user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: Number }
    ],
    average_rating: { type: Number, default: 0 },
    comments: [
      { user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, created_at: { type: Date, default: Date.now } }
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['dropped', 'ongoing', 'full'], default: 'ongoing' },
    cover_img: { type: String, default: null },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Story', storySchema, 'stories');
