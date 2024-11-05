const Wishlist = require('../models/wishlist');
const Game = require('../models/game');

// Obtener la lista de deseos del usuario autenticado
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado

    // Obtener los juegos en la wishlist del usuario
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: {
        model: Game,
        attributes: [
          'id', 'companyId', 'name', 'category', 'description',
          'price', 'recommendedRequirements', 'minRequirements', 'os', 'players', 'language', 'image', 'rating',
          'isPublished'
        ],
      },
    });

    // Extraer solo la información del juego
    const games = wishlistItems.map(item => item.Game);

    res.status(200).json(games);
  } catch (error) {
    console.error('Error retrieving wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addGameToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { gameId } = req.params;

    // Verificar si el juego existe
    const game = await Game.findOne({ where: { id: gameId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Verificar si el juego ya está en la wishlist del usuario
    const existingWishlistItem = await Wishlist.findOne({ where: { userId, gameId } });
    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Game is already in wishlist' });
    }

    // Agregar el juego a la wishlist
    await Wishlist.create({ userId, gameId });

    res.status(201).json({ message: 'Game added to wishlist successfully', game });
  } catch (error) {
    console.error('Error adding game to wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removeGameFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const wishlistItem = await Wishlist.findOne({ where: { userId, gameId } });
    if (!wishlistItem) return res.status(404).json({ error: 'Game not found in wishlist' });

    await wishlistItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error removing game from wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};