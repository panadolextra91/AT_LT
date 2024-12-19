const express = require('express');
const {
    getChaptersByStory,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/story/:storyId', getChaptersByStory); //checked
router.get('/:id', getChapterById); //checked

router.post('/', protect, createChapter); //checked
router.put('/:id', protect, updateChapter); //checked
router.delete('/:id', protect, deleteChapter); //checked

module.exports = router;