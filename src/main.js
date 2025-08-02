import { renderHomePage } from './pages/HomePage.js';
import { renderInterviewPage } from './pages/InterviewPage.js';
import { renderSummaryPage } from './pages/SummaryPage.js';
import { createSessionState, resetSessionState } from './utils/helpers.js';

const root = document.getElementById('root');
let session = createSessionState();

const startHandler = (userInfo) => {
  session = createSessionState(userInfo);
  renderInterviewPage(root, session, () => {
    renderSummaryPage(root, session, () => {
      resetSessionState(session);
      renderHomePage(root, startHandler);
    });
  });
};

renderHomePage(root, startHandler);
