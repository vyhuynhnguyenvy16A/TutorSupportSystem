// src/pages/student/OverviewPage.jsx

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiCalendar, FiPlusSquare, FiSettings, 
  FiSearch, FiBell, FiCheckCircle, FiClock, FiX
} from 'react-icons/fi';
import dashboardPreview from '../../assets/hcmut.png'; 
import './OverviewPage.css'; // CSS riêng cho trang này

import { submitRegistration } from '../../api/studentService';
import { getPairingBatches, getFields } from '../../api/publicService';

const OverviewPage = () => {
  // State dữ liệu
  const [batches, setBatches] = useState([]);
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State cho Modal đăng ký
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // State Form
  const [formData, setFormData] = useState({
    linhVucId: '',
    nhuCauHoTro: '',
    thanhTich: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FETCH DỮ LIỆU ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Gọi song song 2 API lấy Đợt và Lĩnh vực
        const [batchRes, fieldRes] = await Promise.all([
          getPairingBatches(),
          getFields()
        ]);

        if (batchRes && batchRes.meta) {
          setBatches(batchRes.meta);
        }

        if (fieldRes && fieldRes.meta && fieldRes.meta.fieldList) {
          console.log(fieldRes.meta.fieldList)
          const mappedFields = fieldRes.meta.fieldList.map((item) => ({
            id: item.LINHVUCID, 
            name: item.TENLINHVUC
          }));
          setFields(mappedFields);
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- 2. HELPERS ---
  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('vi-VN');
  };

  // Kiểm tra trạng thái: API bạn trả về "M_" hoặc "ng"
  const isOpen = (status) => status && status.startsWith('M'); 

  // --- 3. HANDLERS ---
  const handleOpenRegister = (batch) => {
    setSelectedBatch(batch);
    setFormData({ linhVucId: '', nhuCauHoTro: '', thanhTich: '' }); // Reset form
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.linhVucId) {
      alert("Vui lòng chọn lĩnh vực mong muốn!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        dotId: selectedBatch.DOTID,
        linhVucId: parseInt(formData.linhVucId),
        nhuCauHoTro: formData.nhuCauHoTro,
        thanhTich: formData.thanhTich
      };

      console.log("Nộp đơn:", payload);
      await submitRegistration(payload);
      
      alert("Nộp đơn đăng ký thành công!");
      setShowModal(false);

    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi nộp đơn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page-container">
      {/* SIDEBAR (Giữ nguyên) */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src={dashboardPreview} alt="Logo" />
          <span>Hệ thống Lịch</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app/overview" className="nav-link"><FiHome /><span>Tổng quan</span></NavLink>
          <NavLink to="/app/schedule" className="nav-link"><FiCalendar /><span>Lịch</span></NavLink>
          <NavLink to="/app/settings" className="nav-link"><FiSettings /><span>Cài đặt</span></NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="dashboard-main-content">
        <header className="dashboard-header">
          <h1 className="header-title">Các đợt đăng ký Tutor</h1>
          <div className="header-actions">
            <button className="btn-icon"><FiBell /></button>
            <div className="user-profile">
               {/* Avatar mẫu */}
              <img src="https://via.placeholder.com/40" alt="Avatar" />
              <div className="user-info"><span>Sinh viên</span></div>
            </div>
          </div>
        </header>

        <main className="dashboard-page-content">
          
          <div className="overview-intro">
            <h2>Danh sách đợt đăng ký</h2>
            <p>Chọn đợt đăng ký đang mở để nộp hồ sơ tìm Tutor.</p>
          </div>

          {isLoading ? <p>Đang tải dữ liệu...</p> : (
            <div className="batch-grid">
              {batches.map((batch) => (
                <div key={batch.DOTID} className={`batch-card ${isOpen(batch.TRANGTHAI) ? 'open' : 'closed'}`}>
                  <div className="batch-header">
                    <span className="batch-id">#{batch.DOTID}</span>
                    <span className={`batch-status ${isOpen(batch.TRANGTHAI) ? 'status-open' : 'status-closed'}`}>
                      {isOpen(batch.TRANGTHAI) ? 'Đang Mở' : 'Đã Đóng'}
                    </span>
                  </div>
                  
                  <h3 className="batch-title">{batch.TENDOT}</h3>
                  
                  <div className="batch-info">
                    <div className="info-row">
                      <FiCheckCircle /> <span>Bắt đầu: {formatDate(batch.NGAYBATDAU)}</span>
                    </div>
                    <div className="info-row">
                      <FiClock /> <span>Kết thúc: {formatDate(batch.NGAYKETTHUC)}</span>
                    </div>
                  </div>

                  <div className="batch-footer">
                    {isOpen(batch.TRANGTHAI) ? (
                      <button className="btn-register-batch" onClick={() => handleOpenRegister(batch)}>
                        Đăng ký ngay
                      </button>
                    ) : (
                      <button className="btn-disabled" disabled>
                        Đã đóng
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* --- MODAL ĐĂNG KÝ --- */}
      {showModal && selectedBatch && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Đăng ký: {selectedBatch.TENDOT}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Chọn Lĩnh vực mong muốn (*)</label>
                <select 
                  className="form-select" 
                  value={formData.linhVucId} 
                  onChange={(e) => setFormData({...formData, linhVucId: e.target.value})}
                  required
                >
                  <option value="">-- Chọn lĩnh vực --</option>
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nhu cầu hỗ trợ</label>
                <textarea 
                  rows="3" 
                  placeholder="Ví dụ: Em bị mất gốc môn này, cần tutor ôn tập lại từ đầu..."
                  value={formData.nhuCauHoTro}
                  onChange={(e) => setFormData({...formData, nhuCauHoTro: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Thành tích / Điểm số liên quan</label>
                <textarea 
                  rows="2" 
                  placeholder="Ví dụ: GPA kỳ trước 3.5, điểm Toán A..."
                  value={formData.thanhTich}
                  onChange={(e) => setFormData({...formData, thanhTich: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'Nộp đơn đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OverviewPage;