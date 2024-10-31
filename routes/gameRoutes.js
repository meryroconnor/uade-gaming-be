const express = require('express');
const gameController = require('../controllers/gameController');
const router = express.Router();

// Rutas para juegos
router.get('/games', gameController.getAllGames);  // Listar todos los juegos con filtros
router.get('/games/:id', gameController.getGameById);  // Obtener detalles de un juego específico

module.exports = router;