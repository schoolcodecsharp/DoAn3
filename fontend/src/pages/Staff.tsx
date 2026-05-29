import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Staff.css';
import { nhanVienApi, datLichApi, danhGiaApi } from '../utils/api';
import StaffDashboard from '../components/StaffDashboard';

function Staff() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [completedServices, setCompletedServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({ soKhach: 0, doanhThu: '0đ', danhGiaTB: 0, soGioLam: 0, tongKhach: 0, tongDoanhThu: '0đ' });
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    hoTen: '',
    soDienThoai: '',
    email: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
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

  const handleEditClick = () => {
    setEditForm({
      hoTen: staffInfo.hoTen || '',
      soDienThoai: staffInfo.soDienThoai || '',
      email: staffInfo.email || ''
    });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditForm({ hoTen: '', soDienThoai: '', email: '' });
  };

  const handleSaveEdit = async () => {
    // Validation
    if (!editForm.hoTen.trim()) {
      alert('Vui lòng nhập họ tên!');
      return;
    }
    if (!editForm.soDienThoai.trim()) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }
    if (!/^[0-9]{10}$/.test(editForm.soDienThoai.trim())) {
      alert('Số điện thoại phải có 10 chữ số!');
      return;
    }
    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) {
      alert('Email không hợp lệ!');
      return;
    }

    setIsSaving(true);
    try {
      await nhanVienApi.update(staffInfo.maNhanVien, {
        hoTen: editForm.hoTen.trim(),
        soDienThoai: editForm.soDienThoai.trim(),
        email: editForm.email.trim(),
        maChiNhanh: staffInfo.maChiNhanh,
        gioiTinh: staffInfo.gioiTinh,
        chucVu: staffInfo.chucVu,
        luongCoBan: staffInfo.luongCoBan,
        trangThai: staffInfo.trangThai,
        ngaySinh: staffInfo.ngaySinh,
        hinhAnh: staffInfo.hinhAnh
      });
      
      // Update localStorage with new info
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        user.hoTen = editForm.hoTen.trim();
        user.soDienThoai = editForm.soDienThoai.trim();
        user.email = editForm.email.trim();
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      alert('✅ Cập nhật thông tin thành công!');
      setIsEditMode(false);
      loadData();
    } catch (err: any) {
      alert('❌ Lỗi: ' + (err.message || 'Không thể cập nhật thông tin'));
    } finally {
      setIsSaving(false);
    }
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
              {/* Header */}
              <div style={{background: '#1A1A1B', padding: '2rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '2rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                  <div>
                    <h2 style={{color: '#D4AF37', fontSize: '1.8rem', marginBottom: '0.5rem'}}>Lịch Hẹn Hôm Nay</h2>
                    <p style={{color: '#999', fontSize: '0.95rem'}}>
                      📅 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{
                    padding: '1rem 2rem',
                    background: '#242426',
                    borderRadius: '12px',
                    border: '1px solid #D4AF37'
                  }}>
                    <div style={{fontSize: '2rem', color: '#D4AF37', fontWeight: 700, textAlign: 'center'}}>
                      {appointments.length}
                    </div>
                    <p style={{color: '#999', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.25rem'}}>Lịch hẹn</p>
                  </div>
                </div>
              </div>
              
              {/* Appointments List */}
              <div className="appointments-list">
                {appointments.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '4rem', background: '#1A1A1B', borderRadius: '12px', border: '1px solid #333'}}>
                    <div style={{fontSize: '4rem', marginBottom: '1rem', opacity: 0.3}}>📅</div>
                    <p style={{color: '#999', fontSize: '1.1rem'}}>Không có lịch hẹn nào hôm nay</p>
                    <p style={{color: '#666', fontSize: '0.9rem', marginTop: '0.5rem'}}>Hãy nghỉ ngơi và chuẩn bị cho ngày mai!</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '1.5rem'}}>
                    {appointments.map((apt) => {
                      const statusColors: Record<string, {bg: string; border: string; text: string}> = {
                        'ChoXacNhan': {bg: '#fbbf2420', border: '#fbbf24', text: '#fbbf24'},
                        'DaXacNhan': {bg: '#60a5fa20', border: '#60a5fa', text: '#60a5fa'},
                        'DangPhucVu': {bg: '#a78bfa20', border: '#a78bfa', text: '#a78bfa'},
                        'HoanThanh': {bg: '#22c55e20', border: '#22c55e', text: '#22c55e'},
                        'DaHuy': {bg: '#f8717120', border: '#f87171', text: '#f87171'}
                      };
                      const statusStyle = statusColors[apt.trangThai] || statusColors['ChoXacNhan'];
                      
                      return (
                        <div key={apt.maDatLich} style={{
                          background: '#1A1A1B',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '1px solid #333',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#D4AF37';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#333';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          {/* Header */}
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #D4AF37, #f59e0b)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                fontWeight: 700,
                                color: '#000'
                              }}>
                                {(apt.tenKhachHang || 'K').charAt(0)}
                              </div>
                              <div>
                                <h3 style={{color: '#fff', fontSize: '1.2rem', marginBottom: '0.25rem', fontWeight: 600}}>
                                  {apt.tenKhachHang || 'Khách hàng'}
                                </h3>
                                <p style={{color: '#999', fontSize: '0.85rem'}}>
                                  📋 {apt.maDatLich} • 📞 {apt.soDienThoai}
                                </p>
                              </div>
                            </div>
                            <div style={{
                              padding: '0.5rem 1rem',
                              background: statusStyle.bg,
                              borderRadius: '20px',
                              border: `1px solid ${statusStyle.border}`
                            }}>
                              <span style={{color: statusStyle.text, fontSize: '0.9rem', fontWeight: 600}}>
                                {getStatusText(apt.trangThai)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: '#242426',
                            borderRadius: '8px'
                          }}>
                            <div>
                              <p style={{color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem'}}>⏰ Thời gian</p>
                              <p style={{color: '#fff', fontSize: '0.95rem', fontWeight: 600}}>
                                {new Date(apt.thoiGianHen).toLocaleString('vi-VN')}
                              </p>
                            </div>
                            <div>
                              <p style={{color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem'}}>✂️ Dịch vụ</p>
                              <p style={{color: '#fff', fontSize: '0.95rem', fontWeight: 600}}>
                                {apt.ghiChu || 'Dịch vụ cắt tóc'}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                            {apt.trangThai === 'DaXacNhan' && (
                              <button 
                                onClick={() => handleUpdateStatus(apt.maDatLich, 'DangPhucVu')}
                                style={{
                                  flex: 1,
                                  padding: '0.75rem 1.5rem',
                                  background: '#D4AF37',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '0.95rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#c49b2f'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#D4AF37'}
                              >
                                ✂️ Bắt đầu phục vụ
                              </button>
                            )}
                            {apt.trangThai === 'DangPhucVu' && (
                              <>
                                <div style={{
                                  flex: 1,
                                  padding: '0.75rem 1.5rem',
                                  background: '#a78bfa20',
                                  border: '1px solid #a78bfa',
                                  borderRadius: '8px',
                                  color: '#a78bfa',
                                  fontSize: '0.95rem',
                                  fontWeight: 600,
                                  textAlign: 'center'
                                }}>
                                  🔄 Đang phục vụ khách...
                                </div>
                                <button 
                                  onClick={() => handleUpdateStatus(apt.maDatLich, 'HoanThanh')}
                                  style={{
                                    flex: 1,
                                    padding: '0.75rem 1.5rem',
                                    background: '#22c55e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#16a34a'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = '#22c55e'}
                                >
                                  ✅ Hoàn thành
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  }
                  </div>
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
              {/* Header with overall rating */}
              <div style={{background: '#1A1A1B', padding: '2rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '2rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem'}}>
                  <div>
                    <h2 style={{color: '#D4AF37', fontSize: '1.8rem', marginBottom: '0.5rem'}}>Đánh Giá Từ Khách Hàng</h2>
                    <p style={{color: '#999', fontSize: '0.95rem'}}>Tổng cộng {reviews.length} đánh giá từ khách hàng</p>
                  </div>
                  <div style={{textAlign: 'center', padding: '1.5rem', background: '#242426', borderRadius: '12px', minWidth: '200px'}}>
                    <div style={{fontSize: '3rem', color: '#D4AF37', fontWeight: 700, marginBottom: '0.5rem'}}>
                      {monthlyStats.danhGiaTB}
                    </div>
                    <div style={{color: '#fbbf24', fontSize: '1.5rem', marginBottom: '0.5rem'}}>
                      {'⭐'.repeat(Math.round(monthlyStats.danhGiaTB))}
                    </div>
                    <p style={{color: '#999', fontSize: '0.9rem'}}>Đánh giá trung bình</p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '4rem', background: '#1A1A1B', borderRadius: '12px', border: '1px solid #333'}}>
                    <div style={{fontSize: '4rem', marginBottom: '1rem', opacity: 0.3}}>⭐</div>
                    <p style={{color: '#999', fontSize: '1.1rem'}}>Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '1.5rem'}}>
                    {reviews.map((review, index) => (
                      <div key={index} style={{
                        background: '#1A1A1B',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}>
                        {/* Review Header */}
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #D4AF37, #f59e0b)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: '#000'
                            }}>
                              {review.khachHang.charAt(0)}
                            </div>
                            <div>
                              <h4 style={{color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 600}}>
                                {review.khachHang}
                              </h4>
                              <span style={{color: '#999', fontSize: '0.85rem'}}>
                                📅 {review.thoiGian}
                              </span>
                            </div>
                          </div>
                          <div style={{
                            padding: '0.5rem 1rem',
                            background: '#fbbf2420',
                            borderRadius: '20px',
                            border: '1px solid #fbbf24'
                          }}>
                            <span style={{color: '#fbbf24', fontSize: '1.2rem', fontWeight: 700}}>
                              {'⭐'.repeat(review.sao)}
                            </span>
                          </div>
                        </div>

                        {/* Review Scores */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
                          marginBottom: '1rem',
                          padding: '1rem',
                          background: '#242426',
                          borderRadius: '8px'
                        }}>
                          <div style={{textAlign: 'center'}}>
                            <p style={{color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Dịch vụ</p>
                            <div style={{color: '#60a5fa', fontSize: '1.2rem'}}>
                              {'★'.repeat(review.saoDichVu)}{'☆'.repeat(5 - review.saoDichVu)}
                            </div>
                          </div>
                          <div style={{textAlign: 'center'}}>
                            <p style={{color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Nhân viên</p>
                            <div style={{color: '#D4AF37', fontSize: '1.2rem'}}>
                              {'★'.repeat(review.sao)}{'☆'.repeat(5 - review.sao)}
                            </div>
                          </div>
                          <div style={{textAlign: 'center'}}>
                            <p style={{color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem'}}>Cửa hàng</p>
                            <div style={{color: '#22c55e', fontSize: '1.2rem'}}>
                              {'★'.repeat(review.saoCuaHang)}{'☆'.repeat(5 - review.saoCuaHang)}
                            </div>
                          </div>
                        </div>

                        {/* Review Text */}
                        {review.nhanXet && (
                          <div style={{
                            padding: '1rem',
                            background: '#18181b',
                            borderLeft: '3px solid #D4AF37',
                            borderRadius: '6px'
                          }}>
                            <p style={{color: '#e5e5e5', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic'}}>
                              "{review.nhanXet}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <StaffDashboard
              monthlyStats={monthlyStats}
              completedServices={completedServices}
              reviews={reviews}
              appointments={appointments}
            />
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              {/* Header */}
              <div style={{marginBottom: '2rem'}}>
                <h2 style={{color: '#D4AF37', fontSize: '1.8rem', marginBottom: '0.5rem'}}>Thông Tin Cá Nhân</h2>
                <p style={{color: '#999', fontSize: '0.95rem'}}>
                  {isEditMode ? 'Chỉnh sửa thông tin tài khoản của bạn' : 'Quản lý thông tin tài khoản của bạn'}
                </p>
              </div>

              {/* Profile Card */}
              <div style={{background: '#1A1A1B', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden'}}>
                {/* Avatar Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  borderBottom: '1px solid #333'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: '#000',
                    margin: '0 auto 1.5rem',
                    border: '4px solid #242426',
                    boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)'
                  }}>
                    {(isEditMode ? editForm.hoTen : staffInfo.hoTen || 'S').charAt(0)}
                  </div>
                  <h3 style={{color: '#fff', fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 700}}>
                    {isEditMode ? editForm.hoTen : staffInfo.hoTen || 'Nhân viên'}
                  </h3>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: '#D4AF3720',
                    borderRadius: '20px',
                    border: '1px solid #D4AF37'
                  }}>
                    <span style={{color: '#D4AF37', fontSize: '0.95rem', fontWeight: 600}}>
                      {staffInfo.chucVu || 'Stylist'}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div style={{padding: '2rem'}}>
                  <div style={{display: 'grid', gap: '1.5rem'}}>
                    {/* Info Row */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      <div style={{
                        padding: '1.5rem',
                        background: '#242426',
                        borderRadius: '10px',
                        border: '1px solid #333'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#60a5fa20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            🆔
                          </div>
                          <p style={{color: '#999', fontSize: '0.85rem'}}>Mã nhân viên</p>
                        </div>
                        <p style={{color: '#fff', fontSize: '1.1rem', fontWeight: 600, paddingLeft: '3rem'}}>
                          {staffInfo.maNhanVien}
                        </p>
                      </div>

                      <div style={{
                        padding: '1.5rem',
                        background: '#242426',
                        borderRadius: '10px',
                        border: '1px solid #333'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#22c55e20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            🏢
                          </div>
                          <p style={{color: '#999', fontSize: '0.85rem'}}>Chi nhánh</p>
                        </div>
                        <p style={{color: '#fff', fontSize: '1.1rem', fontWeight: 600, paddingLeft: '3rem'}}>
                          {staffInfo.tenChiNhanh || staffInfo.maChiNhanh}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1.5rem'
                    }}>
                      {/* Editable Fields */}
                      <div style={{
                        padding: '1.5rem',
                        background: '#242426',
                        borderRadius: '10px',
                        border: isEditMode ? '1px solid #D4AF37' : '1px solid #333'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#a78bfa20',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            📞
                          </div>
                          <p style={{color: '#999', fontSize: '0.85rem'}}>Số điện thoại</p>
                        </div>
                        {isEditMode ? (
                          <input
                            type="tel"
                            value={editForm.soDienThoai}
                            onChange={(e) => setEditForm({...editForm, soDienThoai: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              background: '#18181b',
                              border: '1px solid #444',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '1rem',
                              marginLeft: '3rem',
                              maxWidth: 'calc(100% - 3rem)'
                            }}
                          />
                        ) : (
                          <p style={{color: '#fff', fontSize: '1.1rem', fontWeight: 600, paddingLeft: '3rem'}}>
                            {staffInfo.soDienThoai}
                          </p>
                        )}
                      </div>

                      <div style={{
                        padding: '1.5rem',
                        background: '#242426',
                        borderRadius: '10px',
                        border: isEditMode ? '1px solid #D4AF37' : '1px solid #333'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#fbbf2420',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            ✉️
                          </div>
                          <p style={{color: '#999', fontSize: '0.85rem'}}>Email</p>
                        </div>
                        {isEditMode ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              background: '#18181b',
                              border: '1px solid #444',
                              borderRadius: '6px',
                              color: '#fff',
                              fontSize: '1rem',
                              marginLeft: '3rem',
                              maxWidth: 'calc(100% - 3rem)'
                            }}
                          />
                        ) : (
                          <p style={{color: '#fff', fontSize: '1.1rem', fontWeight: 600, paddingLeft: '3rem'}}>
                            {staffInfo.email || 'Chưa cập nhật'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Họ tên - Full width when editing */}
                    {isEditMode && (
                      <div style={{
                        padding: '1.5rem',
                        background: '#242426',
                        borderRadius: '10px',
                        border: '1px solid #D4AF37'
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem'}}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#D4AF3720',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem'
                          }}>
                            👤
                          </div>
                          <p style={{color: '#999', fontSize: '0.85rem'}}>Họ và tên</p>
                        </div>
                        <input
                          type="text"
                          value={editForm.hoTen}
                          onChange={(e) => setEditForm({...editForm, hoTen: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: '#18181b',
                            border: '1px solid #444',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '1rem',
                            marginLeft: '3rem',
                            maxWidth: 'calc(100% - 3rem)'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{marginTop: '2rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    {isEditMode ? (
                      <>
                        <button 
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          style={{
                            padding: '1rem 3rem',
                            background: 'transparent',
                            color: isSaving ? '#666' : '#999',
                            border: '1px solid #444',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            opacity: isSaving ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isSaving) {
                              e.currentTarget.style.borderColor = '#666';
                              e.currentTarget.style.color = '#fff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSaving) {
                              e.currentTarget.style.borderColor = '#444';
                              e.currentTarget.style.color = '#999';
                            }
                          }}>
                          ❌ Hủy
                        </button>
                        <button 
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          style={{
                            padding: '1rem 3rem',
                            background: isSaving ? '#666' : '#22c55e',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                            opacity: isSaving ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isSaving) {
                              e.currentTarget.style.background = '#16a34a';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSaving) {
                              e.currentTarget.style.background = '#22c55e';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                            }
                          }}>
                          {isSaving ? '⏳ Đang lưu...' : '✅ Lưu thay đổi'}
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={handleEditClick}
                        style={{
                          padding: '1rem 3rem',
                          background: '#D4AF37',
                          color: '#000',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#c49b2f';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#D4AF37';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                        }}>
                        ✏️ Chỉnh sửa thông tin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Staff;
