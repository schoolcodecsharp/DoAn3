import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/User.css';
import { datLichApi, dichVuApi, chiNhanhApi, nhanVienApi, hoaDonApi, danhGiaApi, khuyenMaiApi, doiThuongApi, authApi, khachHangApi } from '../utils/api';

function User() {
  const location = useLocation();
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
  const [selectedBranch, setSelectedBranch] = useState<string>(''); // Thêm state chọn chi nhánh
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showAllServices, setShowAllServices] = useState(false);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // Refs for click outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
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

  // Rewards state
  const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [rewardsTab, setRewardsTab] = useState<'redeem' | 'history'>('redeem');

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    hoTen: '',
    email: '',
    gioiTinh: '',
    ngaySinh: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordChanging, setPasswordChanging] = useState(false);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    // Nếu có dịch vụ được chọn từ ServiceDetail, tự động set
    if (location.state?.preSelectedService) {
      setSelectedService(location.state.preSelectedService);
      setActiveTab('booking');
    }
  }, [location.state]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        // Load rewards history
        try {
          const rewards = await doiThuongApi.getLichSu(sdt);
          setRewardsHistory(rewards);
        } catch (err) {
          console.error('Error loading rewards:', err);
          setRewardsHistory([]);
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleBookingSubmit = async () => {
    if (!currentUser) { alert('Vui lòng đăng nhập để đặt lịch!'); return; }
    if (!selectedService || !selectedBranch || !selectedBarber || !selectedDate || !selectedTime) {
      alert('Vui lòng chọn đầy đủ thông tin!'); return;
    }
    try {
      const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
      const maDL = 'DL' + Date.now().toString().slice(-8);
      await datLichApi.create({
        maDatLich: maDL, soDienThoai: sdt,
        maChiNhanh: selectedBranch,
        maNhanVien: selectedBarber, thoiGianHen: `${selectedDate}T${selectedTime}:00`,
        nguonDatLich: 'Website',
        dichVuList: [{ maDichVu: selectedService, soLuong: 1 }]
      });
      alert('Đặt lịch thành công! Hóa đơn đã được tạo tự động. Bạn có thể xem trong tab Hóa đơn.');
      setSelectedService(''); setSelectedBranch(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime('');
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

  // Redeem reward handler
  const handleRedeemReward = async (reward: { name: string; points: number; type: string }) => {
    if (!currentUser) { alert('Vui lòng đăng nhập!'); return; }
    const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
    if ((currentUser.diemTichLuy || 0) < reward.points) {
      alert('Không đủ điểm để đổi thưởng!');
      return;
    }

    const confirmed = window.confirm(
      `Bạn muốn đổi ${reward.points} điểm để nhận "${reward.name}"?\n\nĐiểm hiện có: ${currentUser.diemTichLuy || 0}\nĐiểm sau khi đổi: ${(currentUser.diemTichLuy || 0) - reward.points}`
    );
    if (!confirmed) return;

    setRedeemLoading(true);
    try {
      const result = await doiThuongApi.doiDiem(sdt, reward.points, reward.type);
      
      // Cập nhật điểm trong localStorage
      const updatedUser = { ...currentUser, diemTichLuy: result.diemConLai ?? ((currentUser.diemTichLuy || 0) - reward.points) };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Show success message
      alert(`✅ Đổi thưởng thành công! Bạn nhận được: ${result.maCode || 'mã giảm giá'}`);
      
      // Reload lịch sử đổi thưởng
      try {
        const rewards = await doiThuongApi.getLichSu(sdt);
        setRewardsHistory(rewards);
      } catch (err) {
        console.error('Error reloading rewards:', err);
      }
      
      // Force reload page data (điểm mới)
      window.location.reload();
    } catch (err: any) {
      alert('Lỗi đổi thưởng: ' + (err.message || 'Vui lòng thử lại'));
    }
    setRedeemLoading(false);
  };

  // Profile edit handlers
  const handleEditProfile = () => {
    setProfileForm({
      hoTen: currentUser?.hoTen || currentUser?.HoTen || '',
      email: currentUser?.email || currentUser?.Email || '',
      gioiTinh: currentUser?.gioiTinh || currentUser?.GioiTinh || 'Nam',
      ngaySinh: currentUser?.ngaySinh ? new Date(currentUser.ngaySinh).toISOString().split('T')[0] : ''
    });
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setProfileForm({ hoTen: '', email: '', gioiTinh: '', ngaySinh: '' });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    // Validation
    if (!profileForm.hoTen.trim()) {
      alert('Vui lòng nhập họ tên!');
      return;
    }
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      alert('Email không hợp lệ!');
      return;
    }

    setProfileSaving(true);
    try {
      const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
      await khachHangApi.update(sdt, {
        hoTen: profileForm.hoTen.trim(),
        email: profileForm.email.trim(),
        gioiTinh: profileForm.gioiTinh,
        ngaySinh: profileForm.ngaySinh || null,
        hangThanhVien: currentUser.hangThanhVien,
        diemTichLuy: currentUser.diemTichLuy,
        tongDiemTich: currentUser.tongDiemTich,
        trangThai: currentUser.trangThai
      });

      // Update localStorage
      const updatedUser = { ...currentUser, hoTen: profileForm.hoTen.trim(), email: profileForm.email.trim(), gioiTinh: profileForm.gioiTinh, ngaySinh: profileForm.ngaySinh };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      alert('✅ Cập nhật thông tin thành công!');
      setIsEditingProfile(false);
      window.location.reload(); // Reload to update UI
    } catch (err: any) {
      alert('❌ Lỗi: ' + (err.message || 'Không thể cập nhật thông tin'));
    } finally {
      setProfileSaving(false);
    }
  };

  // Change password handlers
  const handleChangePassword = async () => {
    if (!currentUser) return;

    // Validation
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    setPasswordChanging(true);
    try {
      const identifier = currentUser.email || currentUser.Email || currentUser.soDienThoai || currentUser.SoDienThoai;
      await authApi.changePassword(identifier, passwordForm.oldPassword, passwordForm.newPassword, 'user');
      
      alert('✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    } catch (err: any) {
      alert('❌ ' + (err.message || 'Mật khẩu cũ không đúng!'));
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
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
  const selectedBranchData = branches.find((b: any) => (b.maChiNhanh || b.MaChiNhanh) === selectedBranch);
  const selectedBarberData = staff.find((s: any) => (s.maNhanVien) === selectedBarber);

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter((invoice) => {
    if (!searchQuery || activeTab !== 'invoices') return true;
    const maHD = (invoice.maHoaDon || invoice.MaHoaDon || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return maHD.includes(query);
  });

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
              <input 
                type="text" 
                placeholder={activeTab === 'booking' ? 'Tìm kiếm dịch vụ...' : activeTab === 'invoices' ? 'Tìm kiếm hóa đơn...' : 'Tìm kiếm...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Notifications */}
            <div style={{position: 'relative'}} ref={notificationRef}>
              <button 
                className="icon-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{position: 'relative'}}
              >
                🔔
                {bookings.filter(b => (b.trangThai || b.TrangThai) === 'ChoXacNhan').length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '8px',
                    height: '8px',
                    background: '#ef4444',
                    borderRadius: '50%'
                  }}></span>
                )}
              </button>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: '#1A1A1B',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 1000
                }}>
                  <div style={{padding: '1rem', borderBottom: '1px solid #333'}}>
                    <h3 style={{color: '#D4AF37', margin: 0, fontSize: '1rem'}}>Thông báo</h3>
                  </div>
                  <div style={{padding: '0.5rem'}}>
                    {bookings.slice(0, 5).map((booking, idx) => {
                      const status = booking.trangThai || booking.TrangThai;
                      const statusMap: Record<string, string> = {
                        'ChoXacNhan': '⏳ Đang chờ xác nhận',
                        'DaXacNhan': '✅ Đã xác nhận',
                        'HoanThanh': '🎉 Hoàn thành',
                        'DaHuy': '❌ Đã hủy'
                      };
                      const statusText = statusMap[status] || status;
                      
                      return (
                        <div key={idx} style={{
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                          background: '#242426',
                          borderRadius: '6px',
                          borderLeft: '3px solid #D4AF37'
                        }}>
                          <p style={{color: '#fff', fontSize: '0.9rem', margin: '0 0 0.25rem 0'}}>
                            {statusText}
                          </p>
                          <p style={{color: '#999', fontSize: '0.8rem', margin: 0}}>
                            Mã: {booking.maDatLich || booking.MaDatLich} - {new Date(booking.thoiGianHen || booking.ThoiGianHen).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      );
                    })}
                    {bookings.length === 0 && (
                      <p style={{color: '#999', textAlign: 'center', padding: '2rem'}}>
                        Chưa có thông báo nào
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Help */}
            <button className="icon-btn" onClick={() => setShowHelpModal(true)}>❓</button>
            
            {/* User Menu */}
            <div style={{position: 'relative'}} ref={userMenuRef}>
              <div 
                className="user-avatar-header" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{cursor: 'pointer'}}
              >
                {currentUser?.hoTen?.charAt(0) || 'U'}
              </div>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '220px',
                  background: '#1A1A1B',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 1000
                }}>
                  <div style={{padding: '1rem', borderBottom: '1px solid #333'}}>
                    <p style={{color: '#fff', fontWeight: 600, margin: '0 0 0.25rem 0'}}>
                      {currentUser?.hoTen || 'Khách hàng'}
                    </p>
                    <p style={{color: '#999', fontSize: '0.85rem', margin: 0}}>
                      {currentUser?.email || currentUser?.soDienThoai}
                    </p>
                  </div>
                  <div style={{padding: '0.5rem'}}>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#242426'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      👤 Thông tin cá nhân
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/';
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#242426'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                      {(showAllServices ? services : services.slice(0, 6))
                        .filter((service) => {
                          if (!searchQuery) return true;
                          const tenDV = (service.tenDichVu || service.TenDichVu || '').toLowerCase();
                          const moTa = (service.moTa || service.MoTa || '').toLowerCase();
                          const query = searchQuery.toLowerCase();
                          return tenDV.includes(query) || moTa.includes(query);
                        })
                        .map((service) => (
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
                    {services.length > 6 && (
                      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button 
                          onClick={() => setShowAllServices(!showAllServices)}
                          style={{
                            padding: '0.75rem 2rem',
                            background: 'transparent',
                            border: '2px solid #D4AF37',
                            borderRadius: '8px',
                            color: '#D4AF37',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#D4AF37';
                            e.currentTarget.style.color = '#000';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#D4AF37';
                          }}
                        >
                          {showAllServices ? '← Thu gọn' : 'Xem thêm dịch vụ →'}
                        </button>
                      </div>
                    )}
                  </section>

                  {/* Section 2: Branch Selection */}
                  <section className="booking-section">
                    <h2 className="section-title">2. CHỌN CHI NHÁNH</h2>
                    <div className="barber-scroll">
                      {branches.map((branch) => (
                        <div
                          key={branch.maChiNhanh || branch.MaChiNhanh}
                          className={`barber-item ${selectedBranch === (branch.maChiNhanh || branch.MaChiNhanh) ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedBranch(branch.maChiNhanh || branch.MaChiNhanh);
                            setSelectedBarber(''); // Reset barber khi đổi chi nhánh
                          }}
                        >
                          <div className="barber-frame">
                            <div className="barber-avatar">🏢</div>
                          </div>
                          <h4 className="barber-name">{branch.tenChiNhanh || branch.TenChiNhanh}</h4>
                          <p className="barber-role">{branch.tinhThanh || branch.TinhThanh}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Section 3: Barber Selection */}
                  <section className="booking-section">
                    <h2 className="section-title">3. CHỌN BARBER</h2>
                    {!selectedBranch ? (
                      <p style={{color: '#999', textAlign: 'center', padding: '2rem'}}>
                        Vui lòng chọn chi nhánh trước
                      </p>
                    ) : (
                      <div className="barber-scroll">
                        {staff
                          .filter((member) => {
                            const chucVu = (member.chucVu || member.ChucVu || '').toLowerCase();
                            const maChiNhanh = member.maChiNhanh || member.MaChiNhanh;
                            return (chucVu.includes('thợ') || chucVu.includes('barber') || chucVu.includes('stylist')) 
                                   && maChiNhanh === selectedBranch;
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
                    )}
                  </section>

                  {/* Section 4: Time Selection */}
                  <section className="booking-section">
                    <h2 className="section-title">4. THỜI GIAN</h2>
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
                          <span className="summary-icon">🏢</span>
                          <span>{selectedBranchData?.tenChiNhanh || selectedBranchData?.TenChiNhanh || 'Chưa chọn chi nhánh'}</span>
                        </div>
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
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>
                          {searchQuery ? 'Không tìm thấy hóa đơn nào' : 'Chưa có hóa đơn nào'}
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map(invoice => {
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
                    <div className="stat-value">{rewardsHistory.length}</div>
                    <div className="stat-label">Lần đổi thưởng</div>
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

              {/* Sub-tabs: Đổi thưởng / Lịch sử */}
              <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem'}}>
                <button
                  onClick={() => setRewardsTab('redeem')}
                  style={{
                    padding:'0.7rem 1.5rem',borderRadius:'8px',border:'none',fontWeight:600,fontSize:'0.9rem',cursor:'pointer',
                    background: rewardsTab === 'redeem' ? 'linear-gradient(135deg,#D4AF37,#c49b2f)' : '#242426',
                    color: rewardsTab === 'redeem' ? '#000' : '#a1a1aa',
                    transition:'all .2s'
                  }}
                >🎁 Đổi điểm lấy ưu đãi</button>
                <button
                  onClick={() => setRewardsTab('history')}
                  style={{
                    padding:'0.7rem 1.5rem',borderRadius:'8px',border:'none',fontWeight:600,fontSize:'0.9rem',cursor:'pointer',
                    background: rewardsTab === 'history' ? 'linear-gradient(135deg,#D4AF37,#c49b2f)' : '#242426',
                    color: rewardsTab === 'history' ? '#000' : '#a1a1aa',
                    transition:'all .2s'
                  }}
                >📋 Lịch sử đổi thưởng {rewardsHistory.length > 0 && <span style={{
                  background: rewardsTab === 'history' ? '#00000030' : '#D4AF3730',
                  color: rewardsTab === 'history' ? '#000' : '#D4AF37',
                  padding:'0.1rem 0.4rem',borderRadius:'10px',fontSize:'0.75rem',marginLeft:'0.3rem'
                }}>{rewardsHistory.length}</span>}</button>
              </div>

              {/* Đổi thưởng */}
              {rewardsTab === 'redeem' && (
                <div style={{background:'#242426',borderRadius:'12px',padding:'1.5rem',border:'1px solid #3f3f46'}}>
                  <h3 style={{color:'#D4AF37',marginBottom:'0.5rem'}}>🎁 Đổi điểm lấy ưu đãi</h3>
                  <p style={{color:'#71717a',fontSize:'0.85rem',marginBottom:'1rem'}}>Đổi điểm tích lũy để nhận mã giảm giá. Mã giảm giá có hiệu lực 3 tháng, nhập vào khi thanh toán hóa đơn để được giảm giá.</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'1rem'}}>
                    {[
                      {name:'Giảm 10% hóa đơn',points:50,icon:'🏷️',desc:'Giảm 10%, tối đa 50.000đ',type:'giam10'},
                      {name:'Giảm 20% hóa đơn',points:100,icon:'🎫',desc:'Giảm 20%, tối đa 100.000đ',type:'giam20'},
                      {name:'Miễn phí gội đầu',points:30,icon:'💆',desc:'Giảm trực tiếp 50.000đ',type:'goiDau'},
                      {name:'Miễn phí cắt tóc',points:200,icon:'✂️',desc:'Giảm trực tiếp 150.000đ',type:'catToc'},
                      {name:'Combo VIP',points:500,icon:'👑',desc:'Giảm trực tiếp 350.000đ',type:'comboVIP'},
                      {name:'Voucher 100K',points:150,icon:'💰',desc:'Giảm trực tiếp 100.000đ',type:'voucher100k'},
                    ].map(reward => (
                      <div key={reward.name} style={{background:'#18181b',borderRadius:'10px',padding:'1rem',border:'1px solid #3f3f46',display:'flex',flexDirection:'column',gap:'0.5rem',transition:'all .2s',position:'relative',overflow:'hidden'}}>
                        {(currentUser.diemTichLuy || 0) >= reward.points && (
                          <div style={{position:'absolute',top:0,right:0,background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',fontSize:'0.6rem',fontWeight:700,padding:'0.15rem 0.5rem',borderBottomLeftRadius:'8px'}}>ĐỦ ĐIỂM</div>
                        )}
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontSize:'1.5rem'}}>{reward.icon}</span>
                          <span style={{background:'#D4AF3720',color:'#D4AF37',padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:700}}>{reward.points} điểm</span>
                        </div>
                        <h4 style={{color:'white',margin:0,fontSize:'0.95rem'}}>{reward.name}</h4>
                        <p style={{color:'#71717a',fontSize:'0.8rem',margin:0}}>{reward.desc}</p>
                        <p style={{color:'#52525b',fontSize:'0.7rem',margin:0,fontStyle:'italic'}}>Hiệu lực: 3 tháng từ ngày đổi</p>
                        <button 
                          disabled={(currentUser.diemTichLuy || 0) < reward.points || redeemLoading}
                          onClick={() => handleRedeemReward(reward)}
                          style={{marginTop:'auto',padding:'0.5rem',borderRadius:'6px',border:'none',fontWeight:600,fontSize:'0.85rem',cursor:(currentUser.diemTichLuy||0)>=reward.points && !redeemLoading?'pointer':'not-allowed',
                            background:(currentUser.diemTichLuy||0)>=reward.points?'linear-gradient(135deg,#D4AF37,#c49b2f)':'#3f3f46',
                            color:(currentUser.diemTichLuy||0)>=reward.points?'#000':'#71717a',
                            transition:'all .2s',
                            opacity: redeemLoading ? 0.6 : 1
                          }}
                        >{redeemLoading ? '⏳ Đang xử lý...' : (currentUser.diemTichLuy||0)>=reward.points?'🎁 Đổi ngay':'🔒 Chưa đủ điểm'}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lịch sử đổi thưởng */}
              {rewardsTab === 'history' && (
                <div style={{background:'#242426',borderRadius:'12px',padding:'1.5rem',border:'1px solid #3f3f46'}}>
                  <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>📋 Lịch sử đổi thưởng</h3>
                  {rewardsHistory.length === 0 ? (
                    <div style={{textAlign:'center',padding:'3rem'}}>
                      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>📭</div>
                      <p style={{color:'#a1a1aa',fontSize:'1rem'}}>Bạn chưa đổi thưởng lần nào.</p>
                      <p style={{color:'#71717a',fontSize:'0.85rem'}}>Hãy tích lũy điểm và đổi lấy ưu đãi hấp dẫn!</p>
                      <button
                        onClick={() => setRewardsTab('redeem')}
                        style={{marginTop:'1rem',padding:'0.6rem 1.5rem',borderRadius:'8px',border:'none',background:'linear-gradient(135deg,#D4AF37,#c49b2f)',color:'#000',fontWeight:600,cursor:'pointer',fontSize:'0.9rem'}}
                      >🎁 Đổi thưởng ngay</button>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Mã đổi thưởng</th>
                            <th>Ưu đãi</th>
                            <th>Mã giảm giá</th>
                            <th>Điểm đã dùng</th>
                            <th>Ngày đổi</th>
                            <th>Hết hạn</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rewardsHistory.map((item: any) => {
                            const maDoiThuong = item.maDoiThuong || item.MaDoiThuong;
                            const tenKM = item.tenKhuyenMai || item.TenKhuyenMai || '';
                            const maCode = item.maCode || item.MaCode || '';
                            const diemDaDoi = item.diemDaDoi || item.DiemDaDoi || 0;
                            const ngayDoi = item.ngayDoiThuong || item.NgayDoiThuong;
                            const ngayHetHan = item.ngayHetHan || item.NgayHetHan;
                            const trangThai = item.trangThai || item.TrangThai || 'ChuaSuDung';
                            const giaTriGiam = item.giaTriGiam || item.GiaTriGiam;
                            const loaiGiam = item.loaiGiam || item.LoaiGiam;

                            const statusMap: Record<string, {text: string, color: string, bg: string}> = {
                              'ChuaSuDung': {text: '🟡 Chưa dùng', color: '#f59e0b', bg: '#f59e0b15'},
                              'DaSuDung': {text: '✅ Đã sử dụng', color: '#22c55e', bg: '#22c55e15'},
                              'HetHan': {text: '❌ Hết hạn', color: '#ef4444', bg: '#ef444415'}
                            };
                            const statusInfo = statusMap[trangThai] || statusMap['ChuaSuDung'];

                            return (
                              <tr key={maDoiThuong}>
                                <td style={{fontSize:'0.8rem',color:'#a1a1aa'}}>{maDoiThuong}</td>
                                <td>
                                  <div style={{fontSize:'0.85rem',color:'#fff',fontWeight:500}}>{tenKM}</div>
                                  <div style={{fontSize:'0.75rem',color:'#D4AF37',marginTop:'0.15rem'}}>
                                    {loaiGiam === 'PhanTram' ? `Giảm ${giaTriGiam}%` : `Giảm ${giaTriGiam?.toLocaleString()}đ`}
                                  </div>
                                </td>
                                <td>
                                  <div style={{
                                    display:'inline-flex',alignItems:'center',gap:'0.3rem',
                                    background: trangThai === 'ChuaSuDung' ? '#D4AF3715' : '#3f3f4640',
                                    border: `1px solid ${trangThai === 'ChuaSuDung' ? '#D4AF3740' : '#3f3f46'}`,
                                    borderRadius:'6px',padding:'0.25rem 0.5rem',
                                    fontFamily:'monospace',fontSize:'0.8rem',
                                    color: trangThai === 'ChuaSuDung' ? '#D4AF37' : '#71717a',
                                    fontWeight:700,letterSpacing:'0.5px'
                                  }}>
                                    🏷️ {maCode}
                                  </div>
                                  {trangThai === 'ChuaSuDung' && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(maCode);
                                        alert(`Đã sao chép mã: ${maCode}`);
                                      }}
                                      style={{
                                        marginLeft:'0.3rem',padding:'0.15rem 0.4rem',borderRadius:'4px',
                                        border:'1px solid #3f3f46',background:'#18181b',color:'#a1a1aa',
                                        fontSize:'0.7rem',cursor:'pointer',verticalAlign:'middle'
                                      }}
                                      title="Sao chép mã"
                                    >📋</button>
                                  )}
                                </td>
                                <td>
                                  <span style={{background:'#ef444415',color:'#ef4444',padding:'0.15rem 0.5rem',borderRadius:'10px',fontSize:'0.8rem',fontWeight:600}}>-{diemDaDoi} điểm</span>
                                </td>
                                <td style={{fontSize:'0.8rem',color:'#a1a1aa'}}>{ngayDoi ? new Date(ngayDoi).toLocaleDateString('vi-VN') : '-'}</td>
                                <td style={{fontSize:'0.8rem',color:'#a1a1aa'}}>{ngayHetHan ? new Date(ngayHetHan).toLocaleDateString('vi-VN') : '-'}</td>
                                <td>
                                  <span style={{background: statusInfo.bg, color: statusInfo.color, padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600,whiteSpace:'nowrap'}}>
                                    {statusInfo.text}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
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

                {/* Profile Details - View/Edit Mode */}
                {!isEditingProfile ? (
                  <>
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
                        <span className="detail-value">{currentUser.ngaySinh ? new Date(currentUser.ngaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Giới tính:</span>
                        <span className="detail-value">{currentUser.gioiTinh}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem', padding: '0 1.5rem'}}>
                      <button
                        onClick={handleEditProfile}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #D4AF37, #c49b2f)',
                          color: '#000',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        ✏️ Chỉnh sửa thông tin
                      </button>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          border: '1px solid #D4AF37',
                          background: 'transparent',
                          color: '#D4AF37',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        🔒 Đổi mật khẩu
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Edit Form */}
                    <div style={{padding: '1.5rem'}}>
                      <h3 style={{color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem'}}>✏️ Chỉnh sửa thông tin</h3>
                      
                      <div className="review-field" style={{marginBottom: '1rem'}}>
                        <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>Họ tên <span style={{color: '#ef4444'}}>*</span></label>
                        <input
                          type="text"
                          value={profileForm.hoTen}
                          onChange={(e) => setProfileForm({...profileForm, hoTen: e.target.value})}
                          placeholder="Nhập họ tên..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#18181b',
                            color: '#fff',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div className="review-field" style={{marginBottom: '1rem'}}>
                        <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          placeholder="Nhập email..."
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#18181b',
                            color: '#fff',
                            fontSize: '0.9rem'
                          }}
                        />
                      </div>

                      <div className="review-field" style={{marginBottom: '1rem'}}>
                        <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>Giới tính</label>
                        <select
                          value={profileForm.gioiTinh}
                          onChange={(e) => setProfileForm({...profileForm, gioiTinh: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#18181b',
                            color: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>

                      <div className="review-field" style={{marginBottom: '1rem'}}>
                        <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>Ngày sinh</label>
                        <input
                          type="date"
                          value={profileForm.ngaySinh}
                          onChange={(e) => setProfileForm({...profileForm, ngaySinh: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#18181b',
                            color: '#fff',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                          }}
                        />
                      </div>

                      <div style={{display: 'flex', gap: '0.75rem', marginTop: '1.5rem'}}>
                        <button
                          onClick={handleCancelEditProfile}
                          disabled={profileSaving}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #3f3f46',
                            background: '#242426',
                            color: '#a1a1aa',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: profileSaving ? 'not-allowed' : 'pointer',
                            opacity: profileSaving ? 0.5 : 1
                          }}
                        >
                          ❌ Hủy
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={profileSaving}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: profileSaving ? '#71717a' : 'linear-gradient(135deg, #D4AF37, #c49b2f)',
                            color: '#000',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: profileSaving ? 'not-allowed' : 'pointer',
                            opacity: profileSaving ? 0.6 : 1
                          }}
                        >
                          {profileSaving ? '⏳ Đang lưu...' : '✅ Lưu thay đổi'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

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

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="review-modal-overlay" onClick={handleCancelChangePassword}>
          <div className="review-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '480px'}}>
            <div className="review-modal-header">
              <h3>🔒 ĐỔI MẬT KHẨU</h3>
              <button className="review-close-btn" onClick={handleCancelChangePassword}>×</button>
            </div>
            <div className="review-modal-body">
              <p style={{color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1.5rem'}}>
                Vui lòng nhập mật khẩu cũ và mật khẩu mới. Sau khi đổi mật khẩu thành công, bạn sẽ cần đăng nhập lại.
              </p>

              <div className="review-field" style={{marginBottom: '1rem'}}>
                <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>
                  Mật khẩu cũ <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  placeholder="Nhập mật khẩu cũ..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #3f3f46',
                    background: '#18181b',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className="review-field" style={{marginBottom: '1rem'}}>
                <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>
                  Mật khẩu mới <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #3f3f46',
                    background: '#18181b',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                {passwordForm.newPassword && passwordForm.newPassword.length < 6 && (
                  <p style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem'}}>
                    ⚠️ Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                )}
              </div>

              <div className="review-field" style={{marginBottom: '1rem'}}>
                <label style={{color: '#fff', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem'}}>
                  Xác nhận mật khẩu mới <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  placeholder="Nhập lại mật khẩu mới..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #3f3f46',
                    background: '#18181b',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem'}}>
                    ⚠️ Mật khẩu xác nhận không khớp
                  </p>
                )}
              </div>

              <div style={{
                background: '#f59e0b15',
                border: '1px solid #f59e0b40',
                borderRadius: '8px',
                padding: '0.75rem',
                marginTop: '1rem'
              }}>
                <p style={{color: '#f59e0b', fontSize: '0.8rem', margin: 0, lineHeight: '1.5'}}>
                  ⚠️ <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ được đăng xuất và cần đăng nhập lại bằng mật khẩu mới.
                </p>
              </div>
            </div>
            <div className="review-modal-footer">
              <button 
                className="review-cancel-btn" 
                onClick={handleCancelChangePassword}
                disabled={passwordChanging}
                style={{opacity: passwordChanging ? 0.5 : 1}}
              >
                Hủy
              </button>
              <button 
                className="review-submit-btn" 
                onClick={handleChangePassword}
                disabled={passwordChanging}
                style={{
                  background: passwordChanging ? '#71717a' : 'linear-gradient(135deg, #D4AF37, #c49b2f)',
                  color: '#000',
                  opacity: passwordChanging ? 0.6 : 1
                }}
              >
                {passwordChanging ? '⏳ Đang xử lý...' : '🔒 Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="review-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="review-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '600px', maxHeight: '80vh', overflow: 'auto'}}>
            <div className="review-modal-header">
              <h3>❓ TRỢ GIÚP & HỖ TRỢ</h3>
              <button className="review-close-btn" onClick={() => setShowHelpModal(false)}>×</button>
            </div>
            <div className="review-modal-body">
              {/* FAQ Section */}
              <div style={{marginBottom: '1.5rem'}}>
                <h4 style={{color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem'}}>📚 Câu hỏi thường gặp</h4>
                
                <div style={{marginBottom: '1rem'}}>
                  <h5 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>🔹 Làm thế nào để đặt lịch?</h5>
                  <p style={{color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.6', marginLeft: '1.5rem'}}>
                    1. Chọn dịch vụ bạn muốn<br/>
                    2. Chọn chi nhánh gần bạn<br/>
                    3. Chọn barber yêu thích<br/>
                    4. Chọn ngày và giờ phù hợp<br/>
                    5. Xác nhận đặt lịch
                  </p>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <h5 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>🔹 Tôi có thể hủy lịch hẹn không?</h5>
                  <p style={{color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.6', marginLeft: '1.5rem'}}>
                    Bạn có thể hủy lịch hẹn bằng cách liên hệ trực tiếp với chi nhánh hoặc gọi hotline. Vui lòng hủy trước ít nhất 2 giờ để tránh phí phạt.
                  </p>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <h5 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>🔹 Làm thế nào để thanh toán?</h5>
                  <p style={{color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.6', marginLeft: '1.5rem'}}>
                    Bạn có thể thanh toán trực tiếp tại cửa hàng hoặc thanh toán online qua Momo, VNPay, chuyển khoản ngân hàng trong tab "Hóa đơn".
                  </p>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <h5 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>🔹 Điểm thưởng hoạt động như thế nào?</h5>
                  <p style={{color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.6', marginLeft: '1.5rem'}}>
                    Mỗi lần sử dụng dịch vụ, bạn sẽ tích lũy điểm. Điểm có thể đổi lấy ưu đãi, giảm giá hoặc dịch vụ miễn phí trong tab "Đổi thưởng".
                  </p>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <h5 style={{color: '#fff', marginBottom: '0.5rem', fontSize: '0.95rem'}}>🔹 Tôi quên mật khẩu, phải làm sao?</h5>
                  <p style={{color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.6', marginLeft: '1.5rem'}}>
                    Vui lòng liên hệ hotline hoặc đến trực tiếp chi nhánh để được hỗ trợ đặt lại mật khẩu.
                  </p>
                </div>
              </div>

              {/* Contact Section */}
              <div style={{background: '#18181b', borderRadius: '10px', padding: '1rem', border: '1px solid #3f3f46'}}>
                <h4 style={{color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem'}}>📞 Liên hệ hỗ trợ</h4>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
                  <span style={{fontSize: '1.5rem'}}>📱</span>
                  <div>
                    <p style={{color: '#fff', margin: 0, fontSize: '0.9rem', fontWeight: 600}}>Hotline</p>
                    <p style={{color: '#D4AF37', margin: 0, fontSize: '0.95rem'}}>1900 xxxx</p>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
                  <span style={{fontSize: '1.5rem'}}>✉️</span>
                  <div>
                    <p style={{color: '#fff', margin: 0, fontSize: '0.9rem', fontWeight: 600}}>Email</p>
                    <p style={{color: '#D4AF37', margin: 0, fontSize: '0.95rem'}}>support@groominglounge.vn</p>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem'}}>
                  <span style={{fontSize: '1.5rem'}}>💬</span>
                  <div>
                    <p style={{color: '#fff', margin: 0, fontSize: '0.9rem', fontWeight: 600}}>Facebook</p>
                    <p style={{color: '#D4AF37', margin: 0, fontSize: '0.95rem'}}>fb.com/groominglounge</p>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <span style={{fontSize: '1.5rem'}}>⏰</span>
                  <div>
                    <p style={{color: '#fff', margin: 0, fontSize: '0.9rem', fontWeight: 600}}>Giờ làm việc</p>
                    <p style={{color: '#a1a1aa', margin: 0, fontSize: '0.85rem'}}>Thứ 2 - Chủ nhật: 9:00 - 21:00</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem'}}>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    setActiveTab('booking');
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #D4AF37',
                    background: 'transparent',
                    color: '#D4AF37',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D4AF37';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                >
                  📅 Đặt lịch ngay
                </button>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    setActiveTab('history');
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #D4AF37',
                    background: 'transparent',
                    color: '#D4AF37',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D4AF37';
                    e.currentTarget.style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                >
                  📋 Xem lịch sử
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default User;
