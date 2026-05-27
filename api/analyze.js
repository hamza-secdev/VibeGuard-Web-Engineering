const { connectDatabase } = require('./db');
const Scan = require('../models/Scan');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  await connectDatabase();

  const payload = req.body || {};
  const {
    code,
    language,
    findings,
    score,
    breakdown,
    grade,
    gradeColor,
    gradeEmoji,
    roadmap,
    aiEnabled,
    lines,
    timestamp,
  } = payload;

  if (!code || !language) {
    return res.status(400).json({ error: 'Missing code or language' });
  }

  try {
    const scan = await Scan.create({
      code,
      language,
      findings: Array.isArray(findings) ? findings : [],
      score: Number(score) || 0,
      breakdown: breakdown || {},
      grade: grade || '',
      gradeColor: gradeColor || '',
      gradeEmoji: gradeEmoji || '',
      roadmap: roadmap || '',
      aiEnabled: Boolean(aiEnabled),
      lines: Number(lines) || 0,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    return res.status(201).json({ success: true, id: scan._id });
  } catch (error) {
    console.error('Analyze save error:', error);
    return res.status(500).json({ error: 'Unable to save scan history' });
  }
};