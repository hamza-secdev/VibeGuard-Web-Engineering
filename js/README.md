# VibeGuard Backend

## What this is
A production-ready Express + MongoDB backend for **VibeGuard**.

Current functionality:
- Express server
- MongoDB connection via Mongoose
- Root route `/` serves the scan page
- Scan persistence route `POST /api/analyze`
- Scan history route `GET /api/history`
- Chat history routes under `/api/chat`

## Tech used
- **express**: HTTP server + routing
- **mongoose**: MongoDB object modeling
- **dotenv**: load environment variables from `.env`
- **cors**: allow frontend calls during development
- **morgan**: request logging
- **nodemon** (dev): auto-restart on file changes

## Setup
1. Ensure MongoDB is running locally or accessible remotely.
2. Create/verify your env file:
   - Copy `.env.example` to `.env`
   - Update `MONGO_URI` with your MongoDB connection string.
3. Install dependencies:
```bash
npm install
```

## Run
Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Expected terminal output:
- `✅ MongoDB connected`
- `🚀 Server running on port 5000`

## Required environment variables
- `MONGO_URI` — MongoDB connection string
- `PORT` — optional Express port (default: 5000)

## API Endpoints
- `GET /` -> serves `scan.html`
- `POST /api/analyze` -> saves a scan result to MongoDB
- `GET /api/history` -> returns stored scan history
- `POST /api/chat` -> saves a chat message
- `GET /api/history` -> retrieves scan history

## Notes
If MongoDB is not configured, the backend will fail to connect and the scan persistence endpoint will not save data. Ensure `.env` exists and contains a valid `MONGO_URI`.
