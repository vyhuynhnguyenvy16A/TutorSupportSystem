// src/pages/SettingsPage/SettingsPage.jsx

import React, { useEffect, useState } from 'react';
// <-- THÊM MỚI: File CSS riêng cho trang Cài đặt
import './SettingsPage.css'; 
import { NavLink } from 'react-router-dom';
// <-- THÊM MỚI: Dùng avatar mẫu, bạn có thể thay bằng logo hcmut
import dashboardPreview from '../../assets/hcmut.png'; 
// <-- THÊM MỚI: Icon cho cảnh báo

import './SchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiAlertOctagon
} from 'react-icons/fi';

import { getStudentProfile } from '../../api/studentService.js';
const SettingsPage = () => {

  const [profile, setProfile] = useState({
    photo: dashboardPreview,
    name: "Loading..",
    age: '',
    mssv: '',
    cccd: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    nationality: '',
    city: '',
    birthday: '',
    trangthai: '',
    lichranh: '',
  })

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Sử dụng 'vi-VN' để có định dạng ngày/tháng/năm
    return date.toLocaleDateString('vi-VN'); 
  };

  // --- HÀM HELPER: Tính tuổi từ ngày sinh ---
  const calculateAge = (isoString) => {
    if (!isoString) return '';
    const birthDate = new Date(isoString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try{
        setIsLoading(true);
        const response = await getStudentProfile();

        console.log("Dữ liệu lấy từ API ", response)

        const data = response.meta.studentInfo;

        setProfile(prev => ({
          ...prev,

          name: data.fullname,
          mssv: data.mssv,
          email: data.email,
          mobile: data.phone,
          birthday: formatDate(data.birthday),
          address: data.address,
          cccd: data.cccd,
          age: calculateAge(data.birthday), // Giá trị mặc định nếu API thiếu
          gender: data.gender,
          trangthai: data.tinhtrang,
          nationality: data.nationality || 'Vietnam',
          city: data.city || 'Ho Chi Minh',
          lichranh: data.lichranh || "Chưa thiết lập",
        }))

      } catch(err){
        console.error(err);
        setError("Không thể tải thông tin sinh viên")
      } finally {
        setIsLoading(true)
      }
    };

    fetchProfile();
  }, [])

  return (
    <div className="dashboard-page-container">
      
      {/* 1. THANH BÊN TRÁI (SIDEBAR) */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>

        {/* 4 mục điều hướng */}
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link">
            <FiHome />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/app/schedule" className="nav-link">
            <FiCalendar />
            <span>Lịch</span>
          </NavLink>
          <NavLink to="/app/register-schedule" className="nav-link">
            <FiPlusSquare />
            <span>Đăng kí lịch</span>
          </NavLink>
          {/* Link này sẽ tự động active vì URL là /app/settings */}
          <NavLink to="/app/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Thanh ngang trên cùng) */}
        <header className="dashboard-header">
          {/* <-- SỬA ĐỔI: Đổi tiêu đề cho trang Cài đặt --> */}
          <h1 className="header-title">Hồ Sơ & Cài Đặt</h1>
          
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info">
                <span>Darrell Steward</span>
                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>

        {/* 2.2 NỘI DUNG TRANG */}
        <main className="dashboard-page-content">
          
          {/* <-- SỬA ĐỔI: Đây là nội dung trang Cài đặt (cũ) của bạn --> */}
          <div className="settings-content-grid">
            
            {/* CỘT BÊN TRÁI (Thông tin cá nhân) */}
            <div className="profile-details-column">
              <div className="profile-section">
                <h3 className="section-title">Personal Details</h3>
                <div className="avatar-section">
                  <span>Photo:</span>
                  <img src={profile.photo} alt="Student Avatar" />
                </div>
                <div className="form-field-row">
                  <label>Name:</label>
                  <div className="field-value">{profile.name}</div>
                </div>
                <div className="form-field-row">
                  <label>MSSV (Mã số sinh viên):</label>
                  <div className="field-value">{profile.mssv}</div>
                </div>
                <div className="form-field-row">
                  <label>CCCD (Căn cước công dân):</label>
                  <div className="field-value">{profile.cccd}</div>
                </div>
                <div className="form-field-row">
                  <label>Age:</label>
                  <div className="field-value">{profile.age}</div>
                </div>
                <div className="form-field-row">
                  <label>Date of Birth:</label>
                  <div className="field-value">{profile.birthday}</div>
                </div>
                <div className="form-field-row">
                  <label>Gender:</label>
                  <div className="field-value">{profile.gender}</div>
                </div>
              </div>
              <div className="profile-section">
                <h3 className="section-title">Contact Details</h3>
                <div className="form-field-row">
                  <label>Mobile Number:</label>
                  <div className="field-value">{profile.mobile}</div>
                </div>
                <div className="form-field-row">
                  <label>Email Address:</label>
                  <div className="field-value">{profile.email}</div>
                </div>
                <div className="form-field-row">
                  <label>Nationality:</label>
                  <div className="field-value">{profile.nationality}</div>
                </div>
                <div className="form-field-row-full">
                  <label>Trạng Thái Tìm Tutor:</label>
                  <div className="field-value">{profile.trangthai}</div>
                </div>
                <div className="form-field-row">
                  <label>City:</label>
                  <div className="field-value">{profile.city}</div>
                </div>
                <div className="form-field-row">
                  <label>Lịch rảnh:</label>
                  <div className="field-value">{profile.lichranh}</div>
                </div>
              </div>
            </div>

            {/* CỘT BÊN PHẢI (Trạng thái học phí) */}
            
          </div>
          {/* <-- Kết thúc nội dung trang Cài đặt --> */}

        </main>
      </div>
    </div>
  );
};

export default SettingsPage;