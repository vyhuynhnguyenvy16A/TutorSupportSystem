// src/pages/Login/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import file CSS

// Import icons
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';


import dashboardPreview from '../../assets/hcmut.png';

const LoginPage = () => {
  // State cho input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State cho logic (ẩn/hiện pass, lỗi)
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate(); // Dùng để chuyển trang sau khi login

  // --- LOGIC VALIDATION ---
  const validateForm = () => {
    const newErrors = {};

    // Kiểm tra Email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Kiểm tra Password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    
    // Trả về true nếu không có lỗi, false nếu có lỗi
    return Object.keys(newErrors).length === 0;
  };

  // --- LOGIC SUBMIT FORM ---
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn form reload trang

    // 1. Kiểm tra lỗi client-side
    if (!validateForm()) {
      return; // Dừng lại nếu validation thất bại
    }

    // 2. Nếu validation OK, mô phỏng gọi API
    console.log('Submitting:', { email, password });

    // --- MÔ PHỎNG XỬ LÝ LỖI TỪ SERVER ---
    // (Đây là nơi bạn sẽ gọi API thật)
    
    // Giả sử: server trả về lỗi "Sai mật khẩu"
    const FAKE_ADMIN_EMAIL = 'admin@gmail.com';
    const FAKE_ADMIN_PASSWORD = 'password123';

    // 3. Kiểm tra dữ liệu nhập
    if (email === FAKE_ADMIN_EMAIL && password === FAKE_ADMIN_PASSWORD) {
      // 4. ĐĂNG NHẬP THÀNH CÔNG
      alert('Đăng nhập thành công! Đang chuyển đến trang Lịch...');
      
      // <-- SỬA ĐỔI QUAN TRỌNG: Chuyển hướng đến trang /app/schedule
      navigate('/app/schedule'); 
      
    } else {
      // 5. ĐĂNG NHẬP THẤT BẠI
      // Hiển thị lỗi chung (như từ server trả về)
      setErrors({ api: 'Email hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <div className="login-page-container">
      {/* --------------- CỘT BÊN TRÁI (FORM) --------------- */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          {/* Logo */}
          <div className="login-logo">
            {/* Bạn có thể dùng thẻ img nếu có file logo */}
          
            
          </div>

          {/* Tiêu đề */}
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Enter your email and password to access your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* --- Email --- */}
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
                  placeholder="5ellostore."
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

            {/* --- Lỗi API (lỗi server) --- */}
            {errors.api && <p className="error-text api-error">{errors.api}</p>}

            {/* --- Tùy chọn: Remember & Forgot --- */}
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>
              <Link to="/forgot-password">Forgot Your Password?</Link>
            </div>

            {/* --- Nút Log In --- */}
            <button type="submit" className="btn-login">
              Log In
            </button>
          </form>

          {/* --- Social Login --- */}
          <div className="divider">Or Login With</div>
          <div className="social-login-buttons">
            <button className="btn-social google">
              <FcGoogle /> <span>Google</span>
            </button>
            <button className="btn-social apple">
              <FaApple /> <span>Apple</span>
            </button>
          </div>

          {/* --- Link Đăng ký --- */}
          <p className="register-link">
            Don't Have An Account? <Link to="/register">Register Now.</Link>
          </p>
        </div>
      </div>

      {/* --------------- CỘT BÊN PHẢI (PROMO) --------------- */}
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

export default LoginPage;