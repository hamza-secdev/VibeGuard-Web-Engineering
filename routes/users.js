const express = require('express');
const router = express.Router();
const { connectDatabase } = require('../api/db');
const User = require('../models/User');

router.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

router.post('/', async (req, res) => {
  const { name, email, role, metadata } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, role: role || 'user', metadata: metadata || {}, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json(user);
  } catch (error) {
    console.error('User save error:', error);
    return res.status(500).json({ error: 'Unable to save user data' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return res.json(users);
  } catch (error) {
    console.error('User fetch error:', error);
    return res.status(500).json({ error: 'Unable to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    return res.status(500).json({ error: 'Unable to fetch user' });
  }
});

module.exports = router;
