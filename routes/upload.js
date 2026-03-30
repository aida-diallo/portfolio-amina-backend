const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.'), false);
  }
};

const cvFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Utilisez un fichier PDF.'), false);
  }
};

const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadCV = multer({
  storage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload image
router.post('/', authMiddleware, uploadImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ message: 'Image uploadée', url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
});

// Upload CV
router.post('/cv', authMiddleware, uploadCV.single('cv'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier CV envoyé' });
    }
    const fs = require('fs');
    const dataPath = path.join(__dirname, '..', 'data', 'portfolio.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.cv = `/uploads/${req.file.filename}`;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    res.json({ message: 'CV uploadé avec succès', url: data.cv });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'upload du CV' });
  }
});

module.exports = router;
