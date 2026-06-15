const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error('Comments and search will not work. Whitelist your IP in MongoDB Atlas.');
  }
};

module.exports = connectDB;
