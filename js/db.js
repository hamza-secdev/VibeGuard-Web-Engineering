/**
 * MongoDB connection using Mongoose.
 * Keeps connection logic isolated and reusable.
 */
const mongoose = require('mongoose')

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is missing')
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri)

    const dbName = mongoose.connection.name
    console.log(`✅ MongoDB Connected: ${dbName}`)
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
