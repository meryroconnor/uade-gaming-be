const PaymentMethod = require('../models/paymentMethod');

// Obtener métodos de pago del usuario autenticado
exports.getUserPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado

    // Obtener todos los métodos de pago del usuario autenticado
    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
      attributes: ['type', 'userId', 'cardDetails']
    });

    if (!paymentMethods.length) {
      return res.status(404).json({ error: 'User not found or no payment methods available' });
    }

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { type, cardDetails } = req.body;

    // Validar datos del método de pago
    if (!type || !['credit', 'debit'].includes(type) || !cardDetails) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Crear el método de pago
    const paymentMethod = await PaymentMethod.create({
      userId,
      type,
      cardDetails
    });

    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;
    const userId = req.user.id; // ID del usuario autenticado

    // Buscar el método de pago para verificar que pertenece al usuario autenticado
    const paymentMethod = await PaymentMethod.findOne({
      where: { id: paymentMethodId, userId }
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Eliminar el método de pago
    await paymentMethod.destroy();

    res.status(204).send(); // No se devuelve contenido en una eliminación exitosa
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};