const User = require('../models/user');

// Obtener detalles del perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['name', 'lastName', 'email', 'dateOfBirth', 'image']
    });

    if (!user) return res.status(404).json({ error: 'Profile not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, lastName, email, dateOfBirth, image } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Profile not found' });

    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.image = image || user.image;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};