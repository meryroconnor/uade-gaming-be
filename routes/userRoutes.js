const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Rutas para usuarios
router.post('/users/login', userController.loginUser);  // Inicio de sesión
router.post('/users/reset-password', userController.requestPasswordReset);  // Solicitud de restablecimiento de contraseña
router.post('/users/signup', userController.registerUser);  // Registro de nuevo usuario

module.exports = router;