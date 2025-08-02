import { fetchInterviewQuestions, fetchHRFeedback } from '../api/openRouterApi.js';
import { renderProgressBar } from '../components/ProgressBar.js';
import { renderQuestionCard } from '../components/QuestionCard.js';
import { renderFeedbackCards } from '../components/FeedbackCards.js';

export const renderInterviewPage = async (container, session, onComplete) => {
  container.innerHTML = `<div class="loading">Generating tailored interview questions…</div>`;
  session.questions = await fetchInterviewQuestions(session.user.role);
  session.answers = Array(5).fill('');
  session.feedback = Array(5).fill(null);
  session.currentIdx = 0;
  nextQuestion();

  function nextQuestion() {
    container.innerHTML = `<div class="app-card"></div>`;
    const card = container.querySelector('.app-card');
    renderProgressBar(card, session.currentIdx, 5);
    renderQuestionCard(card, session.questions[session.currentIdx], onSubmitAnswer);
  }

  async function onSubmitAnswer(answer) {
    session.answers[session.currentIdx] = answer;
    container.innerHTML = `<div class="loading">Receiving Interviewer Insights…</div>`;
    const fb = await fetchHRFeedback(session.questions[session.currentIdx], answer, session.user.role);
    session.feedback[session.currentIdx] = fb;
    showFeedback(fb);
  }

  function showFeedback(fb) {
    container.innerHTML = `<div class="app-card"></div>`;
    const card = container.querySelector('.app-card');
    renderProgressBar(card, session.currentIdx + 1, 5);
    renderFeedbackCards(card, fb);

    const nextBtn = document.createElement('button');
    nextBtn.className = "main-btn next-btn";
    nextBtn.textContent = session.currentIdx < 4 ? "Next Question" : "See Results";
    nextBtn.onclick = () => {
      session.currentIdx += 1;
      if (session.currentIdx < 5) nextQuestion();
      else onComplete();
    };
    card.appendChild(nextBtn);
  }
};
