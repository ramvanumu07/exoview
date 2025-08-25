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
    const errorDiv = form.querySelector('#form-error');
    const role = form['job-role'].value.trim();

    // Clear previous errors
    errorDiv.textContent = '';

    if (role.length < 3) {
      errorDiv.textContent = 'Enter a real job role (at least 3 characters)!';
      return;
    }

    if (role.length > 50) {
      errorDiv.textContent = 'Job role is too long (max 50 characters)!';
      return;
    }

    // Disable the button to prevent double submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Starting...';

    try {
      onSubmit({ role });
    } catch (error) {
      console.error('Error starting interview:', error);
      errorDiv.textContent = 'Failed to start interview. Please try again.';
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };
};
