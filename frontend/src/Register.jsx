import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleRegister = async () => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://lms-4n6b.onrender.com/api/register', {
        username,
        email,
        password,
      });

      console.log('Server Response:', response.data);
      alert('Registration successful!');
      navigate('/'); // Redirect to homepage
    } catch (error) {
      console.error('Registration Error:', error);
      alert(
        error.response?.data?.message || 'This email is already Registered..'
      );
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
