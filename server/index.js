const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const notesRoutes = require('./routes/notesRoutes');
const translateRoutes = require('./routes/translateRoutes');
const extractRoutes = require('./routes/extractRoutes');

const app = express();
const PORT = 5001;

// Ensure data directory and notes.json exist on startup
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const notesPath = path.join(dataDir, 'notes.json');
if (!fs.existsSync(notesPath)) fs.writeFileSync(notesPath, '[]', 'utf8');

// Allow localhost and any LAN IP (192.168.x.x) on port 5173
const allowedOrigin = /^http:\/\/(localhost|192\.168\.\d{1,3}\.\d{1,3}):5173$/;

// Middleware
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/notes', notesRoutes);
app.use('/translate', translateRoutes);
app.use('/extract', extractRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
