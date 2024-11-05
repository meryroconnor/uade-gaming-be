const Comment = require('../models/comment');
const Game = require('../models/game');

exports.getComments = async (req, res) => {
  try {
    const { gameId } = req.params;

    // Verificar que el juego existe
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Obtener todos los comentarios del juego especificado
    const comments = await Comment.findAll({
      where: { gameId },
      attributes: ['rating', 'userId', 'content']
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching game comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addCommentToGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id;

    // Verificar que el juego existe
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Crear un nuevo comentario para el juego
    const newComment = await Comment.create({
      gameId,
      userId,
      rating,
      content
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        gameId: newComment.gameId,
        userId: newComment.userId,
        rating: newComment.rating,
        content: newComment.content
      }
    });
  } catch (error) {
    console.error('Error adding comment to game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
