const BACKEND_API = "/.netlify/functions/openrouter";

export const fetchInterviewQuestions = async (role) => {
  const prompt = `Create 5 realistic interview questions for a fresher ${role} position. Each question should test different abilities (problem-solving, communication, teamwork, technical skills, adaptability). Make them behavioral/scenario-based. Format as numbered list:
1. [question]
2. [question]
3. [question]
4. [question]
5. [question]

No extra formatting.`;

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
  const prompt = `Evaluate this ${role} interview answer. Return only JSON:

Question: ${question}
Answer: ${answer}

{
  "strengths": ["positive points"],
  "gaps": ["areas missing"],
  "suggestions": ["specific improvements"],
  "rating": "X/10"
}

Be specific and actionable.`;

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
