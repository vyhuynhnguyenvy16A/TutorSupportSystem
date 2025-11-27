// src/pages/RegisterPage/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

// Import icons
import { FiEye, FiEyeOff, FiUser, FiBookOpen } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

// Import ảnh dashboard
import dashboardPreview from '../../assets/hcmut.png';

const RegisterPage = () => {
  // State form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State Role ('Student' | 'Tutor' | '')
  const [role, setRole] = useState('');

  // State logic
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // --- LOGIC VALIDATION ---
  const validateForm = () => {
    const newErrors = {};

    // 1. Validate Role
    if (!role) {
      newErrors.role = 'Please select a role (Student or Tutor)';
    }

    // 2. Validate Email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    // 3. Validate Password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // 4. Validate Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- LOGIC SUBMIT FORM ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // 1. Tạo đối tượng User mới
    const newUser = {
      email: email,
      password: password,
      role: role
    };

    // 2. Lưu vào localStorage (Giả lập Database)
    // Lấy danh sách users cũ nếu có
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kiểm tra xem email đã tồn tại chưa (Optional)
    const userExists = existingUsers.some(u => u.email === email);
    if (userExists) {
      setErrors({ email: 'This email is already registered.' });
      return;
    }

    // Thêm user mới vào danh sách
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // 3. Thông báo thành công
    console.log('Registered successfully:', newUser);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');

    // 4. CHUYỂN HƯỚNG VỀ TRANG LOGIN
    navigate('/login');
  };

  return (
    <div className="login-page-container">
      {/* --------------- CỘT BÊN TRÁI (FORM) --------------- */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-logo">
            {/* Placeholder Logo */}
          </div>

          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">
            Join us to learn or teach efficiently.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* <-- ROLE SELECTION --> */}
            <div className="form-group">
              <label>I want to be a...</label>
              <div className="role-selection-group">
                <button
                  type="button" 
                  className={`role-btn ${role === 'Student' ? 'active' : ''}`}
                  onClick={() => setRole('Student')}
                >
                  <FiUser className="role-icon"/>
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  className={`role-btn ${role === 'Tutor' ? 'active' : ''}`}
                  onClick={() => setRole('Tutor')}
                >
                  <FiBookOpen className="role-icon"/>
                  <span>Tutor</span>
                </button>
              </div>
              {errors.role && <p className="error-text">{errors.role}</p>}
            </div>

            {/* --- Email --- */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
                placeholder="name@example.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* --- Password --- */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'input-error' : ''}
                  placeholder="Min 6 characters"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            {/* --- Confirm Password --- */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  placeholder="Repeat password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="form-options-register">
              <span>By signing up, you agree to our Terms of Service.</span>
            </div>

            <button type="submit" className="btn-login">
              Sign Up
            </button>
          </form>

          <div className="divider">Or Sign Up With</div>
          <div className="social-login-buttons">
            <button className="btn-social google">
              <FcGoogle /> <span>Google</span>
            </button>
            <button className="btn-social apple">
              <FaApple /> <span>Apple</span>
            </button>
          </div>

          <p className="register-link">
            Already Have An Account? <Link to="/login">Log In Now.</Link>
          </p>
        </div>
      </div>

      {/* --------------- CỘT BÊN PHẢI (PROMO) --------------- */}
      <div className="login-promo-section">
        <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>Join Our Community</h2>
        <p style={{marginBottom: '2rem', opacity: 0.9}}>Experience the best learning management system.</p>
        <img
          src={dashboardPreview}
          alt="Dashboard Preview"
          className="dashboard-preview-img"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
