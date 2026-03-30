const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataPath = path.join(__dirname, '..', 'data', 'portfolio.json');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

// GET /api/portfolio - Public
router.get('/', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/hero - Admin
router.put('/hero', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.hero = { ...data.hero, ...req.body };
    writeData(data);
    res.json({ message: 'Hero mis à jour', data: data.hero });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/about - Admin
router.put('/about', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.about = { ...data.about, ...req.body };
    writeData(data);
    res.json({ message: 'À propos mis à jour', data: data.about });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/portfolio/contact - Admin
router.put('/contact', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.contact = { ...data.contact, ...req.body };
    writeData(data);
    res.json({ message: 'Contact mis à jour', data: data.contact });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// === SKILLS CRUD ===
router.post('/skills', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const newSkill = { id: uuidv4(), ...req.body };
    data.skills.push(newSkill);
    writeData(data);
    res.json({ message: 'Compétence ajoutée', data: newSkill });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/skills/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const index = data.skills.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Compétence non trouvée' });
    data.skills[index] = { ...data.skills[index], ...req.body };
    writeData(data);
    res.json({ message: 'Compétence mise à jour', data: data.skills[index] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/skills/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.skills = data.skills.filter(s => s.id !== req.params.id);
    writeData(data);
    res.json({ message: 'Compétence supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// === EXPERIENCES CRUD ===
router.post('/experiences', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const newExp = { id: uuidv4(), ...req.body };
    data.experiences.push(newExp);
    writeData(data);
    res.json({ message: 'Expérience ajoutée', data: newExp });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/experiences/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const index = data.experiences.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Expérience non trouvée' });
    data.experiences[index] = { ...data.experiences[index], ...req.body };
    writeData(data);
    res.json({ message: 'Expérience mise à jour', data: data.experiences[index] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/experiences/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.experiences = data.experiences.filter(e => e.id !== req.params.id);
    writeData(data);
    res.json({ message: 'Expérience supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// === EDUCATION CRUD ===
router.post('/education', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const newEdu = { id: uuidv4(), ...req.body };
    data.education.push(newEdu);
    writeData(data);
    res.json({ message: 'Formation ajoutée', data: newEdu });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/education/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const index = data.education.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Formation non trouvée' });
    data.education[index] = { ...data.education[index], ...req.body };
    writeData(data);
    res.json({ message: 'Formation mise à jour', data: data.education[index] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/education/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.education = data.education.filter(e => e.id !== req.params.id);
    writeData(data);
    res.json({ message: 'Formation supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// === SERVICES CRUD ===
router.post('/services', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const newService = { id: uuidv4(), ...req.body };
    data.services.push(newService);
    writeData(data);
    res.json({ message: 'Service ajouté', data: newService });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/services/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    const index = data.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Service non trouvé' });
    data.services[index] = { ...data.services[index], ...req.body };
    writeData(data);
    res.json({ message: 'Service mis à jour', data: data.services[index] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/services/:id', authMiddleware, (req, res) => {
  try {
    const data = readData();
    data.services = data.services.filter(s => s.id !== req.params.id);
    writeData(data);
    res.json({ message: 'Service supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
