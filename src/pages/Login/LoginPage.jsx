// src/pages/Login/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

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

  const navigate = useNavigate();

  // --- LOGIC VALIDATION ---
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HÀM ĐIỀU HƯỚNG THEO ROLE (CORE LOGIC) ---
  const handleRoleRedirect = (role) => {
    // Chuẩn hóa role về chữ thường để so sánh
    const roleLower = role ? role.toLowerCase() : '';

    if (roleLower === 'tutor') {
      alert('Đăng nhập Tutor thành công! Chuyển hướng Tutor Dashboard...');
      // Điều hướng đến trang Overview của Tutor
      navigate('/app/tutor/overview');
    } else if (roleLower === 'student') {
      alert('Đăng nhập Student thành công! Chuyển hướng Student Dashboard...');
      // Điều hướng đến trang Overview của Student
      navigate('/app/overview');
    } else {
      // Mặc định nếu không rõ role hoặc role khác
      alert('Đăng nhập thành công! Chuyển hướng mặc định...');
      navigate('/app/overview');
    }
  };

  // --- LOGIC SUBMIT FORM ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Logging in:', { email, password });

    // 1. KIỂM TRA TÀI KHOẢN MẶC ĐỊNH (Hardcoded cho Dev/Test)
    const FAKE_TUTOR = { email: 'tutor@example.com', password: 'tutor123' };
    const FAKE_STUDENT = { email: 'student@example.com', password: 'student123' };

    if (email === FAKE_TUTOR.email && password === FAKE_TUTOR.password) {
      handleRoleRedirect('Tutor');
      return;
    }

    if (email === FAKE_STUDENT.email && password === FAKE_STUDENT.password) {
      handleRoleRedirect('Student');
      return;
    }

    // 2. KIỂM TRA TÀI KHOẢN TRONG LOCALSTORAGE (User đăng ký thật)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Tìm thấy user -> Điều hướng theo role đã lưu
      handleRoleRedirect(foundUser.role);
    } else {
      // 3. ĐĂNG NHẬP THẤT BẠI
      setErrors({ api: 'Email hoặc mật khẩu không đúng.' });
    }
  };

  return (
    <div className="login-page-container">
      {/* --------------- CỘT BÊN TRÁI (FORM) --------------- */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          <div className="login-logo">
             {/* Logo here if needed */}
          </div>

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
                  placeholder="Enter password"
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

            {/* --- Lỗi API --- */}
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
