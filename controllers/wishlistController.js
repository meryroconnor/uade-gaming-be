const Wishlist = require('../models/wishlist');
const Game = require('../models/game');

// Obtener la lista de deseos del usuario autenticado
exports.getUserWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findAll({
      where: { userId },
      include: [{
        model: Game,
        attributes: ['id', 'name', 'price', 'category', 'description', 'imageUrl', 'os', 'players', 'language', 'rating', 'minRequirements', 'recommendedRequirements']
      }]
    });

    res.status(200).json(wishlist.map(item => item.Game));
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addGameToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gameId } = req.params;

    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId, gameId }
    });

    if (!created) return res.status(200).json({ message: 'Game already in wishlist' });

    res.status(201).json(game);
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