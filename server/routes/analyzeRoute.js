const rewriteResume = require('../utils/rewriteResume');
const extractText = require('../utils/extractText');
const express = require('express');
const multer = require('multer');
const { uploadResume } = require('../controllers/analyzeController');
const matchWithJD = require('../utils/matchWithJD');
const generateQuestions = require('../utils/generateQuestions');
const runFullScan = require('../utils/runFullScan');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = require('path').extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  }
});

const generatePDF = require('../utils/generatePDF');

// router.post('/rewrite-pdf', upload.single('resume'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     const resumeText = await extractText(req.file);
//     const rewritten = await rewriteResume(resumeText);
//     const pdfBuffer = await generatePDF(rewritten);

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename="rewritten-resume.pdf"');
//     res.send(pdfBuffer);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/upload', upload.single('resume'), uploadResume);

router.post('/rewrite', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const resumeText = await extractText(req.file);
    const rewritten = await rewriteResume(resumeText);

    res.json({ message: 'Rewrite complete', rewritten });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/match', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'No job description provided' });
    }

    const resumeText = await extractText(req.file);
    const result = await matchWithJD(resumeText, jobDescription);

    res.json({ message: 'Match complete', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/interview-questions', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const resumeText = await extractText(req.file);
    const result = await generateQuestions(resumeText);

    res.json({ message: 'Questions generated', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/scan', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const resumeText = await extractText(req.file);
    const result = await runFullScan(resumeText);

    res.json({ message: 'Scan complete', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/download-pdf', express.json(), async (req, res) => {
  try {
    const { rewrittenData } = req.body;
    if (!rewrittenData) return res.status(400).json({ error: 'No resume data provided' });

    const pdfBuffer = await generatePDF(rewrittenData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="rewritten-resume.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;