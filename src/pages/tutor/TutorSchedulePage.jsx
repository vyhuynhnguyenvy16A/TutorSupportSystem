// TutorSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiChevronLeft, FiChevronRight, FiX, FiClock, FiMapPin, FiUsers, FiMonitor
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

const TutorSchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [events, setEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week'
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. DATA LOADING (FROM LOCALSTORAGE) ---
  useEffect(() => {
    // Lấy dữ liệu được tạo từ trang SlotsPage
    const savedSlots = localStorage.getItem('tutor_db_slots');
    if (savedSlots) {
      setEvents(JSON.parse(savedSlots));
    } else {
      // Nếu chưa có, dùng mảng rỗng hoặc sample (tùy chọn)
      setEvents([]);
    }
  }, []);

  // --- 2. CALENDAR UTILS ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Chuyển CN (0) thành index 6, T2 là 0
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // --- 3. NAVIGATION LOGIC ---
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

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // --- 4. EVENT FILTERING ---
  const getEventsForDay = (dateObj) => {
    // dateObj là object Date
    // Format YYYY-MM-DD local để so sánh với data trong localStorage
    // Lưu ý: data lưu dạng '2025-11-25', cần format dateObj tương tự
    const year = dateObj.getFullYear();
    const month =String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    return events.filter(e => e.date === dateKey);
  };

  // --- 5. MODAL HANDLERS ---
  const handleDayClick = (dateObj) => {
    setSelectedDate(dateObj);
    setIsModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    // Logic mở chi tiết 1 sự kiện cụ thể, ở đây ta tái sử dụng modal ngày
    // nhưng có thể cải tiến để highlight sự kiện đó.
    // Tạm thời mở modal ngày chứa sự kiện đó.
    const [y, m, d] = event.date.split('-');
    const dateObj = new Date(y, m - 1, d);
    setSelectedDate(dateObj);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // --- 6. RENDERERS ---

  // Header cho Grid (T2 -> CN)
  const renderWeekHeader = () => (
    <div className="calendar-header-row">
      {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map(day => (
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
      const isToday = new Date().toDateString() === dateObj.toDateString();

      grid.push(
        <div key={day} className={`calendar-day ${isToday ? 'is-today' : ''}`} onClick={() => handleDayClick(dateObj)}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.slice(0, 3).map((ev, idx) => (
              <div key={idx} className={`event-pill status-${ev.status === 'Đã hủy' ? 'failed' : 'active'}`} onClick={(e) => handleEventClick(e, ev)}>
                {ev.subject}
              </div>
            ))}
            {dayEvents.length > 3 && <div className="event-more">+{dayEvents.length - 3} nữa</div>}
          </div>
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
                    <div key={eIdx} className={`event-card status-${ev.status === 'Đã hủy' ? 'failed' : 'active'}`} onClick={(e) => handleEventClick(e, ev)}>
                      <div className="ev-time">{ev.start} - {ev.end}</div>
                      <div className="ev-title">{ev.className}</div>
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

  // --- RENDER MODAL CONTENT ---
  const renderModalContent = () => {
    if (!selectedDate) return null;
    const dayEvents = getEventsForDay(selectedDate);

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Lịch dạy ngày {selectedDate.toLocaleDateString('vi-VN')}</h3>
            <button className="btn-close" onClick={closeModal}><FiX /></button>
          </div>
          <div className="modal-body">
            {dayEvents.length === 0 ? (
              <div className="empty-state">
                <p>Không có buổi dạy nào trong ngày này.</p>
                <div style={{marginTop: '10px', color: '#6b7280', fontSize: '0.9rem'}}>
                  Vui lòng qua trang "Quản lý Slots" để thêm lịch.
                </div>
              </div>
            ) : (
              <div className="event-list">
                {dayEvents.map(ev => (
                  <div key={ev.id} className="event-item-detail">
                    <div className={`event-color-strip ${ev.status === 'Đã hủy' ? 'strip-red' : 'strip-blue'}`}></div>
                    <div className="event-info">
                      <h4>{ev.className}</h4>
                      <div className="event-sub-title">Môn: {ev.subject}</div>
                      <div className="event-meta">
                        <span><FiClock /> {ev.start} - {ev.end}</span>
                        <span><FiUsers /> {ev.registered}/{ev.max} HV</span>
                      </div>
                      <div className="event-meta">
                        {ev.type === 'Online' ? (
                          <span><FiMonitor /> Online • <a href={ev.link} target="_blank" rel="noreferrer">Link</a></span>
                        ) : (
                          <span><FiMapPin /> Offline • {ev.room}</span>
                        )}
                      </div>
                      <div className={`status-badge ${ev.status === 'Đã hủy' ? 'st-failed' : 'st-success'}`}>
                        {ev.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Helper text header
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
      {/* SIDEBAR */}
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
              <FiSearch />
              <input 
                type="text" 
                placeholder="Tìm lịch..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Jane Doe</span><small>Giảng viên</small></div>
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
                <button 
                  className={viewMode === 'month' ? 'active' : ''} 
                  onClick={() => setViewMode('month')}
                >Tháng</button>
                <button 
                  className={viewMode === 'week' ? 'active' : ''} 
                  onClick={() => setViewMode('week')}
                >Tuần</button>
              </div>
            </div>
          </div>

          <div className="calendar-container">
            {renderWeekHeader()}
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}
          </div>
        </main>
      </div>

      {isModalOpen && renderModalContent()}
    </div>
  );
};

export default TutorSchedulePage;
