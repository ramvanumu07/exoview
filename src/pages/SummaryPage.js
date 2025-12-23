import { renderSummaryCard } from '../components/SummaryCard.js';
import { getRecentErrors } from '../utils/helpers.js';

export const renderSummaryPage = (container, session, onRestart) => {
  container.innerHTML = `
    <div class="app-container">
      <div class="main-content">
        <div class="chat-card" id="summary-card"></div>
      </div>
    </div>
  `;
  const card = container.querySelector('#summary-card');
  // Render styled summary into card
  renderSummaryCard(card, session, onRestart);

  // Add hidden debug feature - triple click on title to show error logs
  const titleElement = card.querySelector('h2');
  if (titleElement) {
    let clickCount = 0;
    titleElement.addEventListener('click', () => {
      clickCount++;
      setTimeout(() => { clickCount = 0; }, 500);

      if (clickCount === 3) {
        showDebugInfo(card);
      }
    });
  }
};

function showDebugInfo(container) {
  const errors = getRecentErrors();
  const debugDiv = document.createElement('div');
  debugDiv.className = 'debug-info';
  debugDiv.style.cssText = `
    margin-top: 2rem; 
    padding: 1rem; 
    background: #1a1a1a; 
    border-radius: 8px; 
    border: 1px solid #333;
    max-height: 300px;
    overflow-y: auto;
  `;

  debugDiv.innerHTML = `
    <h4 style="color: var(--hr-yellow); margin-bottom: 1rem;">🐛 Debug Info (${errors.length} recent errors)</h4>
    ${errors.length === 0 ?
      '<p style="color: var(--hr-green);">No recent errors! 🎉</p>' :
      errors.map(error => `
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: #2a2a2a; border-radius: 4px;">
          <strong style="color: var(--hr-red);">${error.context}</strong>
          <br><small style="color: #999;">${error.timestamp}</small>
          <br><span style="color: #fff;">${error.message}</span>
        </div>
      `).join('')
    }
    <button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #333; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Close</button>
  `;

  container.appendChild(debugDiv);
}
