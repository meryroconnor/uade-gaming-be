const PaymentMethod = require('../models/paymentMethod');

// Obtener métodos de pago del usuario autenticado
exports.getUserPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
      attributes: ['id', 'type', 'cardDetails'],
    });

    if (!paymentMethods) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardDetails, type } = req.body;

    const newPaymentMethod = await PaymentMethod.create({
      userId,
      type,
      cardDetails
    });

    res.status(201).json(newPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.user.id;

    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) return res.status(404).json({ error: 'Payment method not found' });

    await paymentMethod.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};