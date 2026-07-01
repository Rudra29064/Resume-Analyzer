import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { runFullScan } from '../services/api';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const steps = ['Extracting text', 'Scoring ATS compatibility', 'Rewriting resume', 'Generating interview prep'];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: (accepted) => { setFile(accepted[0]); setError(''); }
  });

  const handleScan = async () => {
    if (!file) return setError('No file selected. Upload a resume to continue.');
    setLoading(true);
    setError('');

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setStep(i);
    }, 1100);

    try {
      const data = await runFullScan(file);
      clearInterval(interval);
      navigate('/dashboard', { state: { ...data, file } });
    } catch (err) {
      clearInterval(interval);
      setError('Connection failed. Confirm the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void font-body relative overflow-hidden flex flex-col">

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
          <span className="font-display text-sm text-white font-semibold tracking-wide">RESUMIX</span>
        </div>
        <span className="font-mono text-xs text-steeldim">v1.0</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-xl">

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs text-signal border border-signal/30 px-2 py-1 tracking-wider">AI RESUME SYSTEM</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
              One scan.<br />Every answer.
            </h1>
            <p className="text-steel mt-4 text-sm leading-relaxed max-w-md">
              Upload once. Get your ATS score, a rewritten resume, job-match analysis,
              and likely interview questions — all in one report.
            </p>
          </div>

          <div
            {...getRootProps()}
            className={`relative border transition-all duration-200 cursor-pointer p-10
              ${isDragActive
                ? 'border-signal bg-signal/5'
                : 'border-white/10 hover:border-signal/40 bg-panel/40'}`}
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

          {error && <p className="text-alert text-xs font-mono mt-3">ERROR: {error}</p>}

          <button
            onClick={handleScan}
            disabled={loading || !file}
            className={`w-full mt-6 py-4 font-display font-semibold text-sm tracking-wide transition-all
              ${loading || !file
                ? 'bg-white/5 text-steeldim cursor-not-allowed'
                : 'bg-signal text-void hover:bg-white'}`}
          >
            {loading ? (
              <span className="font-mono">{steps[step].toUpperCase()}···</span>
            ) : (
              'RUN FULL SCAN →'
            )}
          </button>

          {loading && (
            <div className="flex gap-1.5 mt-3 justify-center">
              {steps.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 flex-1 transition-colors ${idx <= step ? 'bg-signal' : 'bg-white/10'}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <div className="relative z-10 px-8 py-4 border-t border-white/5 flex justify-between font-mono text-[10px] text-steeldim">
        <span>POWERED BY LLAMA 3.3</span>
        <span>LOCAL // SECURE</span>
      </div>
    </div>
  );
}

export default UploadPage;