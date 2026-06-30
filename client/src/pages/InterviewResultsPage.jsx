import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function QuestionBlock({ title, items, accentClass }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="border border-white/10 bg-panel/60 p-6 mb-4">
      <p className="font-mono text-[10px] text-steel tracking-widest mb-4">{title.toUpperCase()}</p>
      <div className="space-y-2">
        {items?.map((q, i) => (
          <div key={i} className="border border-white/5 bg-white/[0.02]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition"
            >
              <div className="flex gap-3 items-start">
                <span className={`font-mono text-xs ${accentClass} mt-0.5`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-gray-200 text-sm leading-relaxed">{q.question}</span>
              </div>
            </button>
            {q.topic && (
              <div className="px-4 pb-3 -mt-1">
                <span className={`font-mono text-[10px] ${accentClass} border border-current/30 px-2 py-0.5`}>
                  {q.topic}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InterviewResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center font-body">
        <div className="text-center">
          <p className="text-steel font-mono text-sm">NO_DATA_FOUND</p>
          <button onClick={() => navigate('/interview')} className="mt-4 text-signal text-sm hover:underline font-mono">
            ← GENERATE QUESTIONS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void font-body">

      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-mono text-xs text-steel tracking-widest">INTERVIEW_PREP_RESULT</span>
        </div>
        <button onClick={() => navigate('/interview')} className="font-mono text-xs text-steeldim hover:text-signal transition">
          NEW SCAN +
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-6">
          <p className="font-mono text-[10px] text-steel tracking-widest mb-2">LIKELY ROLE</p>
          <h1 className="font-display text-2xl font-semibold text-white">{result.role}</h1>
        </div>

        <QuestionBlock title="Technical Questions" items={result.technical} accentClass="text-signal" />
        <QuestionBlock title="Behavioral Questions" items={result.behavioral} accentClass="text-pass" />
        <QuestionBlock title="Project Deep-Dives" items={result.projectDeepDive} accentClass="text-warn" />

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/interview')}
            className="flex-1 py-3 bg-signal text-void font-display font-semibold text-sm hover:bg-white transition"
          >
            TRY ANOTHER RESUME
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

export default InterviewResultsPage;