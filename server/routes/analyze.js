const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/analyze
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const userId = req.userId;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Resume text and job description are required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume analyzer.

Compare the following RESUME against the JOB DESCRIPTION and return ONLY a valid JSON object (no markdown, no backticks, no extra text) with exactly this structure:

{
  "atsScore": <number between 0 and 100>,
  "missingKeywords": [<array of important skills/keywords from the job description that are missing in the resume>],
  "suggestions": [<array of specific, actionable suggestions to improve the resume>],
  "strengths": [<array of things the resume already does well that match the job>]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the JSON object, nothing else.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = responseText.replace(/```json|```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    // Save to database
    const saved = await pool.query(
      `INSERT INTO resumes 
       (user_id, resume_text, job_description, ats_score, missing_keywords, suggestions, strengths) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, created_at`,
      [
        userId,
        resumeText,
        jobDescription,
        analysis.atsScore,
        JSON.stringify(analysis.missingKeywords),
        JSON.stringify(analysis.suggestions),
        JSON.stringify(analysis.strengths)
      ]
    );

    res.json({
      id: saved.rows[0].id,
      createdAt: saved.rows[0].created_at,
      ...analysis
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error analyzing resume' });
  }
});

module.exports = router;