export const createSessionState = (user) => ({
  user: user || { role: "" },
  questions: [],
  answers: [],
  feedback: [],
  currentIdx: 0
});
export const escapeHTML = (str) =>
  String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[m])
  );
export const resetSessionState = (session) => {
  session.user = { role: "" };
  session.questions = [];
  session.answers = [];
  session.feedback = [];
  session.currentIdx = 0;
};

export const logError = (context, error, additionalInfo = {}) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalInfo
  };

  console.error(`[${context}] Error:`, errorData);

  // Store recent errors in localStorage for debugging
  try {
    const recentErrors = JSON.parse(localStorage.getItem('exoview_errors') || '[]');
    recentErrors.push(errorData);
    // Keep only last 10 errors
    const trimmedErrors = recentErrors.slice(-10);
    localStorage.setItem('exoview_errors', JSON.stringify(trimmedErrors));
  } catch (e) {
    console.warn('Could not store error in localStorage:', e);
  }
};

export const getRecentErrors = () => {
  try {
    return JSON.parse(localStorage.getItem('exoview_errors') || '[]');
  } catch (e) {
    console.warn('Could not retrieve errors from localStorage:', e);
    return [];
  }
};
