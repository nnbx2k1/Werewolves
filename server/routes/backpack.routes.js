const express = require('express');
const router = express.Router();
const backpackController = require('../controllers/backpack.controller');

// Get backpack items
router.get('/', backpackController.getBackpack);

// Add item to backpack
router.post('/items', backpackController.addItem);

// Remove item from backpack
router.delete('/items/:id', backpackController.removeItem);

// Share backpack item
router.post('/items/:id/share', backpackController.shareItem);

module.exports = router;