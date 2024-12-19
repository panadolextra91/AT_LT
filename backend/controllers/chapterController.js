const Chapter = require('../models/Chapter');
const { formatDistanceToNow } = require('date-fns'); 
const { formatInTimeZone } = require('date-fns-tz');
const mongoose = require('mongoose');

// @desc Get all chapters for a specific story
// @route GET /api/chapters/story/:storyId
const getChaptersByStory = async (req, res) => {
  try {
    // Explicitly cast storyId to ObjectId
    const storyId = new mongoose.Types.ObjectId(req.params.storyId);

    // Fetch chapters with the matching story_id and sort by creation time
    const chapters = await Chapter.find({ story_id: storyId }).sort({ created_at: 1 }); // Sort by ascending created_at
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chapters', error: error.message });
  }
};

// @desc Get a specific chapter by ID
// @route GET /api/chapters/:id
const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Convert UTC time to local timezone and format it
    const timeZone = 'Asia/Ho_Chi_Minh'; // Your local timezone
    const formattedDate = formatInTimeZone(new Date(chapter.created_at), timeZone, 'yyyy-MM-dd HH:mm:ss zzz');

    // Calculate time difference in local timezone
    const uploadTime = formatDistanceToNow(new Date(chapter.created_at), { addSuffix: true });

    res.status(200).json({
      ...chapter.toObject(),
      uploaded_ago: uploadTime,
      local_uploaded_time: formattedDate, // Human-readable time in the local timezone
    });
  } catch (error) {
    console.error('Error fetching chapter:', error.message);
    res.status(500).json({ message: 'Error fetching chapter', error: error.message });
  }
};

// @desc Create a new chapter
// @route POST /api/chapters
const createChapter = async (req, res) => {
  const { story_id, title, body } = req.body;

  try {
    const newChapter = new Chapter({ story_id, title, body });
    const savedChapter = await newChapter.save();
    res.status(201).json(savedChapter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chapter', error: error.message });
  }
};

// @desc Update a chapter
// @route PUT /api/chapters/:id
const updateChapter = async (req, res) => {
  const { title, body } = req.body;

  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    chapter.title = title || chapter.title;
    chapter.body = body || chapter.body;
    chapter.updatedAt = new Date();

    const updatedChapter = await chapter.save();
    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating chapter', error: error.message });
  }
};

// @desc Delete a chapter
// @route DELETE /api/chapters/:id
const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    await chapter.deleteOne();
    res.status(200).json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chapter', error: error.message });
  }
};

// Export all controllers
module.exports = {
  getChaptersByStory,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
};
