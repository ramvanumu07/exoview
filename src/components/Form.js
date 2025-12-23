export const renderFormComponent = (container, onSubmit) => {
  container.innerHTML = `
    <form id="practice-form" autocomplete="off" class="form-container">
      <div class="form-group">
        <label class="form-label" for="job-role">Target Job Role</label>
        <input type="text" id="job-role" class="form-input" maxlength="50" required placeholder="e.g. Software Engineer, Data Analyst, Product Manager">
      </div>
      <button type="submit" class="btn btn-primary btn-full-width">Start Interview Practice</button>
      <div id="form-error" class="error-message hidden"></div>
    </form>
  `;
  const form = container.querySelector('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const errorDiv = form.querySelector('#form-error');
    const role = form['job-role'].value.trim();

    // Clear previous errors
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');

    if (role.length < 3) {
      errorDiv.textContent = 'Please enter a valid job role (at least 3 characters)';
      errorDiv.classList.remove('hidden');
      return;
    }

    if (role.length > 50) {
      errorDiv.textContent = 'Job role is too long (maximum 50 characters)';
      errorDiv.classList.remove('hidden');
      return;
    }

    // Disable the button to prevent double submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Starting Interview...';

    try {
      onSubmit({ role });
    } catch (error) {
      console.error('Error starting interview:', error);
      errorDiv.textContent = 'Failed to start interview. Please try again.';
      errorDiv.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  };
};
