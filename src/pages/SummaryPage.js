import { renderSummaryCard } from '../components/SummaryCard.js';

export const renderSummaryPage = (container, session, onRestart) => {
  container.innerHTML = `<div class="app-card"></div>`;
  const card = container.querySelector('.app-card');
  // Render styled summary into card
  renderSummaryCard(card, session, onRestart);
};
