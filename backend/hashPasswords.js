const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Path to your User model
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Function to hash existing passwords
const hashPasswords = async () => {
  try {
    const users = await User.find({}); // Fetch all users
    for (const user of users) {
      // Check if password is already hashed (assuming 60-character bcrypt hashes)
      if (user.password && user.password.length !== 60) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`Password hashed for user: ${user.username}`);
      }
    }
    console.log('Password hashing for existing users completed.');
    process.exit();
  } catch (error) {
    console.error('Error hashing passwords:', error.message);
    process.exit(1);
  }
};

// Run script
(async () => {
  await connectDB();
  await hashPasswords();
})();
