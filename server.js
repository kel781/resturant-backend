// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Dish = require('./models/Dish');
const contactRoutes = require('./routes/contactRoutes');
const dishRoutes = require('./routes/dishRoutes');

// Import the Dish model

const app = express();
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing of JSON request bodies

// Contact Form Route
app.use('/api', contactRoutes);

// Dish Routes
app.use('/api/dishes', dishRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!'); // This confirms connection
    // Start the server ONLY if MongoDB connects successfully
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('*** MongoDB connection error: ***', err); // Make this error more prominent
    console.error('Please ensure MongoDB is running and MONGO_URI in .env is correct.');
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// --- API Routes ---

// GET all dishes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new dish (for admin panel)
app.post('/api/dishes', async (req, res) => {
  const { name, description, price, category, image } = req.body;
  const newDish = new Dish({ name, description, price, category, image });

  try {
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    // If there's an error (e.g., duplicate name if unique is set, or validation)
    res.status(400).json({ message: err.message });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('DineSwift Backend API');
});

// Add a general error handler (optional but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

