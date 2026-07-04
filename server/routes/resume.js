const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(fileBuffer);
    const extractedText = data.text;

    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Resume uploaded and text extracted successfully',
      textPreview: extractedText.substring(0, 300),
      fullTextLength: extractedText.length,
      fullText: extractedText
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing the resume file' });
  }
});

// GET /api/resume/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT id, ats_score, missing_keywords, suggestions, strengths, created_at 
       FROM resumes 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching resume history' });
  }
});

module.exports = router;