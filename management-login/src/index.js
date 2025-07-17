// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ use 'react-dom/client' instead of 'react-dom'
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
