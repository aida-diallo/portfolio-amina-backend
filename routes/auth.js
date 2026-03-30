const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const router = express.Router();
const adminPath = path.join(__dirname, '..', 'data', 'admin.json');

// Vérifier que le compte admin existe
const initAdmin = () => {
  const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));
  console.log(`Admin configuré: ${adminData.email}`);
};
initAdmin();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

    if (email !== adminData.email) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const isMatch = await bcrypt.compare(password, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { email: adminData.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf8'));

    const isMatch = await bcrypt.compare(currentPassword, adminData.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
    }

    adminData.password = await bcrypt.hash(newPassword, 10);
    fs.writeFileSync(adminPath, JSON.stringify(adminData, null, 2));

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
