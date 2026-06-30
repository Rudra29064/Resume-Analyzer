const Groq = require('groq-sdk');

const matchWithJD = async (resumeText, jobDescription) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
You are an expert ATS system and technical recruiter.

Compare the resume below against the job description and return ONLY this JSON, nothing else, no markdown:

{
  "matchScore": <number 0 to 100>,
  "verdict": "<one sentence summary of fit, direct and honest>",
  "matchedSkills": [<skills present in both resume and JD>],
  "missingSkills": [<skills required by JD but missing from resume, ordered by importance>],
  "extraSkills": [<skills resume has that JD doesn't ask for>],
  "suggestions": [<3-5 specific, actionable tips to tailor this resume for this exact job>]
}

Rules:
- matchScore should reflect real overlap, not be generous by default
- missingSkills should only include things genuinely required or strongly implied by the JD
- Be honest in verdict even if the match is weak

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = matchWithJD;