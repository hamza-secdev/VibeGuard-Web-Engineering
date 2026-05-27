const { connectDatabase } = require('./db');
const Scan = require('../models/Scan');

module.exports = async (req, res) => {
  await connectDatabase();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id } = req.query || {};
    if (id) {
      const scan = await Scan.findById(id).lean();
      if (!scan) {
        return res.status(404).json({ error: 'Scan record not found' });
      }
      return res.json(scan);
    }

    const history = await Scan.find().sort({ timestamp: -1 }).limit(50).lean();
    return res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    return res.status(500).json({ error: 'Unable to load history' });
  }
};