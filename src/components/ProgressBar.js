// Shows step/progress for current question
export const renderProgressBar = (container, progress, total) => {
  const outer = document.createElement('div');
  outer.className = 'progress-container';
  outer.innerHTML = `
    <div class="progress-label">
      <span>Question ${progress > total ? total : progress} of ${total}</span>
      <span>${Math.round((progress / total) * 100)}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width:${(progress / total) * 100}%"></div>
    </div>
  `;
  container.appendChild(outer);
};
