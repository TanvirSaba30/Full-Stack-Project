// server.js  (FINAL VERSION)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ All routes (matches the files you created)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/slots', require('./routes/facultyRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Serve frontend static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve index.html for any unknown paths (useful for SPA if needed)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Unimeet Backend running on http://localhost:${PORT}`);
});