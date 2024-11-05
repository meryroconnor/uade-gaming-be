const express = require('express');
const bodyParser = require('body-parser');
const analyticsRoutes = require('./routes/analyticsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const commentRoutes = require('./routes/commentRoutes');
const gameRoutes = require('./routes/gameRoutes');
const companyRoutes = require('./routes/companyRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const sequelize = require('./config/database');
const app = express();

app.use(bodyParser.json());

// Rutas de análisis
app.use(analyticsRoutes);

// Rutas de carrito
app.use(cartRoutes);

// Rutas de comentarios
app.use(commentRoutes);

// Rutas de juegos
app.use(gameRoutes);

// Rutas de compañías
app.use(companyRoutes);

// Rutas de órdenes
app.use(orderRoutes);

// Rutas de métodos de pago
app.use(paymentRoutes);

// Rutas de perfil
app.use(profileRoutes);

// Rutas de usuarios
app.use(userRoutes);

// Rutas de wishlist
app.use(wishlistRoutes);

// Importa tus modelos (asegúrate de importar todos los modelos antes de la sincronización)
require('./models/user');
require('./models/game');
require('./models/wishlist');
require('./models/cartItem');
require('./models/comment');
require('./models/company');
require('./models/companyAnalytics');
require('./models/gameAnalytics');
require('./models/order');
require('./models/orderItem');
require('./models/paymentMethod');
require('./models/profile');

// Conectar a la base de datos
sequelize.sync({force: false})
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database:', err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});