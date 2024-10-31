const Game = require('../models/game');
const { Op } = require('sequelize');

exports.getCompanyGames = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const games = await Game.findAll({
      where: { companyId },
      attributes: ['id', 'name', 'price', 'category', 'isPublished', 'description', 'imageUrl']
    });

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching company games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createGame = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    const companyId = req.user.companyId;

    const newGame = await Game.create({
      name,
      description,
      price,
      category,
      imageUrl,
      companyId,
      isPublished: false
    });

    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { name, description, price, category, imageUrl } = req.body;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.name = name || game.name;
    game.description = description || game.description;
    game.price = price || game.price;
    game.category = category || game.category;
    game.imageUrl = imageUrl || game.imageUrl;

    await game.save();
    res.status(200).json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.publishGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.isPublished = true;
    await game.save();

    res.status(200).json({ message: 'Game published successfully' });
  } catch (error) {
    console.error('Error publishing game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unpublishGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    game.isPublished = false;
    await game.save();

    res.status(200).json({ message: 'Game unpublished successfully' });
  } catch (error) {
    console.error('Error unpublishing game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId;

    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    await game.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      os,
      language,
      players,
      rating,
      page = 1,
      pageSize = 10
    } = req.query;

    // Construir los filtros según los parámetros proporcionados
    const filters = {
      isPublished: true  // Solo mostrar juegos publicados
    };
    if (search) {
      filters.name = { [Op.iLike]: `%${search}%` };
    }
    if (category) {
      filters.category = category;
    }
    if (minPrice) {
      filters.price = { [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      filters.price = filters.price
        ? { ...filters.price, [Op.lte]: parseFloat(maxPrice) }
        : { [Op.lte]: parseFloat(maxPrice) };
    }
    if (os) {
      filters.os = { [Op.contains]: [os] };
    }
    if (language) {
      filters.language = { [Op.contains]: [language] };
    }
    if (players) {
      filters.players = players;
    }
    if (rating) {
      filters.rating = { [Op.gte]: parseFloat(rating) };
    }

    // Configurar la paginación
    const offset = (page - 1) * pageSize;

    // Obtener los juegos según filtros y paginación
    const games = await Game.findAll({
      where: filters,
      offset: offset,
      limit: parseInt(pageSize),
      attributes: ['id', 'name', 'price', 'category', 'rating', 'description', 'imageUrl', 'os', 'players', 'language']
    });

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByPk(id, {
      include: [
        {
          model: Comment,
          attributes: ['userId', 'content', 'rating']
        },
        {
          model: Company,
          attributes: ['id', 'name', 'logo', 'description']
        }
      ],
      attributes: [
        'id', 'name', 'price', 'category', 'rating', 'description', 'imageUrl', 
        'recommendedRequirements', 'minRequirements', 'os', 'players', 'language'
      ]
    });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};