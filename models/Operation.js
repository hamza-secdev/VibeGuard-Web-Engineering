const mongoose = require('mongoose');

const operationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, trim: true },
  operationType: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  code: { type: String, default: '' },
  input: { type: mongoose.Schema.Types.Mixed, default: {} },
  output: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, default: 'completed' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.Operation || mongoose.model('Operation', operationSchema);
