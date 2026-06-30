import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import MatchPage from './pages/MatchPage';
import MatchResultsPage from './pages/MatchResultsPage';
import InterviewPage from './pages/InterviewPage';
import InterviewResultsPage from './pages/InterviewResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/match-results" element={<MatchResultsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/interview-results" element={<InterviewResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;