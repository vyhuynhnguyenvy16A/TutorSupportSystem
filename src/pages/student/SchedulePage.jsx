// src/pages/SchedulePage/SchedulePage.jsx

import React from 'react';
// <-- THÊM MỚI: Dùng NavLink để style link đang active
import { NavLink } from 'react-router-dom';
// <-- THÊM MỚI: CSS riêng cho trang này
import './SchedulePage.css'; 

// <-- THÊM MỚI: Import icons (FiHome, FiCalendar...)
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiDownload
} from 'react-icons/fi';
// <-- THÊM MỚI: Import logo
import dashboardPreview from '../../assets/hcmut.png';

// Dữ liệu giả cho bảng
const mockRegistrations = [
  { id: 1, subject: 'Công nghệ phần mềm', lecturer: 'Nguyễn Văn A', time: '23/05/2025 09:00', status: 'Thành công', result: 'Đã duyệt' },
  { id: 2, subject: 'Trí tuệ nhân tạo', lecturer: 'Trần Thị B', time: '23/05/2025 10:30', status: 'Đang xử lí', result: 'Chờ duyệt' },
  { id: 3, subject: 'Mạng máy tính', lecturer: 'Lê Văn C', time: '22/05/2025 14:00', status: 'Thất bại', result: 'Trùng lịch' },
  { id: 4, subject: 'An toàn thông tin', lecturer: 'Phạm Thị D', time: '21/05/2025 11:00', status: 'Thành công', result: 'Đã duyệt' },
  { id: 5, subject: 'Cấu trúc dữ liệu', lecturer: 'Nguyễn Văn A', time: '20/05/2025 15:00', status: 'Đang xử lí', result: 'Chờ duyệt' },
];

const SchedulePage = () => {
  return (
    <div className="dashboard-page-container">
      
      {/* =================================================== */}
      {/* 1. THANH BÊN TRÁI (SIDEBAR)                       */}
      {/* (Nội dung đã được sửa theo yêu cầu của bạn)        */}
      {/* =================================================== */}
      <aside className="dashboard-sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>

        {/* 4 mục bạn yêu cầu */}
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
          <NavLink to="/app/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* =================================================== */}
      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI)                */}
      {/* =================================================== */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Thanh ngang trên cùng) */}
        <header className="dashboard-header">
          <h1 className="header-title">Lịch của tôi</h1>
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Tìm kiếm cuộc họp..." />
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

        {/* 2.2 NỘI DUNG TRANG (Thẻ thống kê và Bảng) */}
        <main className="dashboard-page-content">
          {/* Thẻ thống kê */}
          <div className="stats-cards">
            <div className="stat-card">
              <p>Cuộc họp tuần này</p>
              <h3>12</h3>
            </div>
            <div className="stat-card">
              <p>Lịch chờ xác nhận</p>
              <h3>3</h3>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="table-container">
            <div className="tabs">
              <button className="tab active">Lịch sắp tới</button>
              <button className="tab">Lịch đã qua</button>
            </div>
            <div className="table-filters">
              <input type="text" placeholder="Tìm tên sinh viên..." className="filter-search" />
              <input type="date" className="filter-date" />
              <button className="btn-export"><FiDownload /> Export</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>MÔN HỌC</th>
                  <th>GIẢNG VIÊN</th>
                  <th>THỜI GIAN</th>
                  <th>TRẠNG THÁI</th>
                  <th>KẾT QUẢ</th>
                </tr>
              </thead>
              <tbody>
               {/* Map qua dữ liệu 'mockRegistrations' mới */}
                {mockRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.subject}</td>
                    <td>{reg.lecturer}</td>
                    <td>{reg.time}</td>
                    <td>
                      {/* Logic mới để đổi class CSS theo trạng thái */}
                      <span className={`status ${
                        reg.status === 'Thành công' ? 'status-success' :
                        reg.status === 'Đang xử lí' ? 'status-pending' :
                        reg.status === 'Thất bại' ? 'status-failed' : ''
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td>{reg.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <-- SỬA ĐỔI: Kết thúc ở đây --> */}
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default SchedulePage;