import { fetchInterviewQuestions, fetchHRFeedback } from '../api/groqApi.js';
import { renderProgressBar } from '../components/ProgressBar.js';
import { renderQuestionCard } from '../components/QuestionCard.js';
import { renderFeedbackCards } from '../components/FeedbackCards.js';
import { logError } from '../utils/helpers.js';

export const renderInterviewPage = async (container, session, onComplete) => {
  container.innerHTML = `
    <div class="app-container">
      <div class="main-content">
        <div class="loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">Generating tailored interview questions for ${session.user.role}...</div>
        </div>
      </div>
    </div>
  `;

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
    container.innerHTML = `
      <div class="app-container">
        <div class="main-content">
          <div class="chat-card" id="question-card"></div>
        </div>
      </div>
    `;
    const card = container.querySelector('#question-card');
    renderProgressBar(card, session.currentIdx, 5);
    renderQuestionCard(card, session.questions[session.currentIdx], onSubmitAnswer);
  }

  async function onSubmitAnswer(answer) {
    session.answers[session.currentIdx] = answer;
    container.innerHTML = `
      <div class="app-container">
        <div class="main-content">
          <div class="loading">
            <div class="loading-spinner"></div>
            <div class="loading-text">Analyzing your response and generating feedback...</div>
          </div>
        </div>
      </div>
    `;

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
    container.innerHTML = `
      <div class="app-container">
        <div class="main-content">
          <div class="chat-card" id="feedback-card"></div>
        </div>
      </div>
    `;
    const card = container.querySelector('#feedback-card');
    renderProgressBar(card, session.currentIdx + 1, 5);
    renderFeedbackCards(card, fb);

    const nextBtn = document.createElement('button');
    nextBtn.className = "btn btn-primary btn-full-width mt-xl";
    nextBtn.textContent = session.currentIdx < 4 ? "Continue to Next Question" : "View Final Results";
    nextBtn.onclick = () => {
      session.currentIdx += 1;
      if (session.currentIdx < 5) nextQuestion();
      else onComplete();
    };
    card.appendChild(nextBtn);
  }

  function showError(container, message, onRetry) {
    container.innerHTML = `
      <div class="app-container">
        <div class="main-content">
          <div class="chat-card">
            <div class="error-container">
              <h3 style="color: var(--error); margin-bottom: 1rem;">⚠️ Something went wrong</h3>
              <div class="error-message">${message}</div>
              <button class="btn btn-primary mt-lg" id="retry-btn">Try Again</button>
              <button class="btn btn-secondary mt-sm" onclick="location.reload()">Start Over</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const retryBtn = container.querySelector('#retry-btn');
    retryBtn.onclick = onRetry;
  }
};
