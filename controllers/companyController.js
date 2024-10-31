const Company = require('../models/company');
const Game = require('../models/game');
const bcrypt = require('bcryptjs');

// Obtener el perfil de la compañía autenticada
exports.getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.companyId;  // Asumimos que req.user tiene el ID de la compañía
    const company = await Company.findByPk(companyId, {
      attributes: ['id', 'name', 'logo', 'description']
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Actualizar el perfil de la compañía autenticada
exports.updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { name, logo, description } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ error: 'Company not found' });

    company.name = name || company.name;
    company.logo = logo || company.logo;
    company.description = description || company.description;

    await company.save();
    res.status(200).json(company);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

