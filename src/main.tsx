import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Detect browser type and add class to html element
const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  if (isSafari) {
    document.documentElement.classList.add('browser-safari');
  } else {
    // Assume Chromium-based (Chrome, Edge, Opera, Brave, etc.)
    document.documentElement.classList.add('browser-chromium');
  }
};

// Run browser detection before rendering
detectBrowser();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);