import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { matchResumeWithJD } from '../services/api';

function MatchPage() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (accepted) => { setFile(accepted[0]); setError(''); }
  });

  const handleMatch = async () => {
    if (!file) return setError('No resume uploaded.');
    if (!jd.trim()) return setError('Job description is empty.');
    setLoading(true);
    setError('');
    try {
      const data = await matchResumeWithJD(file, jd);
      navigate('/match-results', { state: { result: data.result } });
    } catch (err) {
      setError('Connection failed. Confirm the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void font-body">

      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-mono text-xs text-steel tracking-widest">JD_MATCH.SYS</span>
        </div>
        <button onClick={() => navigate('/')} className="font-mono text-xs text-steeldim hover:text-signal transition">
          ← BACK
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-signal border border-signal/30 px-2 py-1 tracking-wider">JD COMPARISON</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-white leading-tight">
            Match your resume<br />to the job.
          </h1>
          <p className="text-steel mt-4 text-sm leading-relaxed max-w-lg">
            Upload your resume and paste a job posting. The system cross-references both and reports exactly what's missing.
          </p>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`relative border transition-all duration-200 cursor-pointer p-8 mb-5
            ${isDragActive ? 'border-signal bg-signal/5' : 'border-white/10 hover:border-signal/40 bg-panel/40'}`}
        >
          <input {...getInputProps()} />
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal/50" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal/50" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal/50" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal/50" />

          <div className="text-center">
            {file ? (
              <>
                <p className="font-mono text-signal text-sm mb-1">FILE_LOADED</p>
                <p className="text-white text-sm">{file.name}</p>
              </>
            ) : (
              <p className="text-gray-300 text-sm font-medium">
                {isDragActive ? 'Release to upload' : 'Drag resume here, or click to browse'}
              </p>
            )}
          </div>
        </div>

        {/* JD textarea */}
        <div className="mb-2">
          <p className="font-mono text-[10px] text-steel tracking-widest mb-2">JOB DESCRIPTION</p>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job posting here..."
            rows={10}
            className="w-full bg-panel/60 border border-white/10 focus:border-signal/50 p-4 text-sm text-gray-200 placeholder-steeldim resize-none outline-none transition-colors font-body"
          />
        </div>

        {error && <p className="text-alert text-xs font-mono mb-4">ERROR: {error}</p>}

        <button
          onClick={handleMatch}
          disabled={loading || !file || !jd.trim()}
          className={`w-full py-4 font-display font-semibold text-sm tracking-wide transition-all mt-4
            ${loading || !file || !jd.trim()
              ? 'bg-white/5 text-steeldim cursor-not-allowed'
              : 'bg-signal text-void hover:bg-white'}`}
        >
          {loading ? 'MATCHING···' : 'RUN MATCH ANALYSIS →'}
        </button>

      </div>
    </div>
  );
}

export default MatchPage;