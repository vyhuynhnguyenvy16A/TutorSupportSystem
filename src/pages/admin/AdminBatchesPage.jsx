// src/pages/admin/AdminBatchesPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiEye, FiX, FiCpu 
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';
import './Admin.css'; // CSS gốc cho sidebar
import '../tutor/TutorSchedulePage.css'; // CSS layout chung
import './AdminBatches.css'; // hoặc AdminPairings.css
// API
import { getPairingBatches } from '../../api/publicService';
import { getApplyForm, matchAI } from '../../api/adminService';

const AdminBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal xem đơn
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingApps, setLoadingApps] = useState(false);
  const [matching, setMatching] = useState(false);

  // 1. Load danh sách đợt
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await getPairingBatches();
      if (res.meta) setBatches(res.meta);
    } catch (error) {
      console.error("Lỗi tải đợt:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xem danh sách đơn yêu cầu
  const handleViewApplications = async (batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
    setLoadingApps(true);
    try {
      console.log(batch)
      console.log(batch.DOTID)
      const res = await getApplyForm(batch.DOTID);
      setApplications(res.meta || []); 
    } catch (error) {
      console.error("Lỗi tải đơn:", error);
    } finally {
      setLoadingApps(false);
    }
  };

  // 3. Chạy AI Match
  const handleRunAI = async () => {
    if (!selectedBatch) return;
    if (!window.confirm(`Bạn có chắc muốn chạy ghép cặp tự động cho đợt "${selectedBatch.TENDOT}"?`)) return;

    setMatching(true);
    try {
      await matchAI(selectedBatch.DOTID);
      alert("Đã chạy ghép cặp thành công! Vui lòng kiểm tra tab 'Ghép cặp'.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Có lỗi xảy ra khi chạy AI.");
    } finally {
      setMatching(false);
    }
  };

  const formatDate = (isoStr) => {
    if(!isoStr) return "";
    return new Date(isoStr).toLocaleDateString('vi-VN');
  }

  return (
    <div className="dashboard-page-container">
      {/* SIDEBAR ADMIN */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Admin System</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/batches" className="nav-link active">
            <FiHome /><span>Đợt đăng ký</span>
          </NavLink>
          <NavLink to="/admin/pairings" className="nav-link">
            <FiUsers /><span>Ghép cặp</span>
          </NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Quản lý Đợt Đăng Ký</h1>
          <div className="header-actions">
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Admin" />
              <div className="user-info"><span>Administrator</span></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          {loading ? (
            <p className="loading-text">Đang tải dữ liệu...</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên đợt</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(batch => (
                    <tr key={batch.DOTID}>
                      <td>#{batch.DOTID}</td>
                      <td><strong>{batch.TENDOT}</strong></td>
                      <td>{formatDate(batch.NGAYBATDAU)} - {formatDate(batch.NGAYKETTHUC)}</td>
                      <td>
                        <span className={`status-badge ${batch.TRANGTHAI?.startsWith('M') ? 'badge-green' : 'badge-gray'}`}>
                          {batch.TRANGTHAI?.startsWith('M') ? 'Đang mở' : 'Đã đóng'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-action btn-primary-sm" 
                          onClick={() => handleViewApplications(batch)}
                        >
                          <FiEye /> Xem yêu cầu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* MODAL XEM ĐƠN & AI */}
        {isModalOpen && selectedBatch && (
          <div className="modal-overlay">
            <div className="modal-content" style={{width: '800px', maxWidth:'95%'}}>
              <div className="modal-header">
                <h3>Danh sách Yêu cầu - {selectedBatch.TENDOT}</h3>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                  <FiX />
                </button>
              </div>
              
              <div className="modal-body">
                {/* AI ACTION BAR */}
                <div className="ai-match-section">
                  <div className="ai-match-info">
                    <h3><FiCpu /> Ghép cặp tự động (AI)</h3>
                    <p>Hệ thống sẽ tự động phân bổ Tutor cho các đơn này.</p>
                  </div>
                  <button 
                    className="btn-action btn-success-sm" 
                    onClick={handleRunAI} 
                    disabled={matching}
                  >
                    {matching ? 'Đang xử lý...' : 'Chạy Ghép Cặp Ngay'}
                  </button>
                </div>

                {loadingApps ? (
                  <p className="loading-text">Đang tải danh sách đơn...</p>
                ) : (
                  applications.length > 0 ? (
                    <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>SV</th>
                            <th>Lĩnh vực</th>
                            <th>Thành tích</th>
                            <th>Nhu cầu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((app, idx) => (
                            <tr key={idx}>
                              <td>
                                {app.HOTEN}<br/>
                                <small className="text-gray">{app.student.MSSV}</small>
                              </td>
                              <td>{app.linhvuc.TENLINHVUC}</td>
                              <td>{app.THANHTICH}</td>
                              <td>{app.NHUCAUHOTRO}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>Chưa có đơn đăng ký nào trong đợt này.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminBatchesPage;