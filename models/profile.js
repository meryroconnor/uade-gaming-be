const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  userId: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATEONLY },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Profile;