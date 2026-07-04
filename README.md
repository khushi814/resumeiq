# ResumeIQ — AI Resume & ATS Score Analyzer

ResumeIQ is a full-stack AI-powered tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Users upload their resume (PDF) and paste a job description, and the app analyzes the match using AI — providing an ATS score, missing keywords, actionable suggestions, and resume strengths.

## Features

- 🔐 Secure JWT-based authentication (Signup/Login)
- 📄 PDF resume upload with automatic text extraction
- 🤖 AI-powered analysis using Gemini API with structured prompt engineering
- 📊 ATS Match Score (0–100) based on job description comparison
- 🔍 Missing keyword detection
- 💡 Actionable improvement suggestions
- ✅ Resume strengths highlighting
- 📁 Resume analysis history with detailed view

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon.tech) |
| AI | Google Gemini API |
| Auth | JWT (JSON Web Tokens) |
| File Handling | Multer, pdf-parse |

## How It Works

1. User signs up / logs in (JWT-based auth)
2. User uploads a resume (PDF) and pastes a job description
3. Backend extracts text from the PDF using `pdf-parse`
4. Extracted resume text + job description are sent to the Gemini API with a structured prompt
5. Gemini returns a clean JSON response: ATS score, missing keywords, suggestions, and strengths
6. Result is displayed on the frontend and saved to PostgreSQL for future reference
7. Users can view their past analyses on the History page

## Project Structure

```
resumeiq/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # AuthPage, Dashboard, Results, History
│       └── api.js   # Axios instance with auth interceptor
│
└── server/          # Node + Express backend
    ├── routes/       # auth.js, resume.js, analyze.js
    ├── middleware/   # JWT auth middleware
    ├── db.js         # PostgreSQL connection
    └── index.js      # App entry point
```

## Getting Started

### Prerequisites
- Node.js installed
- A PostgreSQL database (e.g. free tier on [Neon.tech](https://neon.tech))
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Log in an existing user | No |
| POST | `/api/resume/upload` | Upload PDF and extract text | No |
| POST | `/api/analyze` | Analyze resume against job description | Yes |
| GET | `/api/resume/history` | Get past analyses for logged-in user | Yes |

## What I Learned

- File upload handling and PDF text extraction
- JWT authentication implementation from scratch
- Prompt engineering for structured JSON output from AI models
- Building a complete full-stack application with protected routes
- Debugging real-world issues: API rate limits, package version mismatches, and authentication errors

## Future Improvements

- Deploy live (Vercel + Render)
- Side-by-side resume version comparison
- UI polish with better visual score indicators

---

Built by [Khushi Gupta](https://github.com/khushi814)
