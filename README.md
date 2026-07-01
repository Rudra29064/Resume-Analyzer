# RESUMIX

> One scan. Every answer.

![Resumix](https://img.shields.io/badge/RESUMIX-AI%20Resume%20System-00e0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-20232a?style=for-the-badge&logo=react&logoColor=61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3%2070B-f55036?style=for-the-badge)

---

## What is Resumix?

Resumix is an AI-powered career tool that runs a full diagnostic on your resume in one upload. No switching between tools, no re-uploading. Upload once and get four reports instantly — ATS score, a professionally rewritten resume, a job-match analysis, and predicted interview questions — all inside a single unified dashboard.

---

## Features

**ATS Analysis**
Score your resume out of 100 for ATS compatibility. See exactly what's strong, what's missing, which skills recruiters expect, and which keywords to add.

**AI Resume Rewriter**
AI restructures your content with stronger action verbs, measurable impact, and professional phrasing — then exports it as a clean, downloadable PDF.

**Job Description Matcher**
Paste any job posting and get a match percentage, a breakdown of matched vs missing skills, and specific tips to tailor your resume for that exact role.

**Interview Prep**
AI scans your resume and predicts the technical questions, behavioral questions, and project deep-dives you're likely to face — personalized to your actual experience.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Tailwind CSS, React Router, React Dropzone |
| Backend | Node.js, Express.js, Multer |
| File Parsing | pdf-parse, Mammoth.js |
| AI | Groq API — LLaMA 3.3 70B |
| PDF Generation | PDFKit |

---

## Project Structure

```
resumix/
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── ScoreCard.jsx
│       │   └── ListCard.jsx
│       ├── pages/
│       │   ├── UploadPage.jsx
│       │   └── DashboardPage.jsx
│       ├── services/
│       │   └── api.js
│       └── App.js
│
├── server/
│   ├── routes/
│   │   └── analyzeRoute.js
│   ├── controllers/
│   │   └── analyzeController.js
│   └── utils/
│       ├── extractText.js
│       ├── analyzeWithAI.js
│       ├── rewriteResume.js
│       ├── generatePDF.js
│       ├── generateQuestions.js
│       ├── matchWithJD.js
│       └── runFullScan.js
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Groq API Key — free at [console.groq.com](https://console.groq.com) (no credit card required)

### 1. Clone the repo

```bash
git clone https://github.com/Rudra29064/Resumix.git
cd Resumix
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
node index.js
```

### 3. Setup the frontend

Open a new terminal:

```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

## How it works

```
Upload PDF or DOCX
        ↓
Extract text (pdf-parse / mammoth)
        ↓
Run 3 parallel AI calls (Groq LLaMA 3.3)
   ├── ATS analysis + scoring
   ├── Resume rewrite → structured JSON
   └── Interview question generation
        ↓
Unified dashboard — 4 tabs
   ├── Analysis
   ├── Rewrite + PDF download
   ├── JD Match (paste JD, get match %)
   └── Interview Prep
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/scan` | Full scan — runs all AI in parallel |
| POST | `/api/match` | Match resume against a job description |
| POST | `/api/download-pdf` | Generate and download rewritten resume PDF |

---

## Deployment

**Frontend → Vercel**
```bash
cd client && npm run build
# Connect repo to vercel.com
```

**Backend → Render**
- Connect `server/` folder on [render.com](https://render.com)
- Add `GROQ_API_KEY` in environment variables

---

## Author

**Rudra Patel**
- GitHub: [Rudra29064](https://github.com/Rudra29064)
- LinkedIn: [Rudra Patel](https://www.linkedin.com/in/rudra-p-27268b345/)

---

## License

MIT