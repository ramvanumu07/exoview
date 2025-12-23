// Question card and answer form
export const renderQuestionCard = (container, question, onSubmit) => {
  const cleanQuestion = question.replace(/^["'`*\\[\](){}<>]+|["'`*\\[\](){}<>]+$/g, '').trim();

  const questionDiv = document.createElement('div');
  questionDiv.className = "question-container";
  questionDiv.innerHTML = `<div class="question-text">${cleanQuestion}</div>`;
  container.appendChild(questionDiv);

  const answerDiv = document.createElement('div');
  answerDiv.className = "answer-container";
  answerDiv.innerHTML = `
    <form id="answer-form" autocomplete="off">
      <textarea id="user-answer" class="answer-textarea" required placeholder="Share your thoughts and experience..."></textarea>
      <div id="input-nudge" class="error-message hidden" aria-live="polite"></div>
      <button type="submit" class="btn btn-primary btn-full-width mt-lg">Submit Answer</button>
    </form>
  `;
  container.appendChild(answerDiv);

  answerDiv.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const val = answerDiv.querySelector('#user-answer').value.trim();
    const nudgeDiv = answerDiv.querySelector('#input-nudge');
    
    if (val.length < 10) {
      nudgeDiv.textContent = 'Please provide a more detailed answer (at least 10 characters)';
      nudgeDiv.classList.remove('hidden');
      setTimeout(() => nudgeDiv.classList.add('hidden'), 3000);
      return;
    }
    
    // Disable form while submitting
    const submitBtn = answerDiv.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Submitting...';
    
    onSubmit(val);
  };
};
