const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Company = require('../models/company');

// Login para Users y Companies
exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    // Verificar si el tipo es "user" o "company"
    let account;
    if (type === 'user') {
      account = await User.findOne({ where: { email } });
    } else if (type === 'company') {
      account = await Company.findOne({ where: { email } });
    } else {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    // Si no se encuentra la cuenta
    if (!account) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verificar la contraseña
    const isValidPassword = await bcrypt.compare(password, account.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: account.id, type }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      account: {
        id: account.id,
        email: account.email,
        username: type === 'user' ? account.username : account.name,
        type,
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};