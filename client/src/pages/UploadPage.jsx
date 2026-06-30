import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (accepted) => {
      setFile(accepted[0]);
      setError('');
    }
  });

  const handleAnalyze = async () => {
    if (!file) return setError('No file selected. Upload a resume to continue.');
    setLoading(true);
    try {
      const data = await uploadResume(file);
      navigate('/results', { state: { analysis: data.analysis, file } });
    } catch (err) {
      setError('Connection failed. Confirm the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void font-body relative overflow-hidden flex flex-col">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-px overflow-hidden">
        <div className="scan-line w-full h-px bg-gradient-to-r from-transparent via-signal to-transparent" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-signal rounded-full pulse-soft" />
          <span className="font-mono text-xs text-steel tracking-widest">RESUME_SCAN.SYS</span>
        </div>
        <span className="font-mono text-xs text-steeldim">v1.0</span>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">

          {/* Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-signal border border-signal/30 px-2 py-1 tracking-wider">AI ANALYSIS</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
              Run a diagnostic<br />on your resume.
            </h1>
            <p className="text-steel mt-4 text-sm leading-relaxed max-w-md">
              Upload a PDF or DOCX. The system extracts, scores, and reports —
              ATS compatibility, skill gaps, and what to fix first.
            </p>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`relative border transition-all duration-200 cursor-pointer p-10
              ${isDragActive
                ? 'border-signal bg-signal/5'
                : 'border-white/10 hover:border-signal/40 bg-panel/40'}`}
          >
            <input {...getInputProps()} />

            {/* corner brackets */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal/50" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal/50" />
            <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal/50" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal/50" />

            <div className="text-center">
              {file ? (
                <>
                  <p className="font-mono text-signal text-sm mb-1">FILE_LOADED</p>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-steeldim text-xs mt-1 font-mono">{(file.size / 1024).toFixed(0)} KB</p>
                </>
              ) : (
                <>
                  <p className="text-gray-200 font-medium text-sm">
                    {isDragActive ? 'Release to upload' : 'Drag resume here, or click to browse'}
                  </p>
                  <p className="text-steeldim text-xs mt-2 font-mono">.PDF  /  .DOCX  —  MAX 5MB</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <p className="text-alert text-xs font-mono mt-3">ERROR: {error}</p>
          )}

          {/* Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className={`w-full mt-6 py-4 font-display font-semibold text-sm tracking-wide transition-all relative overflow-hidden group
              ${loading || !file
                ? 'bg-white/5 text-steeldim cursor-not-allowed'
                : 'bg-signal text-void hover:bg-white'}`}
          >
            {loading ? (
              <span className="font-mono">ANALYZING···</span>
            ) : (
              'RUN ANALYSIS →'
            )}
          </button>

          <button
            onClick={() => navigate('/match')}
            className="w-full mt-3 py-3 border border-white/10 text-steel font-mono text-xs tracking-wide hover:border-signal/40 hover:text-signal transition"
          >
            OR MATCH AGAINST A JOB DESCRIPTION →
          </button>

          <button
            onClick={() => navigate('/interview')}
            className="w-full mt-3 py-3 border border-white/10 text-steel font-mono text-xs tracking-wide hover:border-signal/40 hover:text-signal transition"
          >
            OR GENERATE INTERVIEW QUESTIONS →
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-8 py-4 border-t border-white/5 flex justify-between font-mono text-[10px] text-steeldim">
        <span>POWERED BY LLAMA 3.3</span>
        <span>LOCAL // SECURE</span>
      </div>
    </div>
  );
}

export default UploadPage;