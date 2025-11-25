// TutorSchedulePage.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiDownload
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Mock Data: Cập nhật field 'quantity' thay vì 'student'
const upcomingSchedule = [
  { id: 1, subject: 'Công nghệ phần mềm', quantity: 45, time: '2025-11-25', fullTime: '25/11/2025 09:00', status: 'Đã xác nhận', result: 'Sắp tới' },
  { id: 2, subject: 'Trí tuệ nhân tạo', quantity: 32, time: '2025-11-26', fullTime: '26/11/2025 10:30', status: 'Chờ sinh viên', result: 'Chờ duyệt' },
];

const pastSchedule = [
  { id: 3, subject: 'Mạng máy tính', quantity: 50, time: '2025-10-22', fullTime: '22/10/2025 14:00', status: 'Đã hủy', result: 'Đã hủy' },
  { id: 4, subject: 'An toàn thông tin', quantity: 28, time: '2025-10-20', fullTime: '20/10/2025 11:00', status: 'Thành công', result: 'Đã dạy' },
];

const TutorSchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Data Source
  const currentData = activeTab === 'upcoming' ? upcomingSchedule : pastSchedule;

  // Filter Logic
  const filteredData = currentData.filter(item => {
    // Date Filter
    if (startDate && item.time < startDate) return false;
    if (endDate && item.time > endDate) return false;
    
    // Search Filter
    if (searchTerm && !item.subject.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  // Search Logic (Consistent UI)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Simple suggestion based on current tab data
    if (value.length > 0) {
      const matches = currentData
        .filter(c => c.subject.toLowerCase().includes(value.toLowerCase()))
        .map(c => c.subject);
      setSuggestions([...new Set(matches)]); // Unique
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (val) => {
    setSearchTerm(val);
    setSuggestions([]);
  };

  const handleExport = () => {
    const headers = ["ID,Môn Học,Số Lượng HV,Thời Gian,Trạng Thái,Kết Quả"];
    const rows = filteredData.map(item => 
      `${item.id},${item.subject},${item.quantity},${item.fullTime},${item.status},${item.result}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lich_Day_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <NavLink to="/app/tutor/schedule" className="nav-link"><FiCalendar /><span>Lịch dạy</span></NavLink>
          <NavLink to="/app/tutor/slots" className="nav-link"><FiPlusSquare /><span>Quản lý Slots</span></NavLink>
          <NavLink to="/app/tutor/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Lịch dạy của tôi</h1>
          
          {/* SEARCH BAR CONSISTENT UI */}
          <div className="header-search-wrapper" style={{marginLeft: '2rem', position: 'relative', width: '300px'}}>
            <div className="header-search">
              <FiSearch />
              <input 
                type="text" 
                placeholder="Tìm môn học..." 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((s, idx) => (
                  <li key={idx} onClick={() => handleSelectSuggestion(s)}>{s}</li>
                ))}
              </ul>
            )}
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
          <div className="stats-cards">
            <div className="stat-card">
              <p>Tổng số buổi ({activeTab === 'upcoming' ? 'Sắp tới' : 'Đã qua'})</p>
              <h3>{filteredData.length}</h3>
            </div>
            <div className="stat-card">
              <p>Trạng thái</p>
              <h3>{activeTab === 'upcoming' ? 'Đang chờ' : 'Đã xong'}</h3>
            </div>
          </div>

          <div className="table-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Lịch sắp tới
              </button>
              <button 
                className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Lịch đã qua
              </button>
            </div>
            <div className="table-filters">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{fontSize: '0.9rem', color: '#6b7280'}}>Từ:</span>
                <input type="date" className="filter-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span style={{fontSize: '0.9rem', color: '#6b7280'}}>Đến:</span>
                <input type="date" className="filter-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              
              <button className="btn-export" onClick={handleExport}>
                <FiDownload /> Export Lịch
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>MÔN HỌC</th>
                  {/* Changed Column Header */}
                  <th>SỐ LƯỢNG</th> 
                  <th>THỜI GIAN</th>
                  <th>TRẠNG THÁI</th>
                  <th>KẾT QUẢ</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((reg) => (
                  <tr key={reg.id}>
                    <td><strong>{reg.subject}</strong></td>
                    {/* Changed Data Cell */}
                    <td>{reg.quantity} học viên</td>
                    <td>{reg.fullTime}</td>
                    <td>
                      <span className={`status ${
                        reg.status === 'Đã xác nhận' || reg.status === 'Thành công' ? 'status-success' :
                        reg.status === 'Chờ sinh viên' ? 'status-pending' :
                        reg.status === 'Đã hủy' ? 'status-failed' : ''
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td>{reg.result}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Không tìm thấy dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorSchedulePage;
