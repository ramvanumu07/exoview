// Shows step/progress for current question
export const renderProgressBar = (container, progress, total) => {
  const outer = document.createElement('div');
  outer.className = 'progress-box';
  outer.innerHTML = `
    <div class="progress-label">Q${progress + 1 > total ? total : progress + 1} of ${total}</div>
    <div class="progressbar-bg">
      <div class="progress" style="width:${(progress / total) * 100}%"></div>
    </div>
  `;
  container.appendChild(outer);
};
