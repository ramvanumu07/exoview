export const renderFormComponent = (container, onSubmit) => {
  container.innerHTML = `
    <form id="practice-form" autocomplete="off">
      <label class="main-label" for="job-role">Dream Job Role</label>
      <input type="text" id="job-role" maxlength="50" required placeholder="e.g. Software Engineer">
      <button type="submit" class="main-btn">Start Interview</button>
      <div id="form-error" class="error"></div>
    </form>
  `;
  const form = container.querySelector('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const role = form['job-role'].value.trim();
    if (role.length < 3) {
      form.querySelector('#form-error').textContent = 'Enter a real job role!';
      return;
    }
    onSubmit({ role });
  };
};
