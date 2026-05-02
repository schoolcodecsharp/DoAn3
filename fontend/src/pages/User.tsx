import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/User.css';
import { datLichApi, dichVuApi, chiNhanhApi, nhanVienApi, hoaDonApi } from '../utils/api';

function User() {
  const [activeTab, setActiveTab] = useState('booking');
  const [currentUser] = useState<any>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [sv, br, st] = await Promise.all([
        dichVuApi.getAll(), chiNhanhApi.getAll(), nhanVienApi.getAll()
      ]);
      setServices(sv); setBranches(br); setStaff(st);
      const sdt = currentUser?.SoDienThoai || currentUser?.soDienThoai;
      if (sdt) {
        setBookings(await datLichApi.getAll({ khachHang: sdt }));
        setInvoices(await hoaDonApi.getAll({ khachHang: sdt }));
      }
    } catch (err) { console.error(err); }
  };

  const handleBookingSubmit = async () => {
    if (!currentUser) { alert('Vui lòng đăng nhập để đặt lịch!'); return; }
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn đầy đủ thông tin!'); return;
    }
    try {
      const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
      const maDL = 'DL' + Date.now().toString().slice(-8);
      await datLichApi.create({
        maDatLich: maDL, soDienThoai: sdt,
        maChiNhanh: (branches[0]?.MaChiNhanh || branches[0]?.maChiNhanh || 'CN001'),
        maNhanVien: selectedBarber, thoiGianHen: `${selectedDate}T${selectedTime}:00`,
        nguonDatLich: 'Website'
      });
      alert('Đặt lịch thành công! Vui lòng chờ xác nhận.');
      setSelectedService(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime('');
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      'ChoXacNhan': { text: 'Chờ xác nhận', className: 'pending' },
      'DaXacNhan': { text: 'Đã xác nhận', className: 'confirmed' },
      'DangPhucVu': { text: 'Đang phục vụ', className: 'serving' },
      'HoanThanh': { text: 'Hoàn thành', className: 'completed' },
      'DaHuy': { text: 'Đã hủy', className: 'cancelled' }
    };
    const statusInfo = statusMap[status] || { text: status, className: 'normal' };
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('vi-VN');
    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };

  const selectedServiceData = services.find((s: any) => (s.maDichVu) === selectedService);
  const selectedBarberData = staff.find((s: any) => (s.maNhanVien) === selectedBarber);

  // Generate next 5 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="top-header">
        <div className="header-content">
          <div className="logo-text">THE GROOMING LOUNGE</div>
          <div className="header-actions">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Tìm kiếm dịch vụ..." />
            </div>
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">❓</button>
            <div className="user-avatar-header">{currentUser?.hoTen?.charAt(0) || 'U'}</div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className="sidebar-nav">
        <div className="sidebar-brand">
          <div className="brand-title">MANAGEMENT</div>
          <div className="brand-subtitle">Premium Suite</div>
        </div>
        <nav className="nav-menu">
          <button className={activeTab === 'booking' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('booking')}>
            <span className="nav-icon">📅</span>
            ĐẶT LỊCH
          </button>
          <button className={activeTab === 'history' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('history')}>
            <span className="nav-icon">📋</span>
            LỊCH SỬ ĐẶT LỊCH
          </button>
          <button className={activeTab === 'invoices' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('invoices')}>
            <span className="nav-icon">🧾</span>
            HÓA ĐƠN
          </button>
          <button className={activeTab === 'profile' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('profile')}>
            <span className="nav-icon">👤</span>
            THÔNG TIN CÁ NHÂN
          </button>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="footer-link">
            <span className="nav-icon">⚙️</span>
            SETTINGS
          </Link>
          <Link to="/" className="footer-link">
            <span className="nav-icon">🚪</span>
            SIGN OUT
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'booking' && (
            <>
              {/* Page Header */}
              <div className="page-header">
                <h1 className="page-title">ĐẶT LỊCH HẸN</h1>
                <p className="page-subtitle">
                  Trải nghiệm dịch vụ grooming đẳng cấp nhất tại The Grooming Lounge. Vui lòng chọn dịch vụ và thời gian mong muốn của bạn.
                </p>
              </div>

              <div className="booking-layout">
                {/* Left Column */}
                <div className="booking-left">
                  {/* Section 1: Service Selection */}
                  <section className="booking-section">
                    <div className="section-header">
                      <h2 className="section-title">1. CHỌN DỊCH VỤ</h2>
                      <span className="section-badge">Yêu thích</span>
                    </div>
                    <div className="service-grid">
                      {services.slice(0, 6).map((service) => (
                        <div
                          key={service.maDichVu}
                          className={`service-card ${selectedService === service.maDichVu ? 'selected' : ''}`}
                          onClick={() => setSelectedService(service.maDichVu)}
                        >
                          <div className="service-image">
                            <div className="service-placeholder">✂️</div>
                          </div>
                          <div className="service-info">
                            <div className="service-header">
                              <h3 className="service-name">{service.tenDichVu}</h3>
                              <span className="service-price">{service.gia.toLocaleString()}đ</span>
                            </div>
                            <p className="service-desc">{service.moTa || 'Dịch vụ chất lượng cao'}</p>
                            <div className="service-duration">
                              <span className="duration-icon">⏱️</span>
                              {service.thoiGianPhut} Phút
                            </div>
                          </div>
                          {selectedService === service.maDichVu && (
                            <div className="service-check">✓</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 2: Barber Selection */}
                  <section className="booking-section">
                    <h2 className="section-title">2. CHỌN BARBER</h2>
                    <div className="barber-scroll">
                      {staff.slice(0, 6).map((member) => (
                        <div
                          key={member.maNhanVien}
                          className={`barber-item ${selectedBarber === member.maNhanVien ? 'selected' : ''}`}
                          onClick={() => setSelectedBarber(member.maNhanVien)}
                        >
                          <div className="barber-frame">
                            <div className="barber-avatar">{member.hoTen.charAt(0)}</div>
                          </div>
                          <h4 className="barber-name">{member.hoTen}</h4>
                          <p className="barber-role">{member.chucVu}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 3: Time Selection */}
                  <section className="booking-section">
                    <h2 className="section-title">3. THỜI GIAN</h2>
                    <div className="time-container">
                      <div className="date-scroll">
                        {getNextDays().map((date, index) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const dayNames = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                          return (
                            <div
                              key={index}
                              className={`date-item ${selectedDate === dateStr ? 'selected' : ''}`}
                              onClick={() => setSelectedDate(dateStr)}
                            >
                              <span className="date-day">{dayNames[date.getDay()]}</span>
                              <span className="date-number">{date.getDate()}</span>
                              <span className="date-month">Thg {date.getMonth() + 1}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="time-grid">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Summary */}
                <div className="booking-right">
                  <div className="summary-card">
                    <div className="summary-header">
                      <h2 className="summary-title">CHI TIẾT LỊCH HẸN</h2>
                    </div>
                    <div className="summary-body">
                      <div className="summary-item">
                        <div className="summary-label">
                          <span className="summary-icon">✂️</span>
                          <span>{selectedServiceData?.tenDichVu || 'Chưa chọn dịch vụ'}</span>
                        </div>
                        {selectedServiceData && (
                          <span className="summary-value">{selectedServiceData.gia.toLocaleString()}đ</span>
                        )}
                      </div>
                      <div className="summary-item">
                        <div className="summary-label">
                          <span className="summary-icon">👤</span>
                          <span>Barber {selectedBarberData?.hoTen || 'Chưa chọn'}</span>
                        </div>
                      </div>
                      <div className="summary-item">
                        <div className="summary-label">
                          <span className="summary-icon">📅</span>
                          <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : 'Chưa chọn ngày'}</span>
                        </div>
                      </div>
                      <div className="summary-item">
                        <div className="summary-label">
                          <span className="summary-icon">⏰</span>
                          <span>{selectedTime || 'Chưa chọn giờ'} {selectedServiceData && `(${selectedServiceData.thoiGianPhut} Phút)`}</span>
                        </div>
                      </div>
                      <div className="summary-total">
                        <span className="total-label">TỔNG CỘNG</span>
                        <span className="total-value">{selectedServiceData?.gia.toLocaleString() || '0'}đ</span>
                      </div>
                      <button className="btn-confirm" onClick={handleBookingSubmit}>
                        XÁC NHẬN ĐẶT LỊCH
                        <span className="btn-arrow">→</span>
                      </button>
                      <p className="summary-note">
                        Bằng cách xác nhận, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi.
                      </p>
                    </div>
                  </div>

                  {/* Promotion Card */}
                  <div className="promo-card">
                    <span className="promo-icon">📢</span>
                    <div>
                      <h4 className="promo-title">PROMO: GENTLEMANS_CLUB</h4>
                      <p className="promo-text">Giảm 15% cho khách hàng đặt lịch lần đầu qua ứng dụng.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <div className="history-container">
              <div className="page-header">
                <h1 className="page-title">LỊCH SỬ ĐẶT LỊCH</h1>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã đặt lịch</th>
                      <th>Chi nhánh</th>
                      <th>Stylist</th>
                      <th>Ngày hẹn</th>
                      <th>Giờ hẹn</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                          Chưa có lịch hẹn nào
                        </td>
                      </tr>
                    ) : (
                      bookings.map(booking => {
                        const branch = branches.find(b => b.maChiNhanh === booking.maChiNhanh);
                        const stylist = staff.find(s => s.maNhanVien === booking.maNhanVien);
                        const { date, time } = formatDateTime(booking.thoiGianHen);
                        return (
                          <tr key={booking.maDatLich}>
                            <td>{booking.maDatLich}</td>
                            <td>{branch?.tenChiNhanh || booking.maChiNhanh}</td>
                            <td>{stylist?.hoTen || 'Chưa chọn'}</td>
                            <td>{date}</td>
                            <td>{time}</td>
                            <td>{getStatusBadge(booking.trangThai)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="invoices-container">
              <div className="page-header">
                <h1 className="page-title">HÓA ĐƠN</h1>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã hóa đơn</th>
                      <th>Ngày tạo</th>
                      <th>Tổng tiền</th>
                      <th>Giảm giá</th>
                      <th>Thanh toán</th>
                      <th>Điểm thưởng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{textAlign: 'center', padding: '2rem'}}>
                          Chưa có hóa đơn nào
                        </td>
                      </tr>
                    ) : (
                      invoices.map(invoice => (
                        <tr key={invoice.maHoaDon}>
                          <td>{invoice.maHoaDon}</td>
                          <td>{new Date(invoice.thoiGianTT).toLocaleDateString('vi-VN')}</td>
                          <td>{invoice.tongTien.toLocaleString()}đ</td>
                          <td>{invoice.giamGia.toLocaleString()}đ</td>
                          <td>{invoice.thanhTien.toLocaleString()}đ</td>
                          <td>+{invoice.diemDuocCong}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && currentUser && (
            <div className="profile-container">
              <div className="page-header">
                <h1 className="page-title">THÔNG TIN CÁ NHÂN</h1>
              </div>
              <div className="profile-card-main">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">{currentUser?.hoTen?.charAt(0) || 'U'}</div>
                  <h3 className="profile-name">{currentUser?.hoTen || 'Khách hàng'}</h3>
                  <p className="profile-rank">
                    Hạng: {['Thường', 'Bạc', 'Vàng', 'Kim cương'][currentUser.hangThanhVien]}
                  </p>
                </div>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Mã nhân viên:</span>
                    <span className="detail-value">{currentUser.soDienThoai}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">{currentUser.soDienThoai}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{currentUser.email || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ngày sinh:</span>
                    <span className="detail-value">{currentUser.ngaySinh || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giới tính:</span>
                    <span className="detail-value">{currentUser.gioiTinh}</span>
                  </div>
                </div>
                <div className="profile-stats">
                  <div className="stat-box">
                    <div className="stat-value">{currentUser.diemTichLuy}</div>
                    <div className="stat-label">Điểm hiện tại</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{currentUser.tongDiemTich}</div>
                    <div className="stat-label">Tổng điểm tích lũy</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{bookings.length}</div>
                    <div className="stat-label">Lượt đặt lịch</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav">
        <button className={activeTab === 'booking' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('booking')}>
          <span className="mobile-nav-icon">📅</span>
          <span className="mobile-nav-label">Đặt lịch</span>
        </button>
        <button className={activeTab === 'history' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('history')}>
          <span className="mobile-nav-icon">📋</span>
          <span className="mobile-nav-label">Lịch sử</span>
        </button>
        <button className={activeTab === 'invoices' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('invoices')}>
          <span className="mobile-nav-icon">🧾</span>
          <span className="mobile-nav-label">Hóa đơn</span>
        </button>
        <button className={activeTab === 'profile' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('profile')}>
          <span className="mobile-nav-icon">👤</span>
          <span className="mobile-nav-label">Tôi</span>
        </button>
      </nav>
    </>
  );
}

export default User;
