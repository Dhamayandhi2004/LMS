import React, { useState } from 'react';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Email login handler using API
  const handleEmailLogin = async () => {
    try {
      // API call to the backend
      const response = await axios.post('https://lms-4n6b.onrender.com/api/login', {
        email,
        password,
      });
      localStorage.setItem('userEmail', email);

      console.log('Login successful!', response.data);
      // Redirect based on email
      if (email === 'admin@gmail.com'&& password==="admin@123") {
        navigate('/adminDashboard');
      } else {
        navigate('/userDashboard');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        alert('Email is not registered.');
      } else if (error.response?.status === 401) {
        alert('Invalid Credentials.');
      } else {
        alert('Login failed. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('userEmail', user.email);

      console.log('Google Sign-In successful:', user);
      navigate('/userDashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error.code, error.message);
      alert('Google Sign-In failed: ' + error.message);
    }
  };

  const goToRegister = () => navigate('/register');
  const handleClose = () => navigate('/');

  return (
    <div className="page-background">
      <div className="form-container">
        <span
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '48px',
            cursor: 'pointer',
            fontSize: '40px',
            color: 'black',
            zIndex: 10,
          }}
        >
          &times;
        </span>
        <h1 className="form-title">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button onClick={handleEmailLogin}>Login</button>
        <p>
          Don't have an account?{' '}
          <button onClick={goToRegister}>Register here</button>
        </p>
        <hr />
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Login;
