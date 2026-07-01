const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const runFullScan = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Scan failed');
  }

  return await response.json();
};

export const downloadRewrittenPDF = async (rewrittenData) => {
  const response = await fetch(`${API_URL}/download-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rewrittenData }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rewritten-resume.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
};

export const matchResumeWithJD = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('jobDescription', jobDescription);

  const response = await fetch(`${API_URL}/match`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Match failed');
  }

  return await response.json();
};