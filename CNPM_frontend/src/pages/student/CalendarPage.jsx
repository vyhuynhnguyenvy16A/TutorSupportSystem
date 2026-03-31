// src/pages/CalendarPage/CalendarPage.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'; // Thêm FiX cho nút đóng
import './CalendarPage.css';

import { 
  FiHome, FiCalendar, FiSettings,
  FiPlus, FiBell 
} from 'react-icons/fi';
import hcmutLogo from '../../assets/hcmut.png'; 
// Import thêm getBookings
import { getCalendar, getBookings } from '../../api/studentService.js';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- STATE MỚI CHO MODAL CHI TIẾT ---
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); 
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(currentDate);

  // --- 1. GỌI API LỊCH TỔNG QUÁT (GIỮ NGUYÊN) ---
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await getCalendar(month + 1, year);
        // Lưu ý: Kiểm tra kỹ structure response.meta hay response.data tùy vào BE trả về
        setMeetings(response.meta || []); 
      } catch (error) {
        console.error("Không thể lấy dữ liệu lịch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarData();
  }, [month, year]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysOfWeek = ['Cn', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const hasMeeting = (day) => {
    const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return meetings.some(meeting => {
        // Đảm bảo so sánh đúng format chuỗi ngày
        return meeting.THOIGIANBATDAU && meeting.THOIGIANBATDAU.startsWith(checkDate);
    });
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const handleDayClick = async (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    
    setShowModal(true);
    setLoadingDetails(true);
    setSelectedDateBookings([]); 

    try {
        // 3. Gọi API getBookings
        const response = await getBookings(dateStr);
        console.log("Chi tiết ngày:", response);
        
        setSelectedDateBookings(response.meta); 
    } catch (error) {
        console.error("Lỗi lấy chi tiết ngày:", error);
    } finally {
        setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDateBookings([]);
  }

  return (
    <div className="dashboard-page-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={hcmutLogo} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link"><FiHome /> <span>Tổng quan</span></NavLink>
          <NavLink to="/app/schedule" className="nav-link active"><FiCalendar /> <span>Lịch</span></NavLink>
          <NavLink to="/app/settings" className="nav-link"><FiSettings /> <span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
            <h1 className="header-title">Lịch học tập</h1>
            <div className="header-actions">
                <button className="btn-icon btn-plus"><FiPlus /></button>
                <button className="btn-icon"><FiBell /></button>
                <div className="user-profile">
                    <img src="https://via.placeholder.com/40" alt="Avatar" />
                    <div className="user-info">
                        <span>Student Name</span>
                        <small>Student</small>
                    </div>
                </div>
            </div>
        </header>

        <main className="dashboard-page-content">
            <div className="calendar-container-wrapper">
                <div className="calendar-header">
                    <h2>Tháng {month + 1}, {year}</h2>
                    <div className="calendar-nav-buttons">
                        <button onClick={prevMonth}><FiChevronLeft /></button>
                        <button onClick={nextMonth}><FiChevronRight /></button>
                    </div>
                </div>

                <div className="calendar-grid">
                    {daysOfWeek.map(day => (
                        <div key={day} className="calendar-day-name">{day}</div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="calendar-day empty"></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const meetingExists = hasMeeting(day);
                        const todayClass = isToday(day) ? 'is-today' : '';

                        return (
                            <div 
                                key={day} 
                                onClick={() => handleDayClick(day)}
                                className={`calendar-day ${todayClass} ${meetingExists ? 'has-meeting-cursor' : ''}`}
                            >
                                <span className="day-number">{day}</span>
                                {meetingExists && <div className="meeting-dot"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>

        {showModal && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>{selectedDateStr}</h3>
                        <button className="close-btn" onClick={closeModal}><FiX /></button>
                    </div>
                    
                    <div className="modal-body">
                        {loadingDetails ? (
                            <p>Đang tải dữ liệu...</p>
                        ) : (
                            <>
                                {selectedDateBookings && selectedDateBookings.length > 0 ? (
                                    <ul className="booking-list">
                                        {selectedDateBookings.map((item, idx) => (
                                            <li key={idx} className="booking-item">
                                                <div className="booking-time">
                                                    {new Date(item.THOIGIANBATDAU).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                                                </div>
                                                <div className="booking-info">
                                                    <strong>{item.TIEUDE || "Cuộc họp"}</strong>
                                                    <p>Hinh thức: {item.LOAIHOP}</p>
                                                    {(item.LOAIHOP === "Online") && (<p>Link họp: {item.LINKHOP}</p>)}
                                                    {(item.LOAIHOP === "Offline") && (<p>Phòng: {item.DIADIEM}</p>)}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="no-data">
                                        <p>Không có lịch trình nào trong ngày này.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;