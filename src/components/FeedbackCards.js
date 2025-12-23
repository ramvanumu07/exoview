import { escapeHTML } from '../utils/helpers.js';

export const renderFeedbackCards = (container, feedback) => {
  const div = document.createElement('div');
  div.className = 'feedback-grid';
  div.innerHTML = `
    <div class="feedback-card strengths">
      <div class="feedback-title">✅ Strengths</div>
      <div class="feedback-content">
        <ul class="feedback-list">${feedback.strengths.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="feedback-card gaps">
      <div class="feedback-title">⚠️ Areas for Improvement</div>
      <div class="feedback-content">
        <ul class="feedback-list">${feedback.gaps.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="feedback-card suggestions">
      <div class="feedback-title">💡 Suggestions</div>
      <div class="feedback-content">
        <ul class="feedback-list">${feedback.suggestions.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="feedback-card rating">
      <div class="feedback-title">📊 Interview Score</div>
      <div class="feedback-content">
        <div class="rating-badge">${escapeHTML(feedback.rating)}</div>
      </div>
    </div>
  `;
  container.appendChild(div);
};
