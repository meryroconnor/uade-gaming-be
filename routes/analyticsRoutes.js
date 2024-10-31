const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para obtener los datos analíticos de la compañía autenticada
router.get('/analytics', authMiddleware, analyticsController.getCompanyAnalytics);

module.exports = router;