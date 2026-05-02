import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Staff.css';
import { nhanVienApi, datLichApi, dichVuApi, hoaDonApi, danhGiaApi } from '../utils/api';

// Helper to get service names from chi tiet
const getServiceNamesFromApt = (apt: any) => {
  return apt.ghiChu || 'Dịch vụ cắt tóc';
};

function Staff() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [completedServices, setCompletedServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchAppointment, setSearchAppointment] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({ soKhach: 0, doanhThu: '0đ', danhGiaTB: 0, soGioLam: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const allServices = await dichVuApi.getAll();
      setServices(allServices);
      const staffData = await nhanVienApi.getById('NV001');
      setStaffInfo(staffData);
      const maNV = staffData.maNhanVien || 'NV001';
      const staffApts = await datLichApi.getAll({ nhanVien: maNV });
      setAppointments(staffApts);
      const staffReviews = await danhGiaApi.getAll({ nhanVien: maNV });
      setReviews(staffReviews.map((dg: any) => ({
        khachHang: dg.TenKhachHang || 'Khách hàng',
        sao: dg.SaoNhanVien || dg.saoNhanVien || 0,
        nhanXet: dg.NhanXet || dg.nhanXet,
        thoiGian: new Date(dg.NgayDanhGia || dg.ngayDanhGia).toLocaleDateString('vi-VN')
      })));
      const avgR = staffReviews.length > 0
        ? (staffReviews.reduce((s: number, d: any) => s + (d.SaoNhanVien || d.saoNhanVien || 0), 0) / staffReviews.length).toFixed(1) : '0';
      setMonthlyStats({ soKhach: staffApts.filter((a: any) => (a.TrangThai || a.trangThai) === 'HoanThanh').length, doanhThu: '0đ', danhGiaTB: parseFloat(avgR), soGioLam: 176 });
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (maDatLich: string, newStatus: string) => {
    try {
      await datLichApi.updateStatus(maDatLich, newStatus);
      alert(`Đã cập nhật trạng thái lịch hẹn ${maDatLich}`);
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      'ChoXacNhan': 'Chờ xác nhận', 'DaXacNhan': 'Đã xác nhận',
      'DangPhucVu': 'Đang phục vụ', 'HoanThanh': 'Hoàn thành', 'DaHuy': 'Đã hủy'
    };
    return textMap[status] || status;
  };

  if (!staffInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="staff-container">
      {/* Header */}
      <header className="staff-header">
        <div className="logo">
          <h2>💈 30Shine</h2>
        </div>
        <div className="staff-info-header">
          <div className="staff-badge">
            <span className="badge-icon">👨‍💼</span>
            <div>
              <span className="staff-name">{staffInfo.hoTen || 'Nhân viên'}</span>
              <span className="staff-position">{staffInfo.chucVu || 'Stylist'}</span>
            </div>
          </div>
          <Link to="/" className="btn-logout">Đăng xuất</Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="staff-main">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button 
              className={activeTab === 'schedule' ? 'active' : ''} 
              onClick={() => setActiveTab('schedule')}
            >
              📅 Lịch hẹn hôm nay
            </button>
            <button 
              className={activeTab === 'history' ? 'active' : ''} 
              onClick={() => setActiveTab('history')}
            >
              📋 Lịch sử phục vụ
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''} 
              onClick={() => setActiveTab('reviews')}
            >
              ⭐ Đánh giá của tôi
            </button>
            <button 
              className={activeTab === 'stats' ? 'active' : ''} 
              onClick={() => setActiveTab('stats')}
            >
              📊 Thống kê
            </button>
            <button 
              className={activeTab === 'profile' ? 'active' : ''} 
              onClick={() => setActiveTab('profile')}
            >
              👤 Thông tin cá nhân
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="content">
          {activeTab === 'schedule' && (
            <div className="schedule-section">
              <h2>Lịch Hẹn Hôm Nay</h2>
              <p className="section-subtitle">Ngày {new Date().toLocaleDateString('vi-VN')} - {appointments.length} lịch hẹn</p>
              
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <p>Không có lịch hẹn nào</p>
                ) : (
                  appointments.map((apt) => {
                    const serviceNames = getServiceNamesFromApt(apt);
                    return (
                      <div key={apt.maDatLich} className="appointment-card">
                        <div className="appointment-header">
                          <div>
                            <h3>Khách hàng</h3>
                            <p className="appointment-code">{apt.maDatLich} • {apt.soDienThoai}</p>
                          </div>
                          <span className={`status-badge ${(apt.trangThai || '').toLowerCase()}`}>
                            {getStatusText(apt.trangThai)}
                          </span>
                        </div>
                        
                        <div className="appointment-details">
                          <div className="detail-row">
                            <span className="label">⏰ Thời gian:</span>
                            <span className="value">{new Date(apt.thoiGianHen).toLocaleString('vi-VN')}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">✂️ Dịch vụ:</span>
                            <span className="value">{serviceNames}</span>
                          </div>
                          {apt.ghiChu && (
                            <div className="detail-row">
                              <span className="label">📝 Ghi chú:</span>
                              <span className="value">{apt.ghiChu}</span>
                            </div>
                          )}
                        </div>

                        <div className="appointment-actions">
                          {apt.trangThai === 'DaXacNhan' && (
                            <button 
                              className="btn-action primary"
                              onClick={() => handleUpdateStatus(apt.maDatLich, 'DangPhucVu')}
                            >
                              Bắt đầu phục vụ
                            </button>
                          )}
                          {apt.trangThai === 'DangPhucVu' && (
                            <button 
                              className="btn-action success"
                              onClick={() => handleUpdateStatus(apt.maDatLich, 'HoanThanh')}
                            >
                              Hoàn thành
                            </button>
                          )}
                          <button className="btn-action secondary">Chi tiết</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-section">
              <h2>Lịch Sử Phục Vụ</h2>
              <p className="section-subtitle">Các dịch vụ đã hoàn thành</p>

              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Mã HĐ</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Thành tiền</th>
                      <th>Thời gian</th>
                      <th>Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedServices.map((service) => (
                      <tr key={service.maHoaDon}>
                        <td>{service.maHoaDon}</td>
                        <td>{service.khachHang}</td>
                        <td>{service.dichVu}</td>
                        <td className="amount">{service.thanhTien}</td>
                        <td>{service.thoiGian}</td>
                        <td>
                          <span className="rating">
                            {'⭐'.repeat(service.danhGia)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <h2>Đánh Giá Từ Khách Hàng</h2>
              <p className="section-subtitle">Đánh giá trung bình: ⭐ {monthlyStats.danhGiaTB}/5</p>

              <div className="reviews-list">
                {reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div>
                        <h4>{review.khachHang}</h4>
                        <span className="review-date">{review.thoiGian}</span>
                      </div>
                      <span className="review-stars">
                        {'⭐'.repeat(review.sao)}
                      </span>
                    </div>
                    <p className="review-text">{review.nhanXet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h2>Thống Kê Tháng Này</h2>
              <p className="section-subtitle">Tháng 04/2026</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Số khách phục vụ</h3>
                    <p className="stat-number">{monthlyStats.soKhach}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Doanh thu</h3>
                    <p className="stat-number">{monthlyStats.doanhThu}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>Đánh giá TB</h3>
                    <p className="stat-number">{monthlyStats.danhGiaTB}/5</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-info">
                    <h3>Giờ làm việc</h3>
                    <p className="stat-number">{monthlyStats.soGioLam}h</p>
                  </div>
                </div>
              </div>

              <div className="performance-chart">
                <h3>Hiệu suất làm việc</h3>
                <div className="chart-placeholder">
                  <p>📈 Biểu đồ doanh thu và số khách theo tuần</p>
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}><span>T1</span></div>
                    <div className="bar" style={{height: '75%'}}><span>T2</span></div>
                    <div className="bar" style={{height: '85%'}}><span>T3</span></div>
                    <div className="bar" style={{height: '70%'}}><span>T4</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Thông Tin Cá Nhân</h2>

              <div className="profile-card">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    {(staffInfo.hoTen || 'S').charAt(0)}
                  </div>
                  <h3>{staffInfo.hoTen || 'Nhân viên'}</h3>
                  <p className="profile-position">{staffInfo.chucVu || 'Stylist'}</p>
                </div>

                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Mã nhân viên:</span>
                    <span className="detail-value">{staffInfo.maNhanVien}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Chi nhánh:</span>
                    <span className="detail-value">{staffInfo.maChiNhanh}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">{staffInfo.soDienThoai}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{staffInfo.email}</span>
                  </div>
                </div>

                <button className="btn-edit-profile">Chỉnh sửa thông tin</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Staff;
