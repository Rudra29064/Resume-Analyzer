const analyzeWithAI = require('./analyzeWithAI');
const rewriteResume = require('./rewriteResume');
const generateQuestions = require('./generateQuestions');

const runFullScan = async (resumeText) => {
  const [analysis, rewritten, interview] = await Promise.all([
    analyzeWithAI(resumeText),
    rewriteResume(resumeText),
    generateQuestions(resumeText),
  ]);

  return { analysis, rewritten, interview };
};

module.exports = runFullScan;