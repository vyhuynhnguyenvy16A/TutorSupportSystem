// src/pages/TutorSchedulePage/TutorSchedulePage.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSchedulePage.css'; 

import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiDownload
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Dữ liệu giả cho lịch dạy của Giảng viên
const mockTutorSchedule = [
  { id: 1, subject: 'Công nghệ phần mềm', student: 'Nguyễn Văn A', time: '23/05/2025 09:00', status: 'Đã xác nhận', result: 'Hoàn thành' },
  { id: 2, subject: 'Trí tuệ nhân tạo', student: 'Trần Thị B', time: '23/05/2025 10:30', status: 'Chờ sinh viên', result: 'Chờ SV' },
  { id: 3, subject: 'Mạng máy tính', student: 'Lê Văn C', time: '22/05/2025 14:00', status: 'Đã hủy', result: 'SV hủy' },
  { id: 4, subject: 'An toàn thông tin', student: 'Phạm Thị D', time: '21/05/2025 11:00', status: 'Đã xác nhận', result: 'Hoàn thành' },
  { id: 5, subject: 'Cấu trúc dữ liệu', student: 'Võ Văn E', time: '20/05/2025 15:00', status: 'Chờ sinh viên', result: 'Chờ SV' },
];

const TutorSchedulePage = () => {
  return (
    <div className="dashboard-page-container">
      
      {/* 1. SIDEBAR (Đã đổi NavLink) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/tutor/overview" className="nav-link">
            <FiHome />
            <span>Tổng quan</span>
          </NavLink>
          <NavLink to="/app/tutor/schedule" className="nav-link">
            <FiCalendar />
            <span>Lịch dạy</span>
          </NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link">
            <FiPlusSquare />
            <span>Quản lý Slots</span>
          </NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link">
            <FiSettings />
            <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="dashboard-main-content">
        
        {/* 2.1 HEADER (Đã đổi tiêu đề) */}
        <header className="dashboard-header">
          <h1 className="header-title">Lịch dạy của tôi</h1>
          <div className="header-search">
            <FiSearch />
            <input type="text" placeholder="Tìm kiếm lịch dạy..." />
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info">
                <span>Jane Doe (GV)</span>
                <small>Lecturer</small>
              </div>
            </div>
          </div>
        </header>

        {/* 2.2 NỘI DUNG TRANG */}
        <main className="dashboard-page-content">
          
          <div className="stats-cards">
            <div className="stat-card">
              <p>Lớp học tuần này</p>
              <h3>12</h3>
            </div>
            <div className="stat-card">
              <p>Lịch chờ duyệt</p>
              <h3>3</h3>
            </div>
          </div>

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
                  <th>SINH VIÊN</th>
                  <th>THỜI GIAN</th>
                  <th>TRẠNG THÁI</th>
                  <th>KẾT QUẢ</th>
                </tr>
              </thead>
              <tbody>
                {mockTutorSchedule.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.subject}</td>
                    <td>{reg.student}</td>
                    <td>{reg.time}</td>
                    <td>
                      {/* Đổi logic class CSS theo trạng thái của Giảng viên */}
                      <span className={`status ${
                        reg.status === 'Đã xác nhận' ? 'status-success' :
                        reg.status === 'Chờ sinh viên' ? 'status-pending' :
                        reg.status === 'Đã hủy' ? 'status-failed' : ''
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td>{reg.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default TutorSchedulePage;