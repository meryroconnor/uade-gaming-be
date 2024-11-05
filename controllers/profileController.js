const User = require('../models/user');
const Profile = require('../models/profile');

// Obtener detalles del perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado

    // Buscar el perfil del usuario autenticado
    const profile = await Profile.findOne({
      where: { userId },
      attributes: ['image', 'lastName', 'name', 'dateOfBirth', 'email']
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { name, lastName, image, dateOfBirth, email } = req.body;

    // Buscar el perfil del usuario autenticado
    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Actualizar los campos del perfil
    profile.name = name || profile.name;
    profile.lastName = lastName || profile.lastName;
    profile.image = image || profile.image;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.email = email || profile.email;

    await profile.save();

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};