const express = require('express');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rutas para el perfil del usuario
router.get('/profile', authMiddleware, profileController.getUserProfile);  // Obtener perfil
router.put('/profile', authMiddleware, profileController.updateUserProfile);  // Actualizar perfil

module.exports = router;