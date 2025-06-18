// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
