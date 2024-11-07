const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const Wishlist = require('./wishlist');
const Order = require('./order');

const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY },
  userType: { type: DataTypes.ENUM('customer', 'company'), allowNull: false }
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10); // Encriptar contraseña antes de guardar
});

User.hasMany(require('./wishlist'), { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;