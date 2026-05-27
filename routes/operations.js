const express = require('express');
const router = express.Router();
const { connectDatabase } = require('../api/db');
const Operation = require('../models/Operation');

router.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

router.post('/', async (req, res) => {
  const { userId, userEmail, operationType, description, code, input, output, status } = req.body || {};
  if (!operationType) {
    return res.status(400).json({ error: 'operationType is required' });
  }

  try {
    const operation = await Operation.create({
      userId,
      userEmail,
      operationType,
      description: description || '',
      code: code || '',
      input: input || {},
      output: output || {},
      status: status || 'completed'
    });
    return res.status(201).json(operation);
  } catch (error) {
    console.error('Operation save error:', error);
    return res.status(500).json({ error: 'Unable to save operation' });
  }
});

router.get('/', async (req, res) => {
  try {
    const operations = await Operation.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name email')
      .lean();
    return res.json(operations);
  } catch (error) {
    console.error('Operation fetch error:', error);
    return res.status(500).json({ error: 'Unable to fetch operations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id)
      .populate('userId', 'name email')
      .lean();
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    return res.json(operation);
  } catch (error) {
    console.error('Operation fetch error:', error);
    return res.status(500).json({ error: 'Unable to fetch operation' });
  }
});

module.exports = router;
