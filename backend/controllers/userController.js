const User = require('../models/User'); // User Model
const bcrypt = require('bcryptjs');     // For password hashing
const jwt = require('jsonwebtoken');    // For generating tokens (if needed)
const mongoose = require('mongoose');

// @desc Get all users
// @route GET /api/users
const getAllUsers = async (req, res) => {
    try {
      console.log("Mongoose Connection State:", mongoose.connection.readyState);
      const users = await User.find({});
      console.log("Users Retrieved:", users);
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  };  

// @desc Get a single user by ID
// @route GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// @desc Create a new user
// @route POST /api/users
const createUser = async (req, res) => {
  const { username, email, password, role, profile_picture, bio } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'reader',
      profile_picture,
      bio,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// @desc Update user by ID
// @route PUT /api/users/:id
const updateUser = async (req, res) => {
  const { username, email, password, role, profile_picture, bio } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.profile_picture = profile_picture || user.profile_picture;
    user.bio = bio || user.bio;

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// @desc Delete user by ID
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Use deleteOne to remove the user
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  };  

// Export controllers
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
