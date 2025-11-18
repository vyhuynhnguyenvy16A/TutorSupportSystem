import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './TutorSchedulePage.css'; 
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings,
  FiSearch, FiPlus, FiBell, FiDownload
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';

// Mock Data: Lịch sắp tới
const upcomingSchedule = [
  { id: 1, subject: 'Công nghệ phần mềm', student: 'Nguyễn Văn A', time: '2025-11-25', fullTime: '25/11/2025 09:00', status: 'Đã xác nhận', result: 'Sắp tới' },
  { id: 2, subject: 'Trí tuệ nhân tạo', student: 'Trần Thị B', time: '2025-11-26', fullTime: '26/11/2025 10:30', status: 'Chờ sinh viên', result: 'Chờ duyệt' },
];

// Mock Data: Lịch đã qua
const pastSchedule = [
  { id: 3, subject: 'Mạng máy tính', student: 'Lê Văn C', time: '2025-10-22', fullTime: '22/10/2025 14:00', status: 'Đã hủy', result: 'Đã hủy' },
  { id: 4, subject: 'An toàn thông tin', student: 'Phạm Thị D', time: '2025-10-20', fullTime: '20/10/2025 11:00', status: 'Thành công', result: 'Đã dạy' },
];

const TutorSchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Xác định nguồn dữ liệu dựa trên tab
  const currentData = activeTab === 'upcoming' ? upcomingSchedule : pastSchedule;

  // Logic Filter theo ngày
  const filteredData = currentData.filter(item => {
    if (!startDate && !endDate) return true;
    const itemDate = item.time; // YYYY-MM-DD for comparison
    if (startDate && itemDate < startDate) return false;
    if (endDate && itemDate > endDate) return false;
    return true;
  });

  // Logic Export CSV
  const handleExport = () => {
    const headers = ["ID,Môn Học,Sinh Viên,Thời Gian,Trạng Thái,Kết Quả"];
    const rows = filteredData.map(item => 
      `${item.id},${item.subject},${item.student},${item.fullTime},${item.status},${item.result}`
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
          <div className="header-search"><FiSearch /><input type="text" placeholder="Tìm kiếm lịch dạy..." /></div>
          <div className="header-actions">
            <button className="btn-icon btn-plus"><FiPlus /></button>
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Jane Doe (GV)</span><small>Lecturer</small></div>
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
                  <th>SINH VIÊN</th>
                  <th>THỜI GIAN</th>
                  <th>TRẠNG THÁI</th>
                  <th>KẾT QUẢ</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.subject}</td>
                    <td>{reg.student}</td>
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