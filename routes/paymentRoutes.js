const express = require('express');
const paymentMethodController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/payment-methods', authMiddleware, paymentMethodController.getUserPaymentMethods);
router.delete('/payment-methods/:paymentMethodId', authMiddleware, paymentMethodController.deletePaymentMethod);
router.post('/payment-methods', authMiddleware, paymentMethodController.createPaymentMethod);

module.exports = router;