import { renderFormComponent } from '../components/Form.js';
import { typewriterEffect } from '../components/Typewriter.js';

export const renderHomePage = (container, onStart) => {
  container.innerHTML = `
    <div class="centered-outer">
      <section class="app-card">
        <h1 class="title">Exoview</h1>
        <div id="purpose-typewriter" class="typewriter-purpose"></div>
        <div id="user-form-container"></div>
      </section>
    </div>
  `;
  renderFormComponent(document.getElementById('user-form-container'), onStart);

  const purposeText = "Unleash your confidence. Practice real interview questions & get instant, honest feedback—tailored for freshers like you.";
  const typewriterElem = document.getElementById('purpose-typewriter');
  typewriterEffect(typewriterElem, purposeText, 30);
};