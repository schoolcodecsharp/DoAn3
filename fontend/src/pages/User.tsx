import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/User.css';
import { datLichApi, dichVuApi, chiNhanhApi, nhanVienApi, hoaDonApi, danhGiaApi, khuyenMaiApi } from '../utils/api';

function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('booking');
  const [currentUser] = useState<any>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInvoice, setReviewInvoice] = useState<any>(null);
  const [reviewStarDV, setReviewStarDV] = useState(5);
  const [reviewStarNV, setReviewStarNV] = useState(5);
  const [reviewStarCH, setReviewStarCH] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewedInvoices, setReviewedInvoices] = useState<Set<string>>(new Set());

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<any>(null);
  const [payPromoCode, setPayPromoCode] = useState('');
  const [payPromoApplied, setPayPromoApplied] = useState<any>(null);
  const [payPromoError, setPayPromoError] = useState('');
  const [payMethod, setPayMethod] = useState('TienMat');
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    // Nếu có dịch vụ được chọn từ ServiceDetail, tự động set
    if (location.state?.preSelectedService) {
      setSelectedService(location.state.preSelectedService);
      setActiveTab('booking');
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      const [sv, br, st, allBk] = await Promise.all([
        dichVuApi.getAll(), 
        chiNhanhApi.getAll(), 
        nhanVienApi.getAll(),
        datLichApi.getAll({})
      ]);
      setServices(sv); setBranches(br); setStaff(st); setAllBookings(allBk);
      
      const sdt = currentUser?.SoDienThoai || currentUser?.soDienThoai;
      if (sdt) {
        setBookings(await datLichApi.getAll({ khachHang: sdt }));
        const inv = await hoaDonApi.getAll({ khachHang: sdt });
        setInvoices(inv);
        // Check which invoices already have reviews
        const reviewed = new Set<string>();
        for (const invoice of inv) {
          const maHD = invoice.maHoaDon || invoice.MaHoaDon;
          const existing = await danhGiaApi.getByHoaDon(maHD);
          if (existing) reviewed.add(maHD);
        }
        setReviewedInvoices(reviewed);
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
        nguonDatLich: 'Website',
        dichVuList: [{ maDichVu: selectedService, soLuong: 1 }]
      });
      alert('Đặt lịch thành công! Hóa đơn đã được tạo tự động. Bạn có thể xem trong tab Hóa đơn.');
      setSelectedService(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime('');
      loadData();
      setActiveTab('invoices');
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  const handleOpenReview = (invoice: any) => {
    setReviewInvoice(invoice);
    setReviewStarDV(5); setReviewStarNV(5); setReviewStarCH(5);
    setReviewText('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewInvoice || !currentUser) return;
    try {
      const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
      await danhGiaApi.create({
        maHoaDon: reviewInvoice.maHoaDon || reviewInvoice.MaHoaDon,
        soDienThoai: sdt,
        maNhanVien: reviewInvoice.maNhanVien || reviewInvoice.MaNhanVien || null,
        saoDichVu: reviewStarDV,
        saoNhanVien: reviewStarNV,
        saoCuaHang: reviewStarCH,
        nhanXet: reviewText
      });
      alert('Đánh giá thành công! Cảm ơn bạn.');
      setShowReviewModal(false);
      const maHD = reviewInvoice.maHoaDon || reviewInvoice.MaHoaDon;
      setReviewedInvoices(prev => new Set(prev).add(maHD));
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  // Payment modal handlers
  const handleOpenPayment = (invoice: any) => {
    setPaymentInvoice(invoice);
    setPayPromoCode('');
    setPayPromoApplied(null);
    setPayPromoError('');
    setPayMethod('TienMat');
    setShowPaymentModal(true);
  };

  const handleApplyPromo = async () => {
    setPayPromoError('');
    setPayPromoApplied(null);
    if (!payPromoCode.trim()) { setPayPromoError('Vui lòng nhập mã khuyến mãi'); return; }
    try {
      const promos = await khuyenMaiApi.getAll(payPromoCode);
      const found = (Array.isArray(promos) ? promos : []).find(
        (p: any) => (p.maCode || p.MaCode)?.toUpperCase() === payPromoCode.toUpperCase()
      );
      if (!found) { setPayPromoError('Mã khuyến mãi không tồn tại'); return; }
      if (!found.trangThai) { setPayPromoError('Mã khuyến mãi đã hết hạn'); return; }
      const tongTien = paymentInvoice?.tongTien || paymentInvoice?.TongTien || 0;
      if (found.donHangToiThieu && tongTien < found.donHangToiThieu) {
        setPayPromoError(`Đơn hàng tối thiểu ${found.donHangToiThieu.toLocaleString()}đ`);
        return;
      }
      setPayPromoApplied(found);
    } catch {
      setPayPromoError('Không thể kiểm tra mã khuyến mãi');
    }
  };

  const getPayDiscount = () => {
    if (!payPromoApplied || !paymentInvoice) return 0;
    const tongTien = paymentInvoice.tongTien || paymentInvoice.TongTien || 0;
    if (payPromoApplied.loaiGiam === 'PhanTram') {
      return Math.min(tongTien * payPromoApplied.giaTriGiam / 100, payPromoApplied.giaTriToiDa || Infinity);
    }
    return payPromoApplied.giaTriGiam;
  };

  const handleConfirmPayment = async () => {
    if (!paymentInvoice || !currentUser) return;
    setPayLoading(true);
    try {
      const maHD = paymentInvoice.maHoaDon || paymentInvoice.MaHoaDon;
      const tongTien = paymentInvoice.tongTien || paymentInvoice.TongTien || 0;
      const discount = getPayDiscount();
      const thanhTien = Math.max(0, tongTien - discount);
      await hoaDonApi.updatePayment(maHD, {
        maCode: payPromoApplied?.maCode || null,
        maDatLich: paymentInvoice.maDatLich || paymentInvoice.MaDatLich || null,
        giamGia: discount,
        thanhTien: thanhTien,
        phuongThucTT: payMethod,
        ghiChu: 'Đã thanh toán'
      });
      alert('Thanh toán thành công!');
      setShowPaymentModal(false);
      loadData();
    } catch (err: any) {
      alert('Lỗi thanh toán: ' + err.message);
    }
    setPayLoading(false);
  };

  const renderStars = (value: number, onChange: (v: number) => void) => (
    <div className="star-rating-input">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star-btn ${s <= value ? 'active' : ''}`} onClick={() => onChange(s)}>★</span>
      ))}
    </div>
  );

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

  // Kiểm tra xem time slot có bị đặt chưa
  const isTimeSlotBooked = (time: string) => {
    if (!selectedBarber || !selectedDate) return false;
    
    // Lấy tất cả lịch hẹn của nhân viên trong ngày đã chọn
    const barberBookings = allBookings.filter((b: any) => {
      const bookingDate = new Date(b.thoiGianHen || b.ThoiGianHen);
      const bookingDateStr = bookingDate.toISOString().split('T')[0];
      const bookingTime = bookingDate.toTimeString().slice(0, 5);
      const maNV = b.maNhanVien || b.MaNhanVien;
      const trangThai = b.trangThai || b.TrangThai;
      
      // Chỉ tính các lịch chưa hủy
      return maNV === selectedBarber && 
             bookingDateStr === selectedDate && 
             bookingTime === time &&
             trangThai !== 'DaHuy';
    });
    
    return barberBookings.length > 0;
  };

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
          <button className={activeTab === 'rewards' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('rewards')}>
            <span className="nav-icon">🎁</span>
            ĐỔI THƯỞNG
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
                      {services.map((service) => (
                        <div
                          key={service.maDichVu}
                          className={`service-card ${selectedService === service.maDichVu ? 'selected' : ''}`}
                          onClick={() => setSelectedService(service.maDichVu)}
                        >
                          <div className="service-image">
                            {service.hinhAnh ? (
                              <img 
                                src={service.hinhAnh} 
                                alt={service.tenDichVu}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '8px'
                                }}
                                onError={(e) => {
                                  const img = e.currentTarget;
                                  img.style.display = 'none';
                                  const placeholder = img.nextElementSibling as HTMLElement;
                                  if (placeholder) placeholder.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="service-placeholder" style={{ display: service.hinhAnh ? 'none' : 'flex' }}>✂️</div>
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
                      {staff
                        .filter((member) => {
                          const chucVu = (member.chucVu || member.ChucVu || '').toLowerCase();
                          return chucVu.includes('thợ') || chucVu.includes('barber') || chucVu.includes('stylist');
                        })
                        .map((member) => (
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
                        {timeSlots.map((time) => {
                          const isBooked = isTimeSlotBooked(time);
                          return (
                            <button
                              key={time}
                              className={`time-slot ${selectedTime === time ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                              onClick={() => !isBooked && setSelectedTime(time)}
                              disabled={isBooked}
                              style={{
                                opacity: isBooked ? 0.5 : 1,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                backgroundColor: isBooked ? '#2a2a2c' : (selectedTime === time ? '#D4AF37' : '#1A1A1B')
                              }}
                            >
                              <span>{time}</span>
                              {isBooked && <span style={{fontSize: '0.7rem', display: 'block', marginTop: '2px'}}>Đã đặt</span>}
                            </button>
                          );
                        })}
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
                      <th>Thành tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>
                          Chưa có hóa đơn nào
                        </td>
                      </tr>
                    ) : (
                      invoices.map(invoice => {
                        const maHD = invoice.maHoaDon || invoice.MaHoaDon;
                        const isReviewed = reviewedInvoices.has(maHD);
                        const phuongThuc = invoice.phuongThucTT || invoice.PhuongThucTT;
                        const isPaid = phuongThuc !== 'ChuaThanhToan';
                        return (
                          <tr key={maHD}>
                            <td>{maHD}</td>
                            <td>{new Date(invoice.thoiGianTT || invoice.ThoiGianTT).toLocaleDateString('vi-VN')}</td>
                            <td>{(invoice.tongTien || invoice.TongTien || 0).toLocaleString()}đ</td>
                            <td>{(invoice.giamGia || invoice.GiamGia || 0).toLocaleString()}đ</td>
                            <td style={{color: '#D4AF37', fontWeight: 700}}>{(invoice.thanhTien || invoice.ThanhTien || 0).toLocaleString()}đ</td>
                            <td>
                              {isPaid ? (
                                <span className="status-badge completed">Đã thanh toán</span>
                              ) : (
                                <span className="status-badge pending">Chờ thanh toán</span>
                              )}
                            </td>
                            <td style={{display: 'flex', gap: '0.4rem', flexWrap: 'wrap'}}>
                              {!isPaid && (
                                <button className="btn-review" style={{background: 'linear-gradient(135deg, #D4AF37, #c49b2f)', color: '#000'}} onClick={() => handleOpenPayment(invoice)}>💳 Thanh toán</button>
                              )}
                              {isPaid && !isReviewed && (
                                <button className="btn-review" onClick={() => handleOpenReview(invoice)}>⭐ Đánh giá</button>
                              )}
                              {isPaid && isReviewed && (
                                <span style={{color: '#22c55e', fontSize: '0.8rem', fontWeight: 600}}>✅ Đã đánh giá</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'rewards' && !currentUser && (
            <div className="profile-container">
              <div className="page-header"><h1 className="page-title">🎁 TRA CỨU & ĐỔI THƯỞNG</h1></div>
              <div style={{textAlign:'center',padding:'3rem',background:'#242426',borderRadius:'12px',border:'1px solid #3f3f46'}}>
                <p style={{fontSize:'1.2rem',color:'#a1a1aa'}}>Vui lòng <Link to="/login" style={{color:'#D4AF37',fontWeight:700}}>đăng nhập</Link> để xem điểm thưởng và đổi quà.</p>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && currentUser && (
            <div className="profile-container">
              <div className="page-header">
                <h1 className="page-title">🎁 TRA CỨU & ĐỔI THƯỞNG</h1>
              </div>
              <div className="profile-card-main" style={{marginBottom:'1.5rem'}}>
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large" style={{background:'linear-gradient(135deg,#D4AF37,#f59e0b)'}}>{currentUser?.hoTen?.charAt(0) || 'U'}</div>
                  <h3 className="profile-name">{currentUser?.hoTen || 'Khách hàng'}</h3>
                  <p className="profile-rank" style={{fontSize:'1rem'}}>
                    Hạng: <strong style={{color:'#D4AF37'}}>{['Thường', 'Bạc', 'Vàng', 'Kim cương'][currentUser.hangThanhVien || 0]}</strong>
                  </p>
                </div>
                <div className="profile-stats">
                  <div className="stat-box">
                    <div className="stat-value" style={{color:'#D4AF37',fontSize:'2rem'}}>{currentUser.diemTichLuy || 0}</div>
                    <div className="stat-label">Điểm hiện có</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{currentUser.tongDiemTich || 0}</div>
                    <div className="stat-label">Tổng điểm tích lũy</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{bookings.length}</div>
                    <div className="stat-label">Lượt đặt lịch</div>
                  </div>
                </div>
              </div>

              {/* Bảng hạng thành viên */}
              <div style={{background:'#242426',borderRadius:'12px',padding:'1.5rem',border:'1px solid #3f3f46',marginBottom:'1.5rem'}}>
                <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>📊 Bảng hạng thành viên</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.8rem'}}>
                  {[{name:'Thường',min:0,max:99,color:'#a1a1aa',icon:'🥉'},{name:'Bạc',min:100,max:499,color:'#94a3b8',icon:'🥈'},{name:'Vàng',min:500,max:999,color:'#D4AF37',icon:'🥇'},{name:'Kim cương',min:1000,max:Infinity,color:'#60a5fa',icon:'💎'}].map((tier,i) => (
                    <div key={tier.name} style={{background:currentUser.hangThanhVien===i?`${tier.color}15`:'#18181b',border:`1px solid ${currentUser.hangThanhVien===i?tier.color:'#3f3f46'}`,borderRadius:'10px',padding:'1rem',textAlign:'center',transition:'all .2s'}}>
                      <div style={{fontSize:'1.5rem'}}>{tier.icon}</div>
                      <div style={{fontWeight:700,color:tier.color,marginTop:'0.3rem'}}>{tier.name}</div>
                      <div style={{fontSize:'0.75rem',color:'#71717a',marginTop:'0.2rem'}}>{tier.min}{tier.max===Infinity?'+':` - ${tier.max}`} điểm</div>
                      {currentUser.hangThanhVien===i && <div style={{marginTop:'0.3rem',fontSize:'0.7rem',color:tier.color,fontWeight:600}}>⬤ Hạng hiện tại</div>}
                    </div>
                  ))}
                </div>
                <p style={{marginTop:'0.8rem',fontSize:'0.8rem',color:'#71717a'}}>Tổng điểm tích lũy của bạn: <strong style={{color:'#D4AF37'}}>{currentUser.tongDiemTich || 0}</strong> điểm {currentUser.hangThanhVien < 3 ? `• Cần thêm ${[100,500,1000][currentUser.hangThanhVien || 0] - (currentUser.tongDiemTich || 0)} điểm để lên hạng tiếp theo` : '• Bạn đã đạt hạng cao nhất!'}</p>
              </div>

              {/* Đổi thưởng */}
              <div style={{background:'#242426',borderRadius:'12px',padding:'1.5rem',border:'1px solid #3f3f46'}}>
                <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>🎁 Đổi điểm lấy ưu đãi</h3>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'1rem'}}>
                  {[
                    {name:'Giảm 10% hóa đơn',points:50,icon:'🏷️',desc:'Áp dụng cho hóa đơn tiếp theo'},
                    {name:'Giảm 20% hóa đơn',points:100,icon:'🎫',desc:'Áp dụng cho hóa đơn tiếp theo'},
                    {name:'Miễn phí gội đầu',points:30,icon:'💆',desc:'1 lần gội đầu miễn phí'},
                    {name:'Miễn phí cắt tóc',points:200,icon:'✂️',desc:'1 lần cắt tóc miễn phí'},
                    {name:'Combo VIP',points:500,icon:'👑',desc:'Cắt + Gội + Massage'},
                    {name:'Voucher 100K',points:150,icon:'💰',desc:'Giảm trực tiếp 100.000đ'},
                  ].map(reward => (
                    <div key={reward.name} style={{background:'#18181b',borderRadius:'10px',padding:'1rem',border:'1px solid #3f3f46',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'1.5rem'}}>{reward.icon}</span>
                        <span style={{background:'#D4AF3720',color:'#D4AF37',padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:700}}>{reward.points} điểm</span>
                      </div>
                      <h4 style={{color:'white',margin:0,fontSize:'0.95rem'}}>{reward.name}</h4>
                      <p style={{color:'#71717a',fontSize:'0.8rem',margin:0}}>{reward.desc}</p>
                      <button 
                        disabled={(currentUser.diemTichLuy || 0) < reward.points}
                        onClick={() => alert(`Đổi thành công: ${reward.name}! Trừ ${reward.points} điểm.`)}
                        style={{marginTop:'auto',padding:'0.5rem',borderRadius:'6px',border:'none',fontWeight:600,fontSize:'0.85rem',cursor:(currentUser.diemTichLuy||0)>=reward.points?'pointer':'not-allowed',
                          background:(currentUser.diemTichLuy||0)>=reward.points?'linear-gradient(135deg,#D4AF37,#c49b2f)':'#3f3f46',
                          color:(currentUser.diemTichLuy||0)>=reward.points?'#000':'#71717a',
                          transition:'all .2s'
                        }}
                      >{(currentUser.diemTichLuy||0)>=reward.points?'Đổi ngay':'Chưa đủ điểm'}</button>
                    </div>
                  ))}
                </div>
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
                    <span className="detail-label">Họ tên:</span>
                    <span className="detail-value">{currentUser.hoTen || 'Chưa cập nhật'}</span>
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
        <button className={activeTab === 'rewards' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('rewards')}>
          <span className="mobile-nav-icon">🎁</span>
          <span className="mobile-nav-label">Đổi thưởng</span>
        </button>
        <button className={activeTab === 'profile' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => setActiveTab('profile')}>
          <span className="mobile-nav-icon">👤</span>
          <span className="mobile-nav-label">Tôi</span>
        </button>
      </nav>

      {/* Review Modal */}
      {showReviewModal && reviewInvoice && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal" onClick={e => e.stopPropagation()}>
            <div className="review-modal-header">
              <h3>⭐ ĐÁNH GIÁ DỊCH VỤ</h3>
              <button className="review-close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="review-modal-body">
              <p className="review-invoice-id">Hóa đơn: <strong>{reviewInvoice.maHoaDon || reviewInvoice.MaHoaDon}</strong></p>
              <div className="review-field">
                <label>Chất lượng dịch vụ</label>
                {renderStars(reviewStarDV, setReviewStarDV)}
              </div>
              <div className="review-field">
                <label>Nhân viên phục vụ</label>
                {renderStars(reviewStarNV, setReviewStarNV)}
              </div>
              <div className="review-field">
                <label>Cửa hàng</label>
                {renderStars(reviewStarCH, setReviewStarCH)}
              </div>
              <div className="review-field">
                <label>Nhận xét</label>
                <textarea
                  className="review-textarea"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div className="review-modal-footer">
              <button className="review-cancel-btn" onClick={() => setShowReviewModal(false)}>Hủy</button>
              <button className="review-submit-btn" onClick={handleSubmitReview}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentInvoice && (() => {
        const tongTien = paymentInvoice.tongTien || paymentInvoice.TongTien || 0;
        const discount = getPayDiscount();
        const thanhTien = Math.max(0, tongTien - discount);
        return (
          <div className="review-modal-overlay" onClick={() => setShowPaymentModal(false)}>
            <div className="review-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '520px'}}>
              <div className="review-modal-header" style={{background: 'linear-gradient(135deg, #D4AF37, #c49b2f)'}}>
                <h3 style={{color: '#000'}}>💳 THANH TOÁN HÓA ĐƠN</h3>
                <button className="review-close-btn" onClick={() => setShowPaymentModal(false)} style={{color: '#000'}}>×</button>
              </div>
              <div className="review-modal-body">
                <p className="review-invoice-id">Hóa đơn: <strong>{paymentInvoice.maHoaDon || paymentInvoice.MaHoaDon}</strong></p>

                {/* Tổng tiền */}
                <div style={{background: '#18181b', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', border: '1px solid #3f3f46'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                    <span style={{color: '#a1a1aa'}}>Tổng tiền dịch vụ</span>
                    <span style={{color: '#fff', fontWeight: 600}}>{tongTien.toLocaleString()}đ</span>
                  </div>
                  {discount > 0 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <span style={{color: '#22c55e'}}>🎁 Giảm giá</span>
                      <span style={{color: '#22c55e', fontWeight: 600}}>-{discount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div style={{borderTop: '1px solid #3f3f46', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: '#D4AF37', fontWeight: 700, fontSize: '1.1rem'}}>Thành tiền</span>
                    <span style={{color: '#D4AF37', fontWeight: 700, fontSize: '1.1rem'}}>{thanhTien.toLocaleString()}đ</span>
                  </div>
                </div>

                {/* Mã khuyến mãi */}
                <div className="review-field">
                  <label>🎁 Mã giảm giá</label>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <input
                      type="text"
                      placeholder="Nhập mã khuyến mãi..."
                      value={payPromoCode}
                      onChange={e => setPayPromoCode(e.target.value.toUpperCase())}
                      style={{flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #3f3f46', background: '#18181b', color: '#fff', fontSize: '0.9rem'}}
                    />
                    <button
                      onClick={handleApplyPromo}
                      style={{padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: '#D4AF37', color: '#000', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'}}
                    >Áp dụng</button>
                  </div>
                  {payPromoError && <p style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem'}}>❌ {payPromoError}</p>}
                  {payPromoApplied && (
                    <div style={{background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: '8px', padding: '0.5rem 0.8rem', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{color: '#22c55e', fontSize: '0.85rem'}}>✅ {payPromoApplied.tenKhuyenMai}</span>
                      <span style={{color: '#22c55e', fontWeight: 700, fontSize: '0.85rem'}}>
                        -{payPromoApplied.loaiGiam === 'PhanTram' ? `${payPromoApplied.giaTriGiam}%` : `${payPromoApplied.giaTriGiam?.toLocaleString()}đ`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phương thức thanh toán */}
                <div className="review-field">
                  <label>💳 Phương thức thanh toán</label>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '0.3rem'}}>
                    {[
                      {value: 'TienMat', icon: '💵', label: 'Tiền mặt'},
                      {value: 'ChuyenKhoan', icon: '🏦', label: 'Chuyển khoản'},
                      {value: 'Momo', icon: '📱', label: 'Momo'},
                      {value: 'VNPay', icon: '💳', label: 'VNPay'},
                    ].map(m => (
                      <button
                        key={m.value}
                        onClick={() => setPayMethod(m.value)}
                        style={{
                          padding: '0.6rem', borderRadius: '8px', cursor: 'pointer',
                          border: payMethod === m.value ? '2px solid #D4AF37' : '1px solid #3f3f46',
                          background: payMethod === m.value ? '#D4AF3715' : '#18181b',
                          color: payMethod === m.value ? '#D4AF37' : '#a1a1aa',
                          fontWeight: payMethod === m.value ? 700 : 400,
                          transition: 'all 0.2s', fontSize: '0.85rem'
                        }}
                      >{m.icon} {m.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="review-modal-footer">
                <button className="review-cancel-btn" onClick={() => setShowPaymentModal(false)}>Hủy</button>
                <button
                  className="review-submit-btn"
                  onClick={handleConfirmPayment}
                  disabled={payLoading}
                  style={{background: 'linear-gradient(135deg, #D4AF37, #c49b2f)', color: '#000'}}
                >{payLoading ? '⏳ Đang xử lý...' : `💳 Thanh toán ${thanhTien.toLocaleString()}đ`}</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default User;
