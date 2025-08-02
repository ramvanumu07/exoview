const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openrouter/horizon-beta";

export const fetchInterviewQuestions = async (role) => {
  const prompt = `
    You are acting as an experienced HR interviewer and team member preparing a real interview for a fresher applying to the role of ${role}.

    Your task is to ask 5 realistic interview questions that reflect what a candidate would be asked in an actual screening or early-round interview. The questions should:
    - Be behavioral or scenario-based where relevant
    - Each test a **different real-world ability** expected in a fresher for this role
    - Be **aligned with the responsibilities of the role**
    - Avoid textbook or generic “Tell me about yourself” style questions
    - Reflect real workplace thinking or challenges the fresher may face

    Only output plain text as a numbered list like below:
    1. [Your first question here]
    2. ...
    3. ...
    4. ...
    5. ...

    Do NOT include any quotes, markdown, symbols, or extra formatting.
`;

  const txt = await fetchOpenRouterCompletion(prompt);
  const lines = txt
    .split('\n')
    .filter(l => /^\d\./.test(l))
    .map(l => l.replace(/^\d+\.\s*/, '').trim());
  if (lines.length !== 5) throw new Error("Less than 5 questions from AI.");
  return lines;
};

export const fetchHRFeedback = async (question, answer, role) => {
  const prompt = `
  You are acting as an experienced HR recruiter reviewing a fresher's answer to an interview question.

Given:
- The job role: ${role}
- The interview question: ${question}
- The candidate's answer: ${answer}

Only output a valid JSON object exactly in the format shown below. Do NOT write any extra text or explanation.

{
  "strengths": [],
  "gaps": [],
  "suggestions": [],
  "rating": "X/10"
}

Each section must be written from the point of view of a professional HR interviewer.  
- "strengths" and "gaps" should list precise, evidence-based observations based on the answer.  
- "suggestions" must be actionable and insightful — not generic.

explain four key points in "suggestions":
1. **one ability the question was testing** (e.g., leadership, analytical thinking, communication).  
2. **one thing the candidate focused on** (was it off-track, partial, or strong).  
3. **What's one thing that should highlight more clearly** (examples, decisions, impact, thought process).  
4. **One advice to improve future answers** that would reflect the right abilities and impress real interviewers.

If the answer is completely invalid (e.g., gibberish), rate it below 2/10 and say ["None"] in strengths.

Respond only with the raw JSON object. No extra formatting.
  `;
  let txt = await fetchOpenRouterCompletion(prompt);
  let fb = tryParseFeedback(txt);

  // Retry once if parse failed to reduce error frequency
  if (!fb) {
    txt = await fetchOpenRouterCompletion(prompt);
    fb = tryParseFeedback(txt);
  }

  // Final fallback if still no valid parse
  if (!fb) {
    fb = {
      strengths: ["Could not parse feedback from AI."],
      gaps: ["Please try again."],
      suggestions: ["Contact support if this repeats."],
      rating: "N/A"
    };
  }
  return fb;
};

function tryParseFeedback(txt) {
  try {
    const json = txt.match(/\{[\s\S]+\}/)?.[0] || "";
    if (!json) return null;
    const fb = JSON.parse(json);
    ["strengths", "gaps", "suggestions"].forEach(k => {
      if (!Array.isArray(fb[k])) fb[k] = [String(fb[k] || "")];
      if (!fb[k] || fb[k].length === 0) fb[k] = ["None"];
    });
    if (!fb.rating) fb.rating = "N/A";
    return fb;
  } catch {
    return null;
  }
}

const fetchOpenRouterCompletion = async (prompt) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) {
    let err = "API returned " + response.status;
    try { const d = await response.json(); if (d?.error?.message) err += ": " + d.error.message; } catch { }
    throw new Error(err);
  }
  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
};