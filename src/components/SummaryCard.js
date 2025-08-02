import { escapeHTML } from '../utils/helpers.js';

export const renderSummaryCard = (container, session, onRestart) => {
  const avg = session.feedback
    .map(f => parseInt((f.rating || "0").match(/\d+/)?.[0] || 0))
    .filter(v => !isNaN(v))
    .reduce((a, b) => a + b, 0) / session.feedback.length || 0;

  // Card with overall info
  const wrapper = document.createElement('div');
  wrapper.className = 'summary-header fadein';
  wrapper.innerHTML = `
  <h2>🎉 Congratulations!</h2>
  <p class="summary-message">
    You scored <strong><span class="summary-rating">${avg.toFixed(1)}/10</span></strong> in your interview practice for the <strong><span class="summary-role">${escapeHTML(session.user.role)}</span></strong> role.
  </p>
  <p class="encouragement">Keep sharpening your skills to boost your confidence and land that job offer!</p>
`;
  container.appendChild(wrapper);


  // Loop each question into its own styled summary card
  session.questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <div class="summary-title">Q${i + 1}: ${escapeHTML(q)}</div>
      <div class="summary-row"><span class="summary-label">Your Answer:</span> ${escapeHTML(session.answers[i] || "-")}</div>
      <div class="summary-row">
        <span class="summary-label">Strengths:</span>
        <ul class="summary-bullets">
          ${session.feedback[i].strengths.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
        </ul>
      </div>
      <div class="summary-row">
        <span class="summary-label">Gaps:</span>
        <ul class="summary-bullets">
          ${session.feedback[i].gaps.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
        </ul>
      </div>
      <div class="summary-row">
        <span class="summary-label">Suggestions:</span>
        <ul class="summary-bullets">
          ${session.feedback[i].suggestions.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
        </ul>
      </div>
      <div class="summary-row"><span class="summary-label">HR Score:</span> <span class="summary-rating-badge">${escapeHTML(session.feedback[i].rating)}</span></div>
    `;
    container.appendChild(card);
  });

  // Restart Button
  const btn = document.createElement('button');
  btn.className = "main-btn";
  btn.style.margin = "1.3em auto 0 auto";
  btn.textContent = "Restart";
  btn.onclick = onRestart;
  container.appendChild(btn);
};
