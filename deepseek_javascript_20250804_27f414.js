const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// Get all messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    })
    .populate('sender', 'username profileImage')
    .populate('receiver', 'username profileImage')
    .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Send a message
router.post('/', authMiddleware, async (req, res) => {
  const { receiver, content } = req.body;

  try {
    const newMessage = new Message({
      sender: req.user.id,
      receiver,
      content
    });

    await newMessage.save();

    // Populate sender info
    const message = await Message.findById(newMessage._id)
      .populate('sender', 'username profileImage');

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get users for chat list
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('username profileImage');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;