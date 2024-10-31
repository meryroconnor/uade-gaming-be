const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize('videogame_marketplace', 'facundo', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',  // O puedes usar 'postgres' si usas PostgreSQL
});

sequelize.authenticate()
  .then(() => console.log('Connected to MySQL database!'))
  .catch(err => console.log('Error:', err));

module.exports = sequelize;