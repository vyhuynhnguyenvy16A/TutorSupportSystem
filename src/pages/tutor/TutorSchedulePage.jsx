// src/pages/tutor/TutorSchedulePage.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiBell, FiChevronLeft, FiChevronRight, FiX, 
  FiClock, FiMapPin, FiPlus, FiVideo
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Import API
import { getTutorBookings } from '../../api/tutorService.js';

const TutorSchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await getTutorBookings();
        
        // Kiểm tra data trả về
        const bookingsData = response.meta?.bookings || []; 

        const mappedEvents = bookingsData.map((booking, index) => {
           const startDate = new Date(booking.THOIGIANBATDAU);
           const endDate = new Date(booking.THOIGIANKETTHUC);
           
           const dateKey = startDate.toISOString().split('T')[0];
           
           const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
           const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

           return {
             id: booking.ID || index,
             date: dateKey, // YYYY-MM-DD
             fullDate: startDate,
             start: startTime,
             end: endTime,
             subject: booking.TIEUDE,
             type: booking.LOAIHOP,
             link: booking.LINKHOP || '',
             room: booking.DIADIEM || '',
             status: booking.TRANGTHAI
           };
        });

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Lỗi lấy lịch dạy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const handleToday = () => setCurrentDate(new Date());

  const getEventsForDay = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    return events.filter(e => e.date === dateKey);
  };

  const handleDayClick = (dateObj) => {
    setSelectedDate(dateObj);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const renderWeekHeader = () => (
    <div className="calendar-header-row">
      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
        <div key={day} className="cal-weekday">{day}</div>
      ))}
    </div>
  );

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDayIndex = getFirstDayOfMonth(currentDate);
    const totalSlots = Math.ceil((daysInMonth + startDayIndex) / 7) * 7;
    const grid = [];

    // Empty slots tháng trước
    for (let i = 0; i < startDayIndex; i++) {
      grid.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDay(dateObj);
      const hasEvent = dayEvents.length > 0; // [FIX] Chỉ cần kiểm tra có event hay không
      const isToday = new Date().toDateString() === dateObj.toDateString();

      grid.push(
        <div key={day} className={`calendar-day ${isToday ? 'is-today' : ''}`} onClick={() => handleDayClick(dateObj)}>
          <div className="day-number">{day}</div>
          
          {/* [FIX] Render chấm đỏ đơn giản, không dùng map pills để tránh vỡ layout */}
          {hasEvent && <div className="meeting-dot"></div>}
        </div>
      );
    }
    
    // Empty slots cuối
    const remaining = totalSlots - (startDayIndex + daysInMonth);
    for (let i = 0; i < remaining; i++) {
      grid.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }
    return <div className="calendar-body-grid month-view">{grid}</div>;
  };

  const renderWeekView = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = [];
    for(let i=0; i<7; i++) {
      weekDays.push(addDays(startOfWeek, i));
    }

    return (
      <div className="calendar-body-grid week-view">
        {weekDays.map((dateObj, idx) => {
           const dayEvents = getEventsForDay(dateObj);
           const isToday = new Date().toDateString() === dateObj.toDateString();
           const dateLabel = `${dateObj.getDate()}/${dateObj.getMonth()+1}`;
           
           return (
             <div key={idx} className={`calendar-day week-col ${isToday ? 'is-today' : ''}`} onClick={() => handleDayClick(dateObj)}>
               <div className="day-header-week">
                 <span className="day-name">{['T2','T3','T4','T5','T6','T7','CN'][idx]}</span>
                 <span className="day-num">{dateLabel}</span>
               </div>
               <div className="day-events-stack">
                 {dayEvents.map((ev, eIdx) => (
                    <div key={eIdx} className={`event-card status-${ev.status === 'Đã hủy' ? 'failed' : 'active'}`}>
                      <div className="ev-time">{ev.start} - {ev.end}</div>
                      <div className="ev-title">{ev.subject}</div>
                      <div className="ev-sub">{ev.type}</div>
                    </div>
                 ))}
               </div>
             </div>
           );
        })}
      </div>
    );
  };

  const getHeaderText = () => {
    if (viewMode === 'month') {
      return `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;
    } else {
      const start = getStartOfWeek(currentDate);
      const end = addDays(start, 6);
      return `Tuần ${start.getDate()}/${start.getMonth()+1} - ${end.getDate()}/${end.getMonth()+1}`;
    }
  };

  return (
    <div className="dashboard-page-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/tutor/overview" className="nav-link"><FiHome /><span>Tổng quan</span></NavLink>
          <NavLink to="/app/tutor/schedule" className="nav-link active"><FiCalendar /><span>Lịch dạy</span></NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link"><FiPlusSquare /><span>Quản lý Slots</span></NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Lịch dạy của tôi</h1>
          <div className="header-search-wrapper" style={{marginLeft: '2rem'}}>
            <div className="header-search">
               <FiSearch /><input type="text" placeholder="Tìm lịch..." />
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Giảng viên</span></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          <div className="calendar-controls">
            <div className="cal-nav-group">
              <button className="btn-cal-nav" onClick={handlePrev}><FiChevronLeft /></button>
              <button className="btn-cal-nav" onClick={handleNext}><FiChevronRight /></button>
              <h2 className="cal-title">{getHeaderText()}</h2>
            </div>
            <div className="cal-actions">
              <button className="btn-today" onClick={handleToday}>Hôm nay</button>
              <div className="view-mode">
                <button className={viewMode === 'month' ? 'active' : ''} onClick={() => setViewMode('month')}>Tháng</button>
                <button className={viewMode === 'week' ? 'active' : ''} onClick={() => setViewMode('week')}>Tuần</button>
              </div>
            </div>
          </div>

          <div className="calendar-container">
            {renderWeekHeader()}
            {loading ? <div className="loading-state">Đang tải lịch...</div> : (
               viewMode === 'month' ? renderMonthView() : renderWeekView()
            )}
          </div>
        </main>
      </div>

      {isModalOpen && selectedDate && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDate.toLocaleDateString('vi-VN')}</h3>
              <button className="btn-close" onClick={closeModal}><FiX /></button>
            </div>
            <div className="modal-body">
              {getEventsForDay(selectedDate).length === 0 ? (
                <div className="empty-state">
                  <p>Không có buổi dạy nào trong ngày này.</p>
                </div>
              ) : (
                <div className="event-list">
                  {getEventsForDay(selectedDate).map(ev => (
                    <div key={ev.id} className="event-item-detail">
                      <div className="event-info">
                        <h4>{ev.subject}</h4>
                        <div className="event-meta">
                          <span><FiClock /> {ev.start}</span>
                        </div>
                        <div className="event-meta">
                          {ev.type === 'Online' ? (
                            <span>
                                <FiVideo /> Online 
                                {ev.link && <a href={ev.link} target="_blank" rel="noreferrer" style={{marginLeft:5}}>Vào lớp</a>}
                            </span>
                          ) : (
                            <span><FiMapPin /> {ev.room}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorSchedulePage;