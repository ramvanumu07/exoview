export const createSessionState = (user) => ({
  user: user || { role:"" },
  questions: [],
  answers: [],
  feedback: [],
  currentIdx: 0
});
export const escapeHTML = (str) =>
  String(str||"").replace(/[&<>"']/g,m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])
);
export const resetSessionState = (session) => {
  session.user = { role:"" };
  session.questions = [];
  session.answers = [];
  session.feedback = [];
  session.currentIdx = 0;
};
