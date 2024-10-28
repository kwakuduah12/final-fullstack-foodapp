import React from 'react';
import ReactDOM from 'react-dom/client';
<<<<<<< HEAD:src/index.js
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
=======
import WrappedApp from './App';
import './Styles/App.css';
>>>>>>> 804743a5b75148959b85f375e612220e84dc8329:frontend/src/index.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WrappedApp />
  </React.StrictMode>,
  document.getElementById('root')
);
reportWebVitals();

