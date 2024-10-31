const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const commentRoutes = require('./routes/commentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const companyRoutes = require('./routes/companyRoutes');
const gameRoutes = require('./routes/gameRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const profileRoutes = require('./routes/profileRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(userRoutes);  // Agregar rutas de usuario

// Rutas del carrito
app.use(cartRoutes);

// Rutas de comentarios
app.use(commentRoutes);

// Rutas de analytics
app.use(analyticsRoutes);

// Rutas de compañías
app.use(companyRoutes);

// Rutas de juegos
app.use(gameRoutes);

// Rutas de órdenes
app.use(orderRoutes);

// Rutas de métodos de pago
app.use(paymentMethodRoutes);

// Rutas del perfil de usuario
app.use(profileRoutes);

// Rutas de la wishlist
app.use(wishlistRoutes);

// Rutas de autenticación compartidas
app.use(authRoutes);

//Rutas de middleware
app.use(authMiddleware);

// Conectar a la base de datos
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.log('Error syncing database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

