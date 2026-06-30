const Groq = require('groq-sdk');

const rewriteResume = async (resumeText) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const prompt = `
You are an expert resume writer. Rewrite and restructure the resume below into a clean professional format.

Return ONLY this JSON structure, nothing else, no markdown:

{
  "name": "<full name>",
  "title": "<professional title/role, e.g. Frontend Developer>",
  "contact": {
    "email": "<email or empty string>",
    "phone": "<phone or empty string>",
    "location": "<location or empty string>",
    "linkedin": "<linkedin url or empty string>",
    "github": "<github url or empty string>"
  },
  "summary": "<2-3 sentence professional summary, rewritten to be strong and concise>",
  "skills": [<list of skill strings>],
  "experience": [
    {
      "role": "<job title>",
      "company": "<company name>",
      "duration": "<e.g. Jan 2023 - Present>",
      "bullets": [<3-5 rewritten bullet points with strong action verbs and measurable impact>]
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "tech": "<tech stack used>",
      "bullets": [<2-3 rewritten bullet points>]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<school/college name>",
      "duration": "<e.g. 2021 - 2025>"
    }
  ]
}

Rules:
- Rewrite all bullet points with strong action verbs (developed, implemented, optimized, designed, led, built)
- Add measurable impact where reasonable (percentages, numbers, scale)
- Do NOT invent companies, degrees, or experience that doesn't exist in the original
- If a section doesn't exist in the original resume, return an empty array for it
- Keep it truthful — only improve the wording and structure, not the facts

Resume:
${resumeText}
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = rewriteResume;