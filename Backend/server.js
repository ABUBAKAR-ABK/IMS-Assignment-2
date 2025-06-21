require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors'); // Import cors
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

// Mount authentication routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes')); // Mount user routes

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
