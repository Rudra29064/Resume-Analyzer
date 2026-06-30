import React from 'react';

function ScoreCard({ title, score }) {
  const status = score >= 70 ? 'pass' : score >= 40 ? 'warn' : 'alert';
  const colorMap = {
    pass: { text: 'text-pass', stroke: '#3ddc97', label: 'STRONG' },
    warn: { text: 'text-warn', stroke: '#ffb454', label: 'MODERATE' },
    alert: { text: 'text-alert', stroke: '#ff4d4d', label: 'WEAK' },
  };
  const c = colorMap[status];

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="border border-white/10 bg-panel/60 p-6 relative">
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

      <p className="font-mono text-[10px] text-steel tracking-widest mb-4">{title.toUpperCase()}</p>

      <div className="flex items-center gap-5">
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90 flex-shrink-0">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#ffffff10" strokeWidth="6" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            stroke={c.stroke} strokeWidth="6" strokeLinecap="square"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div>
          <p className={`font-mono text-4xl font-bold ${c.text}`}>{score}</p>
          <p className="text-steeldim text-xs font-mono mt-1">/100</p>
          <p className={`font-mono text-[10px] mt-2 ${c.text} tracking-wider`}>{c.label}</p>
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;