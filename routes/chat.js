const express = require('express');
const router = express.Router();
const { connectDatabase } = require('../api/db');
const Chat = require('../models/Chat');
const { getAIResponse } = require('../openaiService');

router.use(async (req, res, next) => {
  await connectDatabase();
  next();
});

router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const aiReply = await getAIResponse(prompt);
    const chatEntry = new Chat({ userPrompt: prompt, aiResponse: aiReply });
    await chatEntry.save();
    res.json({ reply: aiReply, id: chatEntry._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (req, res) => {
  const history = await Chat.find().sort({ createdAt: -1 }).limit(50);
  res.json(history);
});

module.exports = router;
