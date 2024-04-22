const express = require('express');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const mongoose = require('mongoose');

// MongoDB connection URI
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start your Express app or perform other actions here
    const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

  })
  


// Start the server
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});