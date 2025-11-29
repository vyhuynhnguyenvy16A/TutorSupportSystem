// src/pages/RegisterPage/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

// Import icons
import { FiEye, FiEyeOff } from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Import Context
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // State form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    hoten: '',
    MSSV: '',
    SDT: '',
    namhoc: '1',
    NGAYSINH: '',
    GIOITINH: 'Nam',
    CCCD: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- VALIDATION ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.hoten) newErrors.hoten = 'Vui lòng nhập họ tên';
    if (!formData.MSSV) newErrors.MSSV = 'Vui lòng nhập MSSV';
    if (!formData.CCCD) newErrors.CCCD = 'Vui lòng nhập CCCD';
    if (!formData.SDT) newErrors.SDT = 'Vui lòng nhập SĐT';
    if (!formData.NGAYSINH) newErrors.NGAYSINH = 'Vui lòng chọn ngày sinh';

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      email: formData.email,
      password: formData.password,
      hoten: formData.hoten,
      MSSV: formData.MSSV,
      SDT: formData.SDT,
      namhoc: formData.namhoc,
      NGAYSINH: formData.NGAYSINH,
      GIOITINH: formData.GIOITINH,
      CCCD: formData.CCCD
    };

    const result = await register(payload);

    if (result.success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } else {
      setErrors({ api: result.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="register-page-container">
      {/* --- CỘT TRÁI (FORM) - Chiếm 60% --- */}
      <div className="register-form-section">
        <div className="register-form-wrapper">
          
          {/* 1. Phần Logo Banner (Full width nền xanh) */}
          <div className="register-logo">
            <img src={dashboardPreview} alt="logo" />
          </div>

          {/* 2. Phần Nội dung Form (Căn giữa, có giới hạn chiều rộng) */}
          <div className="register-content">
            <h2 className="register-title">Đăng ký Sinh viên</h2>
            <p className="register-subtitle">
              Hệ thống hỗ trợ học tập dành riêng cho sinh viên Bách Khoa.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              {/* HỌ TÊN & MSSV */}
              <div className="register-row">
                <div className="register-form-group">
                  <label>Họ và Tên</label>
                  <input 
                    type="text" 
                    name="hoten" 
                    value={formData.hoten} 
                    onChange={handleChange} 
                    placeholder="Nguyễn Văn A" 
                    className={errors.hoten ? 'input-error' : ''}
                  />
                  {errors.hoten && <p className="error-text">{errors.hoten}</p>}
                </div>
                <div className="register-form-group">
                  <label>MSSV</label>
                  <input 
                    type="text" 
                    name="MSSV" 
                    value={formData.MSSV} 
                    onChange={handleChange} 
                    placeholder="23xxxxx" 
                    className={errors.MSSV ? 'input-error' : ''}
                  />
                  {errors.MSSV && <p className="error-text">{errors.MSSV}</p>}
                </div>
              </div>

              {/* EMAIL */}
              <div className="register-form-group">
                <label>Email nhà trường</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="ten.ho@hcmut.edu.vn" 
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>

              {/* PASSWORD */}
              <div className="register-form-group">
                <label>Mật khẩu</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'input-error' : ''}
                    placeholder="Ít nhất 8 ký tự"
                  />
                  <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-form-group">
                <label>Xác nhận mật khẩu</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
              </div>

              {/* SDT & CCCD */}
              <div className="register-row">
                <div className="register-form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    name="SDT" 
                    value={formData.SDT} 
                    onChange={handleChange} 
                    placeholder="09xxxxxxxx" 
                    className={errors.SDT ? 'input-error' : ''}
                  />
                  {errors.SDT && <p className="error-text">{errors.SDT}</p>}
                </div>
                <div className="register-form-group">
                  <label>CCCD</label>
                  <input 
                    type="text" 
                    name="CCCD" 
                    value={formData.CCCD} 
                    onChange={handleChange} 
                    placeholder="0xxxxxxxxxxx" 
                    className={errors.CCCD ? 'input-error' : ''}
                  />
                  {errors.CCCD && <p className="error-text">{errors.CCCD}</p>}
                </div>
              </div>

              {/* NGÀY SINH, GIỚI TÍNH, NĂM HỌC */}
              <div className="register-row-three">
                <div className="register-form-group register-date">
                  <label>Ngày sinh</label>
                  <input 
                    type="date" 
                    name="NGAYSINH" 
                    value={formData.NGAYSINH} 
                    onChange={handleChange} 
                    className={errors.NGAYSINH ? 'input-error' : ''}
                  />
                  {errors.NGAYSINH && <p className="error-text">{errors.NGAYSINH}</p>}
                </div>

                <div className="register-form-group register-select">
                  <label>Giới tính</label>
                  <select 
                    name="GIOITINH" 
                    value={formData.GIOITINH} 
                    onChange={handleChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="register-form-group register-select">
                  <label>Năm thứ</label>
                  <select 
                    name="namhoc" 
                    value={formData.namhoc} 
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
              </div>

              {/* API ERROR MESSAGE */}
              {errors.api && <div className="error-text api-error">{errors.api}</div>}

              <button type="submit" className="btn-register" disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
              </button>
            </form>

            <p className="register-link">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;