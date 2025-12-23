import { escapeHTML } from '../utils/helpers.js';

export const renderSummaryCard = (container, session, onRestart) => {
  const avg = session.feedback
    .map(f => parseInt((f.rating || "0").match(/\d+/)?.[0] || 0))
    .filter(v => !isNaN(v))
    .reduce((a, b) => a + b, 0) / session.feedback.length || 0;

  // Header with overall info
  const wrapper = document.createElement('div');
  wrapper.className = 'summary-header';
  wrapper.innerHTML = `
    <h2 class="summary-title">🎉 Interview Complete!</h2>
    <p class="summary-message">
      You scored <strong style="color: var(--accent-primary);">${avg.toFixed(1)}/10</strong> in your interview practice for <strong>${escapeHTML(session.user.role)}</strong>
    </p>
    <p class="summary-encouragement">Great job! Review your feedback below to continue improving your interview skills.</p>
  `;
  container.appendChild(wrapper);


  // Create summary grid
  const summaryGrid = document.createElement('div');
  summaryGrid.className = 'summary-grid';
  
  // Loop each question into its own styled summary card
  session.questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <div class="summary-card-title">Question ${i + 1}</div>
      <div class="question-text mb-md">${escapeHTML(q)}</div>
      
      <div class="summary-row">
        <span class="summary-label">Your Answer:</span>
      </div>
      <div class="summary-value mb-lg" style="color: var(--text-secondary); font-style: italic; margin-bottom: 1rem;">
        "${escapeHTML(session.answers[i] || "No answer provided")}"
      </div>
      
      <div class="summary-row">
        <span class="summary-label">✅ Strengths:</span>
      </div>
      <ul class="feedback-list mb-md">
        ${session.feedback[i].strengths.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
      </ul>
      
      <div class="summary-row">
        <span class="summary-label">⚠️ Areas to Improve:</span>
      </div>
      <ul class="feedback-list mb-md">
        ${session.feedback[i].gaps.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
      </ul>
      
      <div class="summary-row">
        <span class="summary-label">💡 Suggestions:</span>
      </div>
      <ul class="feedback-list mb-md">
        ${session.feedback[i].suggestions.map(pt => `<li>${escapeHTML(pt)}</li>`).join('')}
      </ul>
      
      <div class="summary-row">
        <span class="summary-label">Score:</span>
        <div class="rating-badge">${escapeHTML(session.feedback[i].rating)}</div>
      </div>
    `;
    summaryGrid.appendChild(card);
  });
  
  container.appendChild(summaryGrid);

  // Restart Button
  const btn = document.createElement('button');
  btn.className = "btn btn-primary btn-full-width mt-xl";
  btn.textContent = "Start New Interview Practice";
  btn.onclick = onRestart;
  container.appendChild(btn);
};
