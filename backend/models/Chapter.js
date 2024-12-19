const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true }, // Reference to the parent story
    title: { type: String, required: true }, // Title of the chapter
    body: { type: String, required: true }, // Content of the chapter
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // Use custom field names
  }
);

module.exports = mongoose.model('Chapter', chapterSchema, 'chapters');
