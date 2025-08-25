import { fetchInterviewQuestions, fetchHRFeedback } from '../api/openRouterApi.js';
import { renderProgressBar } from '../components/ProgressBar.js';
import { renderQuestionCard } from '../components/QuestionCard.js';
import { renderFeedbackCards } from '../components/FeedbackCards.js';
import { logError } from '../utils/helpers.js';

export const renderInterviewPage = async (container, session, onComplete) => {
  container.innerHTML = `<div class="loading">Generating tailored interview questions…</div>`;

  try {
    session.questions = await fetchInterviewQuestions(session.user.role);
    session.answers = Array(5).fill('');
    session.feedback = Array(5).fill(null);
    session.currentIdx = 0;
    nextQuestion();
  } catch (error) {
    logError('Question Generation', error, { role: session.user.role });
    showError(container, error.message, () => {
      renderInterviewPage(container, session, onComplete);
    });
    return;
  }

  function nextQuestion() {
    container.innerHTML = `<div class="app-card"></div>`;
    const card = container.querySelector('.app-card');
    renderProgressBar(card, session.currentIdx, 5);
    renderQuestionCard(card, session.questions[session.currentIdx], onSubmitAnswer);
  }

  async function onSubmitAnswer(answer) {
    session.answers[session.currentIdx] = answer;
    container.innerHTML = `<div class="loading">Receiving Interviewer Insights…</div>`;

    try {
      const fb = await fetchHRFeedback(session.questions[session.currentIdx], answer, session.user.role);
      session.feedback[session.currentIdx] = fb;
      showFeedback(fb);
    } catch (error) {
      logError('Feedback Generation', error, {
        role: session.user.role,
        questionIndex: session.currentIdx,
        answerLength: answer.length
      });
      showError(container, `Failed to get feedback: ${error.message}`, () => {
        // Retry getting feedback
        onSubmitAnswer(answer);
      });
    }
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

  function showError(container, message, onRetry) {
    container.innerHTML = `
      <div class="app-card">
        <div class="error-container">
          <h3 style="color: var(--hr-red); margin-bottom: 1rem;">⚠️ Something went wrong</h3>
          <p class="error-message">${message}</p>
          <button class="main-btn retry-btn" style="margin-top: 1.5rem;">Try Again</button>
          <button class="main-btn" style="margin-top: 0.5rem; background: #666;" onclick="location.reload()">Start Over</button>
        </div>
      </div>
    `;

    const retryBtn = container.querySelector('.retry-btn');
    retryBtn.onclick = onRetry;
  }
};
