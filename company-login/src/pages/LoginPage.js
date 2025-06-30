import React, { useState } from 'react';
import CustomAlertDialog from '../components/CustomAlertDialog';
import './LoginPage.css'; // Import the dedicated CSS file

const LoginPage = ({ setCurrentPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertConfig, setAlertConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    if (username === "admin" && password === "password") {
      setAlertConfig({
        message: 'Login successful!',
        type: 'alert',
        onConfirm: () => {
          setAlertConfig(null);
          setCurrentPage('home');
        }
      });
    } else {
      setAlertConfig({
        message: 'Login failed: Invalid username/email or password.',
        type: 'alert',
        onConfirm: () => setAlertConfig(null)
      });
    }
    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome</h2>
        <p className="login-text">
          For demo purposes, use Username/Email: `admin` and Password: `password`.
        </p>
        <div className="input-group">
          <div>
            <label htmlFor="username" className="input-label">Username / Email</label>
            <input
              type="text"
              id="username"
              className="input-field"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <label htmlFor="password" className="input-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="input-field password-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.565 3.565a1 1 0 00-1.414 1.414l.707.707A11.96 11.96 0 001 12c.48.88 1.135 1.66 1.942 2.335l-.707.707a1 1 0 001.414 1.414L12 6.414l-.707-.707a1 1 0 00-1.414 0L3.565 3.565zM20.435 20.435a1 1 0 001.414-1.414l-.707-.707A11.96 11.96 0 0023 12c-.48-.88-1.135-1.66-1.942-2.335l.707-.707a1 1 0 00-1.414-1.414L12 17.586l.707.707a1 1 0 001.414 0l6.314-6.314zM12 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                ) : (
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M.305 11.165A1.5 1.5 0 011.5 9h21a1.5 1.5 0 011.195 2.165l-10.5 13a1.5 1.5 0 01-2.39 0l-10.5-13zM12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </div>
          </div>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" /> Remember me
            </label>
            <button className="forgot-password-btn">Forget password?</button>
          </div>
          <button onClick={handleLogin} className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign in'}
          </button>
        </div>
      </div>
      {alertConfig && (
        <CustomAlertDialog
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
        />
      )}
    </div>
  );
};

export default LoginPage;