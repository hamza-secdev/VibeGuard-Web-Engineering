const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, required: true },
  findings: { type: [mongoose.Schema.Types.Mixed], default: [] },
  score: { type: Number, default: 0 },
  breakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
  grade: { type: String, default: '' },
  gradeColor: { type: String, default: '' },
  gradeEmoji: { type: String, default: '' },
  roadmap: { type: String, default: '' },
  aiEnabled: { type: Boolean, default: false },
  lines: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.models.Scan || mongoose.model('Scan', scanSchema);