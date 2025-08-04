const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).single('image');

// Upload profile image
router.post('/profile-image', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
      const user = await User.findById(req.user.id);
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({ imageUrl: user.profileImage });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
});

// Upload chat image
router.post('/chat-image', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;