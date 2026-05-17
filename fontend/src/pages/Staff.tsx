import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Staff.css';
import { nhanVienApi, datLichApi, dichVuApi, danhGiaApi } from '../utils/api';

function Staff() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [completedServices, setCompletedServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({ soKhach: 0, doanhThu: '0đ', danhGiaTB: 0, soGioLam: 0, tongKhach: 0, tongDoanhThu: '0đ' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const allServices = await dichVuApi.getAll();
      setServices(allServices);

      // Lấy thông tin nhân viên đang đăng nhập
      const currentUser = localStorage.getItem('currentUser');
      let maNV = 'NV001';
      if (currentUser) {
        const user = JSON.parse(currentUser);
        maNV = user.maNhanVien || user.MaNhanVien || 'NV001';
      }

      const staffData = await nhanVienApi.getById(maNV);
      setStaffInfo(staffData);
      maNV = staffData.maNhanVien || 'NV001';

      // Lấy lịch hẹn hôm nay (đã xác nhận + đang phục vụ)
      const staffApts = await datLichApi.getAll({ nhanVien: maNV });
      const today = new Date().toISOString().split('T')[0];
      const todayApts = staffApts.filter((a: any) => {
        const aptDate = new Date(a.thoiGianHen).toISOString().split('T')[0];
        const status = a.trangThai || a.TrangThai;
        return aptDate === today && status !== 'DaHuy' && status !== 'HoanThanh';
      });
      setAppointments(todayApts);

      // Lấy lịch sử phục vụ từ API mới
      try {
        const history = await nhanVienApi.getServiceHistory(maNV);
        const historyArr = Array.isArray(history) ? history : [];
        setCompletedServices(historyArr.map((item: any) => ({
          maHoaDon: item.maHoaDon,
          khachHang: item.tenKhachHang || 'Khách hàng',
          dichVu: item.dichVu || 'Dịch vụ cắt tóc',
          thanhTien: (item.thanhTien || 0).toLocaleString() + 'đ',
          thoiGian: new Date(item.thoiGianTT).toLocaleDateString('vi-VN'),
          danhGia: item.saoNhanVien || 0,
          nhanXet: item.nhanXetDanhGia || ''
        })));
      } catch { setCompletedServices([]); }

      // Lấy đánh giá từ API 
      const staffReviews = await danhGiaApi.getAll({ nhanVien: maNV });
      const reviewsArr = Array.isArray(staffReviews) ? staffReviews : [];
      setReviews(reviewsArr.map((dg: any) => ({
        khachHang: dg.tenKhachHang || 'Khách hàng',
        sao: dg.saoNhanVien || 0,
        saoDichVu: dg.saoDichVu || 0,
        saoCuaHang: dg.saoCuaHang || 0,
        nhanXet: dg.nhanXet || '',
        thoiGian: new Date(dg.ngayDanhGia).toLocaleDateString('vi-VN')
      })));

      // Lấy thống kê từ API mới
      try {
        const stats = await nhanVienApi.getStats(maNV);
        const avgR = reviewsArr.length > 0
          ? (reviewsArr.reduce((s: number, d: any) => s + (d.saoNhanVien || 0), 0) / reviewsArr.length).toFixed(1)
          : (stats.danhGiaTB || 0).toFixed(1);
        setMonthlyStats({
          soKhach: stats.soKhach || 0,
          doanhThu: (stats.doanhThu || 0).toLocaleString() + 'đ',
          danhGiaTB: parseFloat(avgR),
          soGioLam: (stats.soKhach || 0) * 1, // ~1h per customer
          tongKhach: stats.tongKhachDaPhucVu || 0,
          tongDoanhThu: (stats.tongDoanhThu || 0).toLocaleString() + 'đ'
        });
      } catch {
        setMonthlyStats({ soKhach: 0, doanhThu: '0đ', danhGiaTB: 0, soGioLam: 0, tongKhach: 0, tongDoanhThu: '0đ' });
      }
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

  const currentMonth = new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

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
                  <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <p>Không có lịch hẹn nào hôm nay</p>
                  </div>
                ) : (
                  appointments.map((apt) => {
                    return (
                      <div key={apt.maDatLich} className="appointment-card">
                        <div className="appointment-header">
                          <div>
                            <h3>{apt.tenKhachHang || 'Khách hàng'}</h3>
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
                            <span className="value">{apt.ghiChu || 'Dịch vụ cắt tóc'}</span>
                          </div>
                        </div>

                        <div className="appointment-actions">
                          {apt.trangThai === 'DaXacNhan' && (
                            <button 
                              className="btn-action primary"
                              onClick={() => handleUpdateStatus(apt.maDatLich, 'DangPhucVu')}
                            >
                              ✂️ Bắt đầu phục vụ
                            </button>
                          )}
                          {apt.trangThai === 'DangPhucVu' && (
                            <>
                              <span className="serving-indicator">
                                🔄 Đang phục vụ khách...
                              </span>
                              <button 
                                className="btn-action primary"
                                style={{background: 'linear-gradient(135deg, #22c55e, #16a34a)', marginLeft: '0.5rem'}}
                                onClick={() => handleUpdateStatus(apt.maDatLich, 'HoanThanh')}
                              >
                                ✅ Hoàn thành
                              </button>
                            </>
                          )}
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
              <p className="section-subtitle">Các dịch vụ đã hoàn thành ({completedServices.length} lượt)</p>

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
                    {completedServices.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{textAlign: 'center', padding: '2rem', color: '#888'}}>
                          Chưa có lịch sử phục vụ
                        </td>
                      </tr>
                    ) : (
                      completedServices.map((service) => (
                        <tr key={service.maHoaDon}>
                          <td>{service.maHoaDon}</td>
                          <td>{service.khachHang}</td>
                          <td>{service.dichVu}</td>
                          <td className="amount">{service.thanhTien}</td>
                          <td>{service.thoiGian}</td>
                          <td>
                            {service.danhGia > 0 ? (
                              <span className="rating">
                                {'⭐'.repeat(service.danhGia)}
                              </span>
                            ) : (
                              <span style={{color: '#666', fontSize: '0.85rem'}}>Chưa đánh giá</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <h2>Đánh Giá Từ Khách Hàng</h2>
              <p className="section-subtitle">
                Đánh giá trung bình: ⭐ {monthlyStats.danhGiaTB}/5 ({reviews.length} đánh giá)
              </p>

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">⭐</span>
                    <p>Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  reviews.map((review, index) => (
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
                      <div className="review-scores">
                        <span>Dịch vụ: {'★'.repeat(review.saoDichVu)}</span>
                        <span>Cửa hàng: {'★'.repeat(review.saoCuaHang)}</span>
                      </div>
                      {review.nhanXet && <p className="review-text">"{review.nhanXet}"</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h2>Thống Kê Tháng Này</h2>
              <p className="section-subtitle">Tháng {currentMonth}</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Số khách phục vụ</h3>
                    <p className="stat-number">{monthlyStats.soKhach}</p>
                    <span className="stat-sub">tháng này</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Doanh thu</h3>
                    <p className="stat-number">{monthlyStats.doanhThu}</p>
                    <span className="stat-sub">tháng này</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>Đánh giá TB</h3>
                    <p className="stat-number">{monthlyStats.danhGiaTB}/5</p>
                    <span className="stat-sub">{reviews.length} đánh giá</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Tổng khách đã phục vụ</h3>
                    <p className="stat-number">{monthlyStats.tongKhach}</p>
                    <span className="stat-sub">tất cả thời gian</span>
                  </div>
                </div>
              </div>

              <div className="stats-summary-card">
                <h3>📈 Tổng quan hiệu suất</h3>
                <div className="stats-summary-grid">
                  <div className="stats-summary-item">
                    <span className="stats-summary-label">Tổng doanh thu tích lũy</span>
                    <span className="stats-summary-value">{monthlyStats.tongDoanhThu}</span>
                  </div>
                  <div className="stats-summary-item">
                    <span className="stats-summary-label">Số lịch sử phục vụ</span>
                    <span className="stats-summary-value">{completedServices.length} lượt</span>
                  </div>
                  <div className="stats-summary-item">
                    <span className="stats-summary-label">Số đánh giá nhận được</span>
                    <span className="stats-summary-value">{reviews.length} đánh giá</span>
                  </div>
                  <div className="stats-summary-item">
                    <span className="stats-summary-label">Giờ làm ước tính (tháng này)</span>
                    <span className="stats-summary-value">{monthlyStats.soGioLam}h</span>
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
                    <span className="detail-value">{staffInfo.tenChiNhanh || staffInfo.maChiNhanh}</span>
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
