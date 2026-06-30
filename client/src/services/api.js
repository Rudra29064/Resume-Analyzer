const API_URL = 'http://localhost:5000/api';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Upload failed');
  }

  const data = await response.json();
  return data;
};

export const rewriteResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/rewrite`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Rewrite failed');
  }

  return await response.json();
};

export const rewriteResumePDF = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/rewrite-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Rewrite failed');
  }

  // Convert response to downloadable PDF
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

export const generateInterviewQuestions = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/interview-questions`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Generation failed');
  }

  return await response.json();
};