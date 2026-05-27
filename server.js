require('dotenv').config();
const express = require('express');
const path = require('path');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const operationRoutes = require('./routes/operations');
const analyzeHandler = require('./api/analyze');
const historyHandler = require('./api/history');
const { connectDatabase } = require('./api/db');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));   // also serve other static files

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vibeguard';

connectDatabase()
  .then(() => console.log(`✅ MongoDB connected (${MONGO_URI})`))
  .catch(err => console.error('❌ MongoDB error:', err));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'scan.html'));
});

app.post('/api/analyze', analyzeHandler);
app.get('/api/history', historyHandler);
app.use('/api', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/operations', operationRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}