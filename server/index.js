require('dotenv').config();

const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyzeRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://resumix29.vercel.app',
  ],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Resume Analyzer API is running');
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'Server is reachable' });
});

app.use('/api', analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});