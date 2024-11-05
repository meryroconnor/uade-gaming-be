const express = require('express');
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para juegos
router.get('/games', gameController.getAllGames);  // Listar todos los juegos con filtros
router.get('/games/:id', gameController.getGameById);  // Obtener detalles de un juego específico
router.post('/companies/games', authMiddleware, gameController.createGame);  // Crear un juego
router.put('/companies/games/:gameId', authMiddleware, gameController.updateGame);  // Modificar un juego
router.post('/companies/games/:gameId/unpublish', authMiddleware, gameController.unpublishGame);  // Despublicar un juego
router.post('/companies/games/:gameId/publish', authMiddleware, gameController.publishGame);  // Publicar un juego
router.delete('/companies/games/:gameId', authMiddleware, gameController.deleteGame);
router.get('/companies/games', authMiddleware, gameController.getCompanyGames);
router.get('/games', gameController.listGames);

module.exports = router;