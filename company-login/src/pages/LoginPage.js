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
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                  </svg>
                ) : (
                 // Closed Eye SVG (with a slash through it)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"/></svg>
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