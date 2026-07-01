import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreCard from '../components/ScoreCard';
import ListCard from '../components/ListCard';
import { matchResumeWithJD, downloadRewrittenPDF } from '../services/api';

const TABS = ['Analysis', 'Rewrite', 'JD Match', 'Interview Prep'];

function AnalysisTab({ analysis }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <ScoreCard title="ATS Compatibility" score={analysis.atsScore} />
        <ScoreCard title="Internship Readiness" score={analysis.internshipReadiness} />
      </div>
      <div className="border border-white/10 bg-panel/60 p-6 mb-4">
        <p className="font-mono text-[10px] text-steel tracking-widest mb-3">OVERALL ASSESSMENT</p>
        <p className="text-gray-300 text-sm leading-relaxed">{analysis.overallFeedback}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ListCard title="Strengths" items={analysis.strengths} color="green" />
        <ListCard title="Weaknesses" items={analysis.weaknesses} color="red" />
        <ListCard title="Missing Skills" items={analysis.missingSkills} color="orange" />
        <ListCard title="Keyword Suggestions" items={analysis.keywords} color="blue" />
      </div>
      <ListCard title="Improvement Suggestions" items={analysis.suggestions} color="indigo" />
    </>
  );
}

function RewriteTab({ rewritten }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadRewrittenPDF(rewritten);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="border border-signal/20 bg-gradient-to-br from-signal/[0.04] to-transparent p-7 relative">
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal/50" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal/50" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal/50" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal/50" />

      <p className="font-mono text-[10px] text-signal tracking-widest mb-2">REWRITTEN</p>
      <h2 className="font-display text-xl font-semibold text-white mb-4">{rewritten.name || 'Your Resume'}</h2>

      <div className="space-y-4 mb-6">
        <div>
          <p className="font-mono text-[10px] text-steel tracking-widest mb-1">SUMMARY</p>
          <p className="text-gray-300 text-sm leading-relaxed">{rewritten.summary}</p>
        </div>
        {rewritten.skills?.length > 0 && (
          <div>
            <p className="font-mono text-[10px] text-steel tracking-widest mb-2">SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {rewritten.skills.map((s, i) => (
                <span key={i} className="font-mono text-xs text-signal border border-signal/30 px-2 py-1">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`px-6 py-3 font-display font-semibold text-sm transition-all
          ${downloading ? 'bg-white/5 text-steeldim cursor-not-allowed' : 'bg-signal text-void hover:bg-white'}`}
      >
        {downloading ? 'GENERATING···' : 'DOWNLOAD AS PDF →'}
      </button>
    </div>
  );
}

function JDMatchTab({ file }) {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jd.trim()) return setError('Paste a job description first.');
    setLoading(true);
    setError('');
    try {
      const data = await matchResumeWithJD(file, jd);
      setResult(data.result);
    } catch (err) {
      setError('Match failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const status = result.matchScore >= 70 ? 'pass' : result.matchScore >= 40 ? 'warn' : 'alert';
    const colorMap = { pass: 'text-pass', warn: 'text-warn', alert: 'text-alert' };

    return (
      <>
        <div className="border border-white/10 bg-panel/60 p-6 mb-4 text-center">
          <p className="font-mono text-[10px] text-steel tracking-widest mb-2">MATCH SCORE</p>
          <p className={`font-mono text-5xl font-bold ${colorMap[status]}`}>{result.matchScore}%</p>
          <p className="text-gray-300 text-sm mt-3 italic">"{result.verdict}"</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ListCard title="Matched Skills" items={result.matchedSkills} color="green" />
          <ListCard title="Missing Skills" items={result.missingSkills} color="red" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <ListCard title="Extra Skills" items={result.extraSkills} color="blue" />
          <ListCard title="Tailoring Suggestions" items={result.suggestions} color="indigo" />
        </div>
        <button
          onClick={() => setResult(null)}
          className="font-mono text-xs text-steeldim hover:text-signal transition"
        >
          ← TRY ANOTHER JOB
        </button>
      </>
    );
  }

  return (
    <div className="border border-white/10 bg-panel/60 p-6">
      <p className="font-mono text-[10px] text-steel tracking-widest mb-3">PASTE JOB DESCRIPTION</p>
      <textarea
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        placeholder="Paste the full job posting here..."
        rows={10}
        className="w-full bg-void border border-white/10 focus:border-signal/50 p-4 text-sm text-gray-200 placeholder-steeldim resize-none outline-none transition-colors font-body mb-4"
      />
      {error && <p className="text-alert text-xs font-mono mb-3">ERROR: {error}</p>}
      <button
        onClick={handleMatch}
        disabled={loading}
        className={`px-6 py-3 font-display font-semibold text-sm transition-all
          ${loading ? 'bg-white/5 text-steeldim cursor-not-allowed' : 'bg-signal text-void hover:bg-white'}`}
      >
        {loading ? 'MATCHING···' : 'RUN MATCH →'}
      </button>
    </div>
  );
}

function InterviewTab({ interview }) {
  const [open, setOpen] = useState({});
  const toggle = (key, i) => setOpen((p) => ({ ...p, [`${key}-${i}`]: !p[`${key}-${i}`] }));

  const blocks = [
    { key: 'technical', title: 'Technical Questions', items: interview.technical, color: 'text-signal' },
    { key: 'behavioral', title: 'Behavioral Questions', items: interview.behavioral, color: 'text-pass' },
    { key: 'projectDeepDive', title: 'Project Deep-Dives', items: interview.projectDeepDive, color: 'text-warn' },
  ];

  return (
    <>
      <div className="border border-white/10 bg-panel/60 p-6 mb-4">
        <p className="font-mono text-[10px] text-steel tracking-widest mb-2">LIKELY ROLE</p>
        <h2 className="font-display text-xl font-semibold text-white">{interview.role}</h2>
      </div>
      {blocks.map((block) => (
        <div key={block.key} className="border border-white/10 bg-panel/60 p-6 mb-4">
          <p className="font-mono text-[10px] text-steel tracking-widest mb-4">{block.title.toUpperCase()}</p>
          <div className="space-y-2">
            {block.items?.map((q, i) => (
              <div key={i} className="border border-white/5 bg-white/[0.02]">
                <button
                  onClick={() => toggle(block.key, i)}
                  className="w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-white/[0.02] transition"
                >
                  <span className={`font-mono text-xs ${block.color} mt-0.5`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-gray-200 text-sm leading-relaxed">{q.question}</span>
                </button>
                {q.topic && (
                  <div className="px-4 pb-3 -mt-1">
                    <span className={`font-mono text-[10px] ${block.color} border border-current/30 px-2 py-0.5`}>{q.topic}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function DashboardPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Analysis');

  if (!state?.analysis) {
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

  const { analysis, rewritten, interview, file } = state;

  return (
    <div className="min-h-screen bg-void font-body">

      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-display text-sm text-white font-semibold tracking-wide">RESUMIX</span>
        </div>
        <button onClick={() => navigate('/')} className="font-mono text-xs text-steeldim hover:text-signal transition">
          NEW SCAN +
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-white/5 flex gap-1 max-w-5xl mx-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-mono text-xs tracking-wide border-b-2 transition-colors
              ${activeTab === tab
                ? 'border-signal text-signal'
                : 'border-transparent text-steeldim hover:text-steel'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === 'Analysis' && <AnalysisTab analysis={analysis} />}
        {activeTab === 'Rewrite' && <RewriteTab rewritten={rewritten} />}
        {activeTab === 'JD Match' && <JDMatchTab file={file} />}
        {activeTab === 'Interview Prep' && <InterviewTab interview={interview} />}
      </div>
    </div>
  );
}

export default DashboardPage;