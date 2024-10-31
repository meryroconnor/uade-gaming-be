const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Obtener todos los comentarios de un juego
router.get('/games/:gameId/comments', commentController.getCommentsByGame);

// Agregar un comentario a un juego (solo para usuarios autenticados)
router.post('/games/:gameId/comments', authMiddleware, commentController.addCommentToGame);

module.exports = router;