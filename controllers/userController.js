const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Inicio de sesión de usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generar token de acceso
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const sendPasswordResetEmail = require('../utils/emailService');

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generar token de restablecimiento
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Simular el envío del enlace de restablecimiento
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log(`Simulated password reset link (not actually sent): ${resetLink}`);

    // Responder con un mensaje de éxito simulado
    res.status(200).json({ message: 'Password reset email "sent" (simulated)', resetLink });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, lastName, email, password, dateOfBirth, userType } = req.body;

    // Validar campos obligatorios
    if (!name || !lastName || !email || !password || !userType) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      userType,  // 'customer' o 'company'
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};