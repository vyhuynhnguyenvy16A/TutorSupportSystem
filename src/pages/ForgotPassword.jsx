// src/pages/ForgotPassword/ForgotPassword.jsx

import React, { useState } from 'react';
// <-- THÊM MỚI: Import Link
import { Link, useNavigate } from 'react-router-dom';
// <-- THÊM MỚI: Import CSS
import './ForgotPassword.css'; 

// Import ảnh dashboard (giữ nguyên)
import dashboardPreview from '../assets/hcmut.png';

const ForgotPasswordPage = () => {
  // <-- SỬA ĐỔI: Chỉ cần state cho email
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // --- LOGIC VALIDATION (Rút gọn) ---
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra Email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
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

    // Nếu validation OK, mô phỏng gọi API
    console.log('Sending reset link to:', { email });
    
    // Giả sử: Gửi link thành công
    alert('Reset link sent to your email! (Check console)');
    navigate('/login'); // Chuyển về trang login
  };

  return (
    <div className="login-page-container">
      {/* --------------- CỘT BÊN TRÁI (FORM) --------------- */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Logo (giữ nguyên) */}
          <div className="login-logo">
           
          </div>

          {/* <-- SỬA ĐỔI: Tiêu đề */}
          <h2 className="login-title">Forgot Your Password?</h2>
          <p className="login-subtitle">
            No problem! Enter your email below and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* --- Email (Chỉ giữ lại email) --- */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
                placeholder="sellostore@company.com"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* <-- SỬA ĐỔI: Nút bấm --- */}
            <button type="submit" className="btn-login">
              Send Reset Link
            </button>
          </form>

          {/* <-- SỬA ĐỔI: Bỏ Social Login, thay bằng link quay về */}
          <p className="register-link" style={{ marginTop: '2rem' }}>
            Remembered your password? <Link to="/login">Back to Log In.</Link>
          </p>
        </div>
      </div>

      {/* --------------- CỘT BÊN PHẢI (PROMO) --------------- */}
      {/* (Giữ nguyên không thay đổi) */}
      <div className="login-promo-section">
        
        <img
          src={dashboardPreview}
          alt="Dashboard Preview"
          className="dashboard-preview-img"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;