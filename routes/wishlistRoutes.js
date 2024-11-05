const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas de lista de deseos
router.get('/wishlist', authMiddleware, wishlistController.getWishlist);  // Obtener lista de deseos
router.post('/games/:gameId/wishlist', authMiddleware, wishlistController.addGameToWishlist);  // Agregar juego a la lista de deseos
router.delete('/games/:gameId/wishlist', authMiddleware, wishlistController.removeGameFromWishlist);  // Eliminar juego de la lista de deseos

module.exports = router;