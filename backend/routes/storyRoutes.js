const express = require('express');
const {
  getAllStories,
  getStoryById,
  getStoryByName,
  getStoriesByCategory,
  getStoriesByUploader,
  createStory,
  updateStory,
  deleteStory,
  getStoriesByStatus,
} = require('../controllers/storyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllStories); // Get all stories, checked
router.get('/:id', getStoryById); // Get story by ID, checked
router.get('/search/:title', getStoryByName); // Get story by name, checked
router.get('/category/:categoryId', getStoriesByCategory); // Get story by category id, checked
router.get('/user/:uploaderId', getStoriesByUploader); // Get all stories uploaded by a user, checked
router.get('/status/:status', getStoriesByStatus); //

router.post('/', protect, createStory); // Create new story, checked
router.put('/:id', protect, updateStory); // Update story, only admin or uploader of the story can update it, checked
router.delete('/:id', protect, deleteStory); // Delete story, only admin or uploader, checked

module.exports = router;
