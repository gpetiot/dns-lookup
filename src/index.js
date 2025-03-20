import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Log environment variables on startup
console.log('Environment variables check at startup:');
console.log('React environment:', process.env.NODE_ENV);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 