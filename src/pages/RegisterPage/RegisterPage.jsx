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

  // State form fields (Khớp với yêu cầu API)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // Chỉ dùng để validate ở frontend
    hoten: '',
    MSSV: '',
    SDT: '',
    namhoc: '1', // Mặc định năm 1
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

    // Validate Email
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải từ 8 ký tự trở lên';
    }

    // Validate Confirm Password
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

    // Chuẩn bị payload đúng format API yêu cầu (bỏ confirmPassword)
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

    console.log("Sending Register Payload:", payload);

    // Gọi hàm register từ Context
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
    <div className="login-page-container">
      {/* CỘT TRÁI (FORM) */}
      <div className="login-form-section">
        <div className="login-form-wrapper" style={{maxWidth: '500px'}}>
          <h2 className="login-title">Đăng ký Sinh viên</h2>
          <p className="login-subtitle">
            Hệ thống hỗ trợ học tập dành riêng cho sinh viên Bách Khoa.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* HỌ TÊN & MSSV (2 cột) */}
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Họ và Tên</label>
                <input type="text" name="hoten" value={formData.hoten} onChange={handleChange} placeholder="Nguyễn Văn A" className={errors.hoten ? 'input-error' : ''}/>
                {errors.hoten && <p className="error-text">{errors.hoten}</p>}
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>MSSV</label>
                <input type="text" name="MSSV" value={formData.MSSV} onChange={handleChange} placeholder="23xxxxx" className={errors.MSSV ? 'input-error' : ''}/>
                {errors.MSSV && <p className="error-text">{errors.MSSV}</p>}
              </div>
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email nhà trường</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="ten.ho@hcmut.edu.vn" className={errors.email ? 'input-error' : ''}/>
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
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
             <div className="form-group">
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

            {/* SDT & CCCD (2 cột) */}
            <div style={{display: 'flex', gap: '1rem'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Số điện thoại</label>
                <input type="text" name="SDT" value={formData.SDT} onChange={handleChange} placeholder="09xxxxxxxx" className={errors.SDT ? 'input-error' : ''}/>
                {errors.SDT && <p className="error-text">{errors.SDT}</p>}
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>CCCD</label>
                <input type="text" name="CCCD" value={formData.CCCD} onChange={handleChange} placeholder="0xxxxxxxxxxx" className={errors.CCCD ? 'input-error' : ''}/>
                {errors.CCCD && <p className="error-text">{errors.CCCD}</p>}
              </div>
            </div>

            {/* NGÀY SINH, GIỚI TÍNH, NĂM HỌC (3 cột) */}
            <div style={{display: 'flex', gap: '1rem'}}>
               <div className="form-group" style={{flex: 2}}>
                <label>Ngày sinh</label>
                <input type="date" name="NGAYSINH" value={formData.NGAYSINH} onChange={handleChange} className={errors.NGAYSINH ? 'input-error' : ''}/>
                {errors.NGAYSINH && <p className="error-text">{errors.NGAYSINH}</p>}
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label>Giới tính</label>
                <select name="GIOITINH" value={formData.GIOITINH} onChange={handleChange} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid #d1d5db'}}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label>Năm thứ</label>
                <select name="namhoc" value={formData.namhoc} onChange={handleChange} style={{width:'100%', padding:'0.75rem', borderRadius:'8px', border:'1px solid #d1d5db'}}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            {/* API ERROR MESSAGE */}
            {errors.api && <div className="error-text api-error" style={{textAlign:'center', marginBottom:'1rem'}}>{errors.api}</div>}

            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
            </button>
          </form>

          <p className="register-link" style={{marginTop: '1.5rem'}}>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay.</Link>
          </p>
        </div>
      </div>

      {/* CỘT PHẢI (BANNER) */}
      <div className="login-promo-section">
        <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>Chào mừng tân sinh viên</h2>
        <p style={{marginBottom: '2rem', opacity: 0.9}}>Hệ thống kết nối và hỗ trợ học tập hiệu quả.</p>
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