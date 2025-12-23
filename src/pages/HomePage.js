import { renderFormComponent } from '../components/Form.js';
import { typewriterEffect } from '../components/Typewriter.js';

export const renderHomePage = (container, onStart) => {
  container.innerHTML = `
    <div class="app-container">
      <div class="main-content">
        <div class="app-header">
          <h1 class="app-title">ExoView</h1>
          <div id="purpose-typewriter" class="typewriter"></div>
        </div>
        <div class="chat-card">
          <div id="user-form-container"></div>
        </div>
      </div>
    </div>
  `;
  renderFormComponent(document.getElementById('user-form-container'), onStart);

  const purposeText = "AI-powered interview practice with instant feedback. Perfect for freshers ready to ace their next opportunity.";
  const typewriterElem = document.getElementById('purpose-typewriter');
  typewriterEffect(typewriterElem, purposeText, 40);
};