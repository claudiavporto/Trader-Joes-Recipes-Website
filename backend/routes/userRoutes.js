const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Favorite management routes
router.get('/:userId/favorites', auth, userController.getFavorites);
router.post('/:userId/favorites', auth, userController.addFavorite);
router.delete('/:userId/favorites', auth, userController.removeFavorite);
router.delete('/:userId/favorites/all', auth, userController.clearFavorites);
router.post('/:userId/cart', auth, userController.addToCart);

module.exports = router;
