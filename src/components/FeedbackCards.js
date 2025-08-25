import { escapeHTML } from '../utils/helpers.js';

export const renderFeedbackCards = (container, feedback) => {
  const div = document.createElement('div');
  div.className = 'feedback-area fadein';
  div.innerHTML = `
    <div class="feedback-cards">
      <div class="feedback-card strong">
        <div class="feedback-title">What went well:</div>
        <ul>${feedback.strengths.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
      <div class="feedback-card gap">
        <div class="feedback-title">Gaps / What was missing:</div>
        <ul>${feedback.gaps.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
      <div class="feedback-card suggest">
        <div class="feedback-title">Suggestions:</div>
        <ul>${feedback.suggestions.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
      <div class="feedback-card rating">
        <div class="feedback-title">HR Score:</div>
        <span class="rating-badge">${escapeHTML(feedback.rating)}</span>
      </div>
    </div>
  `;
  container.appendChild(div);
};
