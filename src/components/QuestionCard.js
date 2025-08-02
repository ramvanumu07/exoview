// Question card and answer form
export const renderQuestionCard = (container, question, onSubmit) => {
  const cleanQuestion = question.replace(/^["'`*\\[\](){}<>]+|["'`*\\[\](){}<>]+$/g, '').trim();

  const div = document.createElement('div');
  div.className = "question-block fadein";
  div.innerHTML = `
    <strong>${cleanQuestion}</strong>
    <form id="answer-form" autocomplete="off" style="margin-top:1.3em;">
      <textarea id="user-answer" rows="4" required placeholder="Type your answer…"></textarea>
      <div id="input-nudge" class="muted" aria-live="polite"></div>
      <button type="submit" class="main-btn">Submit Answer</button>
    </form>
  `;
  container.appendChild(div);
  div.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const val = div.querySelector('#user-answer').value.trim();
    if (val.length < 2) {
      div.querySelector('#input-nudge').textContent = 'Please give a specific answer!';
      setTimeout(() => div.querySelector('#input-nudge').textContent = '', 1700);
      return;
    }
    onSubmit(val);
  };
};
