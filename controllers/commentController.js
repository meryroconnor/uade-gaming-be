const Comment = require('../models/comment');
const Game = require('../models/game');

// Obtener todos los comentarios de un juego
exports.getCommentsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    // Verificar si el juego existe
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Obtener comentarios del juego
    const comments = await Comment.findAll({
      where: { gameId },
      attributes: ['rating', 'userId', 'content'],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

exports.addCommentToGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;  // ID del usuario autenticado

    // Verificar si el juego existe
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Crear el comentario
    const comment = await Comment.create({
      content,
      rating,
      gameId,
      userId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
};
