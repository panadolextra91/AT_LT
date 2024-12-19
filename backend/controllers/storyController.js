const Story = require('../models/Story'); // Story Model
const Category = require('../models/Category');
const mongoose = require('mongoose');

// @desc Get all stories
// @route GET /api/stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({});
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories', error: error.message });
  }
};

// @desc Get a story by ID
// @route GET /api/stories/:id
const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story', error: error.message });
  }
};

// @desc Get stories by name (title)
// @route GET /api/stories/search/:title
const getStoryByName = async (req, res) => {
  try {
    const title = req.params.title;
    const stories = await Story.find({ title: { $regex: title, $options: 'i' } }); // Case-insensitive search
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for stories', error: error.message });
  }
};

// @desc Get stories by category
// @route GET /api/stories/category/:category
const getStoriesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Expect category ObjectId as parameter
    const stories = await Story.find({ categories: categoryId }).populate('categories', 'name description'); // Populate category details
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories by category', error: error.message });
  }
};

// @desc Get all stories uploaded by a user
// @route GET /api/stories/user/:uploaderId
const getStoriesByUploader = async (req, res) => {
  try {
    const { uploaderId } = req.params;
    const stories = await Story.find({ uploader: uploaderId });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stories', error: error.message });
  }
};

// @desc Create a new story (Requires login)
// @route POST /api/stories
const createStory = async (req, res) => {
  const { title, content, author, categories } = req.body;

  try {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: Please log in to upload stories' });
    }

    // Create new story
    const newStory = new Story({
      title,
      content,
      author,
      uploader: req.user._id, // From token middleware
      categories,
      views: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story', error: error.message });
  }
};

// @desc Update an existing story
// @route PUT /api/stories/:id
const updateStory = async (req, res) => {
  const { title, content, author, categories } = req.body;

  try {
    // Find the story by ID
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the user is the uploader or an admin
    if (req.user._id.toString() !== story.uploader.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only the uploader or an admin can update this story' });
    }

    // Update fields
    story.title = title || story.title;
    story.content = content || story.content;
    story.author = author || story.author;
    story.categories = categories || story.categories;
    story.updated_at = Date.now();

    const updatedStory = await story.save();
    res.status(200).json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story', error: error.message });
  }
};


// @desc Delete a story
// @route DELETE /api/stories/:id
const deleteStory = async (req, res) => {
  try {
    // Find the story by ID
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the user is the uploader or an admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== story.uploader.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Only the uploader or admin can delete the story' });
    }

    // Delete the story
    await story.deleteOne();
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story', error: error.message });
  }
};

// @desc get story by status: full, ongoing, dropped
// @route GET /api/stories/status/:status
const getStoriesByStatus = async (req, res) => {
  try {
    const { status } = req.params; // Extract status from route parameter
    const stories = await Story.find({ status }); // Query stories with the given status
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories by status', error: error.message });
  }
};

// Export controllers
module.exports = {
  getAllStories,
  getStoryById,
  getStoryByName,
  getStoriesByCategory,
  getStoriesByUploader,
  createStory,
  updateStory,
  deleteStory,
  getStoriesByStatus,
};
