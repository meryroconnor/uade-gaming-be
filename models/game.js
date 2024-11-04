const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./company');  // Relación con Company

const Game = sequelize.define('Game', {
  id: { 
    type: DataTypes.STRING, 
    primaryKey: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  os: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  players: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  minRequirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  recommendedRequirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Company,
      key: 'id',
    },
  },
});

module.exports = Game;