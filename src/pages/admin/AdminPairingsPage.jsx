// src/pages/admin/AdminPairingsPage.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCheck, FiX, FiEdit2, FiFilter, FiSearch, 
  FiPause
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png';
import './Admin.css'; // CSS gốc cho sidebar
import '../tutor/TutorSchedulePage.css'; // CSS layout chung
import './AdminPairings.css'; // hoặc AdminPairings.css
// API
import { getPairingBatches } from '../../api/publicService';
import { getPairing, approvePairing, rejectPairing, editPairings } from '../../api/adminService';

const AdminPairingsPage = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [newTutorId, setNewTutorId] = useState('');
  const [saving, setSaving] = useState(false);

  // Load danh sách đợt để làm filter
  useEffect(() => {
    const init = async () => {
      try {
        const res = await getPairingBatches();
        if (res.meta && res.meta.length > 0) {
          setBatches(res.meta);
          // Mặc định chọn đợt mới nhất
          setSelectedBatchId(res.meta[0].DOTID);
        }
      } catch (err) { console.error(err); }
    };
    init();
  }, []);

  // Load pairings khi đổi batch
  useEffect(() => {
    if (!selectedBatchId) return;
    fetchPairings(selectedBatchId);
  }, [selectedBatchId]);

  const fetchPairings = async (batchId) => {
    setLoading(true);
    try {
      const res = await getPairing(batchId);
      setPairings(res.meta || []);
    } catch (error) {
      console.error("Fetch Pairing Error:", error);
      setPairings([]);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt cặp này?")) return;
    try {
      await approvePairing(id);
      fetchPairings(selectedBatchId);
    } catch (e) { alert("Lỗi duyệt cặp"); }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Hủy duyệt cặp này? Trạng thái sẽ quay về chờ hoặc hủy.")) return;
    try {
      await rejectPairing(id);
      fetchPairings(selectedBatchId);
    } catch (e) { alert("Lỗi hủy duyệt"); }
  };

  // Mở modal edit
  const handleOpenEditModal = (item) => {
    setEditingPairing(item);
    setNewTutorId(item.TUTORID || '');
    setIsEditModalOpen(true);
  };

  // Đóng modal edit
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPairing(null);
    setNewTutorId('');
  };

  // Lưu thay đổi
  const handleSaveEdit = async () => {
    if (!newTutorId || newTutorId === editingPairing.TUTORID) {
      alert("Vui lòng nhập ID Tutor mới khác với ID hiện tại.");
      return;
    }

    setSaving(true);
    try {
      await editPairings(editingPairing.GHEPCAPID, newTutorId);
      alert("Cập nhật thành công!");
      handleCloseEditModal();
      fetchPairings(selectedBatchId);
    } catch (e) {
      console.error(e);
      alert("Cập nhật thất bại. Kiểm tra lại ID Tutor.");
    } finally {
      setSaving(false);
    }
  };

  // Helper render status
  const renderStatus = (status) => {
    if (status === 'Đã xác nhận') {
      return <span className="status-badge badge-green">Đã xác nhận</span>;
    } else {
      return <span className="status-badge badge-yellow">Chờ duyệt</span>;
    }
  };

  return (
    <div className="dashboard-page-container">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Admin System</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/batches" className="nav-link"><FiHome /><span>Đợt đăng ký</span></NavLink>
          <NavLink to="/admin/pairings" className="nav-link active"><FiUsers /><span>Ghép cặp</span></NavLink>
        </nav>
      </aside>

      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Quản lý Ghép cặp</h1>
          <div className="header-actions">
            <div className="user-profile">
              <img src="https://via.placeholder.com/40" alt="Admin" />
              <div className="user-info"><span>Administrator</span></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          
          {/* FILTER BAR */}
          <div className="filter-bar">
            <label><FiFilter /> Chọn đợt:</label>
            <select 
              className="filter-select" 
              value={selectedBatchId} 
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              {batches.map(b => (
                <option key={b.DOTID} value={b.DOTID}>{b.TENDOT}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="loading-text">Đang tải danh sách...</p>
          ) : (
            <div className="admin-table-container scrollable-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sinh viên</th>
                    <th>Tutor (Giảng viên)</th>
                    <th>Môn/Lĩnh vực</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {pairings.length > 0 ? pairings.map(p => {
                    const isConfirmed = p.TRANGTHAI === 'Đã xác nhận';
                     const isRejected = p.TRANGTHAI === 'Đã Hủy';
                    return (
                      <tr key={p.GHEPCAPID}>
                        <td>#{p.GHEPCAPID}</td>
                        <td>
                          <strong>{p.dondangky.student.user.HOTEN}</strong><br/>
                          <small className="text-gray">{p.dondangky.student.MSSV}</small>
                        </td>
                        <td>
                          <strong>{p.tutor.user.HOTEN || "Chưa có"}</strong><br/>
                          <small className="text-gray">ID: {p.TUTORID}</small>
                        </td>
                        <td>{p.dondangky.linhvuc.TENLINHVUC}</td>
                        <td><span>{p.TRANGTHAI}</span></td>
                        <td>

                          {!isRejected && (
                            <>
                                {/* Nút Edit */}
                                <button 
                                    className="btn-action btn-outline-sm" 
                                    onClick={() => handleOpenEditModal(p)} 
                                    title="Đổi Tutor"
                                >
                                    <FiEdit2 />
                                </button>

                                {/* Nút Duyệt / Hủy Duyệt */}
                                {isConfirmed ? (
                                    <button 
                                    className="btn-action btn-danger-sm" 
                                    onClick={() => handleReject(p.GHEPCAPID)}
                                    >
                                    <FiX /> Hủy duyệt
                                    </button>
                                ) : (
                                    <button 
                                    className="btn-action btn-success-sm" 
                                    onClick={() => handleApprove(p.GHEPCAPID)}
                                    >
                                    <FiCheck /> Duyệt
                                    </button>
                                )}
                            </>
                          )}

                          {isRejected && <span className="text-gray" style={{fontSize:'0.85rem', fontStyle:'italic'}}>Đã đóng</span>}
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <p>Không có dữ liệu ghép cặp cho đợt này.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* EDIT MODAL */}
        {isEditModalOpen && editingPairing && (
          <div className="edit-modal-overlay">
            <div className="edit-modal-content">
              <div className="edit-modal-header">
                <h3><FiEdit2 /> Chỉnh sửa Ghép cặp</h3>
                <button className="btn-close" onClick={handleCloseEditModal}>
                  <FiX />
                </button>
              </div>
              
              <div className="edit-modal-body">
                <div className="info-box">
                  <p>
                    <strong>Sinh viên:</strong> {editingPairing.dondangky.student.user.HOTEN} ({editingPairing.dondangky.student.MSSV})<br/>
                    <strong>Lĩnh vực:</strong> {editingPairing.dondangky.linhvuc.TENLINHVUC}<br/>
                    <strong>Tutor hiện tại:</strong> {editingPairing.tutor.user.HOTEN} (ID: {editingPairing.TUTORID})
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="newTutorId">ID Tutor mới *</label>
                  <div className="search-input-wrapper">
                    <FiSearch />
                    <input
                      id="newTutorId"
                      type="text"
                      placeholder="Nhập ID Tutor mới..."
                      value={newTutorId}
                      onChange={(e) => setNewTutorId(e.target.value)}
                    />
                  </div>
                  <small style={{color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block'}}>
                    Lưu ý: Hệ thống sẽ kiểm tra tính hợp lệ của ID Tutor khi lưu.
                  </small>
                </div>
              </div>

              <div className="edit-modal-footer">
                <button className="btn-cancel" onClick={handleCloseEditModal}>
                  Hủy
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveEdit}
                  disabled={saving}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPairingsPage;