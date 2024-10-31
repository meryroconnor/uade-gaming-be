const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Company registration and login routes
router.post('/companies/signup', companyController.companySignup);
// router.post('/companies/login', companyController.companyLogin);

// Routes protected by authentication
router.get('/companies/profile', authMiddleware, companyController.getCompanyProfile);
router.put('/companies/profile', authMiddleware, companyController.updateCompanyProfile);
router.post('/companies', authMiddleware, companyController.createCompany);
router.get('/companies/games', authMiddleware, companyController.getCompanyGames);

module.exports = router;
