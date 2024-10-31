const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Endpoint de login compartido para User y Company
router.post('/login', authController.login);

module.exports = router;