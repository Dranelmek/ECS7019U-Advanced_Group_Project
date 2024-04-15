import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/styles/Reset.css'
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Place the parent element into the empty page.
root.render(
    <App />
);


reportWebVitals();
