import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListCard from '../components/ListCard';

function MatchResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center font-body">
        <div className="text-center">
          <p className="text-steel font-mono text-sm">NO_DATA_FOUND</p>
          <button onClick={() => navigate('/match')} className="mt-4 text-signal text-sm hover:underline font-mono">
            ← RUN A MATCH
          </button>
        </div>
      </div>
    );
  }

  const status = result.matchScore >= 70 ? 'pass' : result.matchScore >= 40 ? 'warn' : 'alert';
  const colorMap = {
    pass: { text: 'text-pass', stroke: '#3ddc97' },
    warn: { text: 'text-warn', stroke: '#ffb454' },
    alert: { text: 'text-alert', stroke: '#ff4d4d' },
  };
  const c = colorMap[status];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.matchScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-void font-body">

      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-mono text-xs text-steel tracking-widest">MATCH_RESULT</span>
        </div>
        <button onClick={() => navigate('/match')} className="font-mono text-xs text-steeldim hover:text-signal transition">
          NEW MATCH +
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Big score */}
        <div className="border border-white/10 bg-panel/60 p-8 mb-4 flex flex-col items-center text-center relative">
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal/50" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal/50" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal/50" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal/50" />

          <p className="font-mono text-[10px] text-steel tracking-widest mb-6">MATCH SCORE</p>

          <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="#ffffff10" strokeWidth="8" />
            <circle
              cx="80" cy="80" r={radius} fill="none"
              stroke={c.stroke} strokeWidth="8" strokeLinecap="square"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <p className={`font-mono text-5xl font-bold -mt-24 ${c.text}`}>{result.matchScore}%</p>

          <p className="text-gray-300 text-sm mt-20 max-w-md italic">"{result.verdict}"</p>
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ListCard title="Matched Skills" items={result.matchedSkills} color="green" />
          <ListCard title="Missing Skills" items={result.missingSkills} color="red" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ListCard title="Extra Skills (Not Required)" items={result.extraSkills} color="blue" />
          <ListCard title="Tailoring Suggestions" items={result.suggestions} color="indigo" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/match')}
            className="flex-1 py-3 bg-signal text-void font-display font-semibold text-sm hover:bg-white transition"
          >
            TRY ANOTHER JOB
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 border border-white/10 text-gray-300 font-display font-semibold text-sm hover:bg-white/5 transition"
          >
            BACK TO HOME
          </button>
        </div>

      </div>
    </div>
  );
}

export default MatchResultsPage;