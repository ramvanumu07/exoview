const BACKEND_API = "/.netlify/functions/openrouter";

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

  if (!txt || txt.trim().length === 0) {
    throw new Error("Empty response received. Please try again.");
  }

  const lines = txt
    .split('\n')
    .filter(l => /^\d\./.test(l))
    .map(l => l.replace(/^\d+\.\s*/, '').trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) {
    throw new Error("No questions found in the response. Please try again.");
  }

  if (lines.length < 5) {
    // If we get fewer than 5, try to extract any numbered questions
    const allLines = txt.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 10 && (l.match(/^\d/) || l.includes('?')))
      .slice(0, 5);

    if (allLines.length >= 3) {
      return allLines.map(l => l.replace(/^\d+\.?\s*/, '').trim());
    }

    throw new Error(`Only received ${lines.length} questions instead of 5. Please try again.`);
  }

  return lines.slice(0, 5); // Ensure we only return 5 questions
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

  // Retry once if parse failed
  if (!fb) {
    txt = await fetchOpenRouterCompletion(prompt);
    fb = tryParseFeedback(txt);
  }

  // Fallback
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
  try {
    const response = await fetch(BACKEND_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.error || `Server error (${response.status})`;
      throw new Error(errorMsg);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error("No response received from AI service");
    }

    return data.result;
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("Unable to connect to the service. Please check your internet connection and try again.");
    }

    if (error.message.includes('Missing API key')) {
      throw new Error("Service configuration error. Please contact support.");
    }

    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error("Authentication failed. Please contact support.");
    }

    if (error.message.includes('429') || error.message.includes('rate limit')) {
      throw new Error("Service is temporarily busy. Please wait a moment and try again.");
    }

    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      throw new Error("Our service is temporarily down. Please try again in a few minutes.");
    }

    throw error;
  }
};
