const Game = require('../models/game');
const { Op } = require('sequelize');
const Comment = require('../models/comment');
const Company = require('../models/company');

exports.getCompanyGames = async (req, res) => {
  try {
    const companyId = req.user.companyId; // ID de la compañía autenticada

    // Obtener la lista de juegos pertenecientes a la compañía autenticada
    const games = await Game.findAll({
      where: { companyId },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo', 'description']
        },
        {
          model: Comment,
          attributes: ['userId', 'rating', 'content']
        }
      ]
    });

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching company games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createGame = async (req, res) => {
  try {
    const companyId = req.user.companyId; // ID de la compañía autenticada
    const {
      name,
      category,
      description,
      price,
      recommendedRequirements,
      minRequirements,
      os,
      players,
      language,
      image
    } = req.body;

    // Crear el juego con el estado de no publicado por defecto
    const newGame = await Game.create({
      companyId,
      name,
      category,
      description,
      price,
      recommendedRequirements,
      minRequirements,
      os,
      players,
      language,
      image,
      isPublished: false // Estado inicial como no publicado
    });

    // Incluir la información de la compañía en la respuesta
    const gameWithCompany = await Game.findOne({
      where: { id: newGame.id },
      include: {
        model: Company,
        attributes: ['id', 'name', 'logo', 'description']
      }
    });

    res.status(201).json(gameWithCompany);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const companyId = req.user.companyId; // ID de la compañía autenticada
    const {
      name,
      category,
      description,
      price,
      recommendedRequirements,
      minRequirements,
      os,
      players,
      language,
      image,
      rating,
      isPublished
    } = req.body;

    // Buscar el juego por ID y verificar que pertenece a la compañía autenticada
    const game = await Game.findOne({ where: { id: gameId, companyId } });
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Actualizar los campos del juego con los valores proporcionados
    game.name = name || game.name;
    game.category = category || game.category;
    game.description = description || game.description;
    game.price = price || game.price;
    game.recommendedRequirements = recommendedRequirements || game.recommendedRequirements;
    game.minRequirements = minRequirements || game.minRequirements;
    game.os = os || game.os;
    game.players = players || game.players;
    game.language = language || game.language;
    game.image = image || game.image;
    game.rating = rating || game.rating;
    game.isPublished = isPublished !== undefined ? isPublished : game.isPublished;

    // Guardar los cambios
    await game.save();

    res.status(200).json({ message: 'Game updated successfully', game });
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

    // Verificar si el juego ya está publicado
    if (game.isPublished) {
      return res.status(400).json({ error: 'Game is already published' });
    }

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
    const companyId = req.user.companyId; // El ID de la compañía autenticada

    const game = await Game.findOne({ where: { id: gameId, companyId } });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    if (!game.isPublished) {
      return res.status(400).json({ error: 'Game is already unpublished' });
    }

    game.isPublished = false; // Cambia el estado de publicación
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
      attributes: ['id', 'name', 'price', 'category', 'rating', 'description', 'image', 'os', 'players', 'language']
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

     // Consultar la base de datos para obtener los detalles del juego, incluyendo sus comentarios y la información de la empresa
    const game = await Game.findOne({
      where: { id, isPublished: true }, // Solo juegos publicados
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo', 'description']
        },
        {
          model: Comment,
          attributes: ['userId', 'rating', 'content']
        }
      ]
    });

    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.listGames = async (req, res) => {
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

    // Construir filtros dinámicos
    const filters = {
      isPublished: true, // Solo juegos publicados
    };

    if (search) filters.name = { [Op.iLike]: `%${search}%` };
    if (category) filters.category = category;
    if (minPrice) filters.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, [Op.lte]: parseFloat(maxPrice) };
    if (os) filters.os = { [Op.contains]: [os] };
    if (language) filters.language = { [Op.contains]: [language] };
    if (players) filters.players = players;
    if (rating) filters.rating = { [Op.gte]: parseFloat(rating) };

    // Configuración de paginación
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    // Obtener juegos aplicando filtros y paginación
    const games = await Game.findAndCountAll({
      where: filters,
      include: {
        model: Company,
        attributes: ['id', 'name', 'logo', 'description']
      },
      limit,
      offset,
    });

    res.status(200).json({
      totalItems: games.count,
      totalPages: Math.ceil(games.count / limit),
      currentPage: parseInt(page),
      data: games.rows
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};