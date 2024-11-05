const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const Game = require('./game');

const Company = sequelize.define('Company', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,  // El logo puede ser opcional
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Descripción opcional
  }
  
});

Company.hasMany(Game, { foreignKey: 'companyId' });
Game.belongsTo(Company, { foreignKey: 'companyId' });

module.exports = Company;