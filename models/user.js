const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  lastName: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  dateOfBirth: { 
    type: DataTypes.DATE, 
    allowNull: true 
  },
  userType: { 
    type: DataTypes.ENUM('customer', 'company'), 
    allowNull: true 
  }
});

module.exports = User;