/**
 * VibeGuard Backend (Phase 0 - Foundation)
 * - Express server setup
 * - MongoDB connection via config/db.js
 * - Root + health endpoints
 * - Scan routes placeholder
 * - 404 + global error handling
 */

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const connectDB = require('./config/db')
const errorMiddleware = require('./middleware/errorMiddleware')

const scanRoutes = require('./routes/scanRoutes')

dotenv.config()

const app = express()

// -----------------------------
// Middleware (request lifecycle)
// -----------------------------

// Parse incoming JSON bodies
app.use(express.json())

// Development-only CORS: allow all origins so frontend can call this API easily.
// In production, replace this with explicit allowed origins.
app.use(cors())

// Log incoming requests in dev mode
app.use(morgan('dev'))

// Parse cookies (useful later for auth/session features)
app.use(cookieParser())

// -----------------------------
// Routes
// -----------------------------

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'VibeGuard API is running',
    version: '1.0.0'
  })
})

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Mount scan routes under /api
app.use('/api', scanRoutes)

// -----------------------------
// 404 handler (unmatched routes)
// -----------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// -----------------------------
// Global error handler
// -----------------------------
app.use(errorMiddleware)

// -----------------------------
// Start server (after DB connects)
// -----------------------------
const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT)
    console.log('🌐 http://localhost:' + PORT)
  })
}

startServer()
