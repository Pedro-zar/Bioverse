import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Logo from '../../components/logo'
import styles from '../../styles/login.module.css';
import { trimExtraSpaces } from '../../utils/helpers'

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    if (trimExtraSpaces(username) === '') {
      setError('Username is required.');
      return;
    } else if (trimExtraSpaces(password) === '') {
      setError('Password is required.');
      return;
    }
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
  
      if (res.ok && data.role) {
        if (data.role === 'doctor') {
          router.push('/dashboard');
        } else if (data.role === 'patient') {
          router.push('/intake');
        }
      } else {
        setError(data.error || 'There was a problem with your username or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <Logo />
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h1 className={styles.welcomeText}>Welcome back</h1>
          <div className={styles.fieldGroup}>
            <label className={styles.labelText}>Username</label>
            <input 
              className={styles.fieldBox}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.labelText}>Password</label>
            <input 
              className={styles.fieldBox}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="●●●●●●●●"
              />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
          <button type="submit" className={styles.continueBtn}>Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
