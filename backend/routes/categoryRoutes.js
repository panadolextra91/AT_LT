const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllCategories); // Get all categories
router.get('/:id', getCategoryById); // Get category by ID

// Admin-Only Routes
router.post('/', protect, authorize('admin'), createCategory); // Create category
router.put('/:id', protect, authorize('admin'), updateCategory); // Update category
router.delete('/:id', protect, authorize('admin'), deleteCategory); // Delete category

module.exports = router;
