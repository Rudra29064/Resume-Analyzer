import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import ListCard from '../components/ListCard';
import { rewriteResumePDF } from '../services/api';

function ResultsPage() {
  const [rewriting, setRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState('');

  const { state } = useLocation();
  const navigate = useNavigate();
  const analysis = state?.analysis;
  const file = state?.file;

  const handleRewrite = async () => {
    if (!file) return setRewriteError('Original file lost. Re-upload to rewrite.');
    setRewriting(true);
    setRewriteError('');
    try {
      await rewriteResumePDF(file);
    } catch (err) {
      setRewriteError('Rewrite failed. Try again.');
    } finally {
      setRewriting(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center font-body">
        <div className="text-center">
          <p className="text-steel font-mono text-sm">NO_DATA_FOUND</p>
          <button onClick={() => navigate('/')} className="mt-4 text-signal text-sm hover:underline font-mono">
            ← RETURN TO UPLOAD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void font-body">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-mono text-xs text-steel tracking-widest">SCAN_RESULT</span>
        </div>
        <button onClick={() => navigate('/')} className="font-mono text-xs text-steeldim hover:text-signal transition">
          NEW SCAN +
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <ScoreCard title="ATS Compatibility" score={analysis.atsScore} />
          <ScoreCard title="Internship Readiness" score={analysis.internshipReadiness} />
        </div>

        {/* Feedback */}
        <div className="border border-white/10 bg-panel/60 p-6 mb-4">
          <p className="font-mono text-[10px] text-steel tracking-widest mb-3">OVERALL ASSESSMENT</p>
          <p className="text-gray-300 text-sm leading-relaxed">{analysis.overallFeedback}</p>
        </div>

        {/* Lists grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ListCard title="Strengths" items={analysis.strengths} color="green" />
          <ListCard title="Weaknesses" items={analysis.weaknesses} color="red" />
          <ListCard title="Missing Skills" items={analysis.missingSkills} color="orange" />
          <ListCard title="Keyword Suggestions" items={analysis.keywords} color="blue" />
        </div>

        <div className="mb-6">
          <ListCard title="Improvement Suggestions" items={analysis.suggestions} color="indigo" />
        </div>

        {/* Rewrite panel */}
        <div className="border border-signal/20 bg-gradient-to-br from-signal/[0.04] to-transparent p-7 relative">
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal/50" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal/50" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal/50" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal/50" />

          <p className="font-mono text-[10px] text-signal tracking-widest mb-2">NEXT STEP</p>
          <h2 className="font-display text-xl font-semibold text-white mb-2">Generate a rewritten resume</h2>
          <p className="text-steel text-sm mb-5 max-w-lg">
            AI restructures your content into a clean, professional layout with stronger language — exported as a ready-to-send PDF.
          </p>

          {rewriteError && <p className="text-alert text-xs font-mono mb-3">ERROR: {rewriteError}</p>}

          <button
            onClick={handleRewrite}
            disabled={rewriting}
            className={`px-6 py-3 font-display font-semibold text-sm transition-all
              ${rewriting
                ? 'bg-white/5 text-steeldim cursor-not-allowed'
                : 'bg-signal text-void hover:bg-white'}`}
          >
            {rewriting ? 'GENERATING···' : 'REWRITE & DOWNLOAD PDF →'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;