const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const analyzeRoutes = require('./routes/analyze');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ResumeIQ backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analyze', analyzeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));