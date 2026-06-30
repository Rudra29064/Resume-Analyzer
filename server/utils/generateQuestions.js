const Groq = require('groq-sdk');

const generateQuestions = async (resumeText) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
You are a senior technical interviewer.

Based on the resume below, generate interview questions the candidate is likely to face.

Return ONLY this JSON, nothing else, no markdown:

{
  "role": "<most likely role this person would interview for, based on resume>",
  "technical": [
    { "question": "<technical question tied to a specific skill/project in their resume>", "topic": "<short topic tag e.g. React, Databases, System Design>" }
  ],
  "behavioral": [
    { "question": "<behavioral/HR question relevant to their experience level>", "topic": "<short topic tag e.g. Teamwork, Leadership, Conflict>" }
  ],
  "projectDeepDive": [
    { "question": "<question that probes deeper into a specific project from the resume>", "topic": "<project name or area>" }
  ]
}

Rules:
- Generate exactly 5 technical, 3 behavioral, and 3 projectDeepDive questions
- Technical questions must reference actual skills/technologies mentioned in the resume
- projectDeepDive questions must reference actual project names from the resume if present
- Keep questions realistic, the kind an actual interviewer would ask
- Do not invent skills not present in the resume

Resume:
${resumeText}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = generateQuestions;