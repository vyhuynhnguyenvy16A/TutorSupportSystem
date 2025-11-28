// src/pages/CalendarPage/CalendarPage.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi';
import './CalendarPage.css';

// Import Layout (Sidebar/Header) để giữ đồng bộ giao diện
import './SchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell 
} from 'react-icons/fi';
import hcmutLogo from '../assets/hcmut.png'; 

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]); // Chứa danh sách lịch họp từ API
  const [loading, setLoading] = useState(true);

  // --- 1. GỌI API ---
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await fetch('http://localhost:3069/api/student/calendar');
        if (!response.ok) {
          throw new Error('Lỗi kết nối server');
        }
        const data = await response.json();
        // Giả sử API trả về mảng các object: [{ date: '2025-11-27', title: 'Họp nhóm' }, ...]
        setMeetings(data); 
      } catch (error) {
        console.error("Không thể lấy dữ liệu lịch:", error);
        // Dữ liệu mẫu để test nếu API chưa chạy
        setMeetings([
            { date: '2025-11-27', title: 'Họp đồ án' },
            { date: '2025-11-15', title: 'Gặp GVHD' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  // --- 2. LOGIC LỊCH ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) -> 6 (Sat)
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysOfWeek = ['Cn', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Hàm kiểm tra xem ngày nào có lịch họp
  const hasMeeting = (day) => {
    // Format ngày hiện tại thành chuỗi YYYY-MM-DD để so sánh
    // Lưu ý: Tháng trong JS bắt đầu từ 0 nên cần +1
    const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Tìm trong mảng meetings xem có ngày nào trùng không
    return meetings.some(meeting => {
        // Cắt chuỗi ngày từ API để so sánh (giả sử API trả về ISO string hoặc YYYY-MM-DD)
        return meeting.date.startsWith(checkDate);
    });
  };

  // Xác định ngày hôm nay để highlight
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <div className="dashboard-page-container">
      {/* --- SIDEBAR (Giữ nguyên layout) --- */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={hcmutLogo} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link">
            <FiHome /> <span>Tổng quan</span>
          </NavLink>
          {/* Link này đang active */}
          
          <NavLink to="/app/register-schedule" className="nav-link">
            <FiPlusSquare /> <span>Đăng kí lịch</span>
          </NavLink>
          <NavLink to="/app/settings" className="nav-link">
            <FiSettings /> <span>Cài đặt</span>
          </NavLink>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="dashboard-main-content">
        <header className="dashboard-header">
            <h1 className="header-title">Lịch học tập</h1>
            <div className="header-actions">
                <button className="btn-icon btn-plus"><FiPlus /></button>
                <button className="btn-icon"><FiBell /></button>
                <div className="user-profile">
                    <img src="https://via.placeholder.com/40" alt="Avatar" />
                    <div className="user-info">
                        <span>Darrell Steward</span>
                        <small>Student</small>
                    </div>
                </div>
            </div>
        </header>

        <main className="dashboard-page-content">
            <div className="calendar-container-wrapper">
                {/* Header Lịch (Tháng + Nút chuyển) */}
                <div className="calendar-header">
                    <h2>Tháng {month + 1}, {year}</h2>
                    <div className="calendar-nav-buttons">
                        <button onClick={prevMonth}><FiChevronLeft /></button>
                        <button onClick={nextMonth}><FiChevronRight /></button>
                    </div>
                </div>

                {/* Grid Lịch */}
                <div className="calendar-grid">
                    {/* Hàng Thứ */}
                    {daysOfWeek.map(day => (
                        <div key={day} className="calendar-day-name">{day}</div>
                    ))}

                    {/* Các ô trống đầu tháng */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="calendar-day empty"></div>
                    ))}

                    {/* Các ngày trong tháng */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const meetingExists = hasMeeting(day);
                        const todayClass = isToday(day) ? 'is-today' : '';

                        return (
                            <div key={day} className={`calendar-day ${todayClass}`}>
                                <span className="day-number">{day}</span>
                                
                                {/* CHẤM TRÒN NẾU CÓ LỊCH HỌP */}
                                {meetingExists && <div className="meeting-dot"></div>}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Lịch (Tìm người) */}
                <div className="calendar-footer">
                    <button className="btn-find-people">
                        <FiUsers /> Tìm người
                    </button>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;