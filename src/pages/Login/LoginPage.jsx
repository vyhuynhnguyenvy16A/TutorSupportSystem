// src/pages/Login/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

import { useAuth } from '../../context/AuthContext';

// Import icons
import { FiEye, FiEyeOff } from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

const LoginPage = () => {
  // State cho input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State cho logic (ẩn/hiện pass, lỗi)
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // state loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // lấy login từ AuthContext
  const { login } = useAuth();

  // --- LOGIC VALIDATION ---
  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- LOGIC SUBMIT FORM ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const userData = await login(email, password);

    if (!userData) {
      setErrors({ api: "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu." });
      setIsSubmitting(false);
      return;
    }

    console.log('Logging in:', { email, password });

    const role = userData.role;

    if (role === "TUTOR") {
      navigate('/app/tutor/overview');
    } else if (role === "STUDENT") {
      navigate('/app/overview');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="login-page-container">
      {/* --- CỘT TRÁI (FORM) --- */}
      <div className="login-form-section">
        <div className="login-form-wrapper">
          
          {/* 1. Phần Logo Banner (Full width nền xanh) */}
          <div className="login-logo">
            <img src={dashboardPreview} alt="logo" />
          </div>

          {/* 2. Phần Nội dung Form (Căn giữa) */}
          <div className="login-content">
            <h2 className="login-title">Đăng Nhập</h2>
            <p className="login-subtitle">
              Nhập email và mật khẩu để truy cập tài khoản của bạn.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              {/* --- Email --- */}
              <div className="login-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="ten.ho@hcmut.edu.vn"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              {/* --- Password --- */}
              <div className="login-form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? 'input-error' : ''}
                    placeholder="Ít nhất 8 ký tự"
                    disabled={isSubmitting}
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

              {/* --- Nút Log In --- */}
              <button type="submit" className="btn-login" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : "Đăng Nhập"}
              </button>
            </form>

            {/* --- Link Đăng ký --- */}
            <p className="register-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;