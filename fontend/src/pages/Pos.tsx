import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Pos.css';
import { datLichApi, dichVuApi, chiNhanhApi, nhanVienApi, hoaDonApi, khachHangApi, khuyenMaiApi } from '../utils/api';

function Pos() {
  const [activeTab, setActiveTab] = useState('today');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  // Đặt lịch tại quầy
  const [bookPhone, setBookPhone] = useState('');
  const [bookService, setBookService] = useState('');
  const [bookStaff, setBookStaff] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);

  // Tạo hóa đơn
  const [invoicePhone, setInvoicePhone] = useState('');
  const [invoiceCustomer, setInvoiceCustomer] = useState<any>(null);
  const [invoiceServices, setInvoiceServices] = useState<any[]>([]);
  const [invoicePromo, setInvoicePromo] = useState('');
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [payMethod, setPayMethod] = useState('TienMat');
  const [invoiceDatLich, setInvoiceDatLich] = useState('');

  // Tra cứu KH
  const [searchPhone, setSearchPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [customerBookings, setCustomerBookings] = useState<any[]>([]);

  const [currentUser] = useState<any>(() => {
    const s = localStorage.getItem('currentUser');
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [sv, br, st] = await Promise.all([
        dichVuApi.getAll(), chiNhanhApi.getAll(), nhanVienApi.getAll()
      ]);
      setServices(sv); setBranches(br); setStaff(st);
      // Lịch hẹn hôm nay
      const allApts = await datLichApi.getAll({});
      const today = new Date().toISOString().split('T')[0];
      setAppointments(allApts.filter((a: any) => {
        const d = new Date(a.thoiGianHen).toISOString().split('T')[0];
        return d === today;
      }));
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await datLichApi.updateStatus(id, status);
      alert('Cập nhật thành công!');
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  // Đặt lịch tại quầy
  const handleBookAtCounter = async () => {
    if (!bookPhone || !bookService || !bookStaff || !bookTime) {
      alert('Vui lòng nhập đầy đủ thông tin!'); return;
    }
    try {
      const maDL = 'DL' + Date.now().toString().slice(-8);
      const maCN = currentUser?.maChiNhanh || branches[0]?.maChiNhanh || 'CN001';
      await datLichApi.create({
        maDatLich: maDL, soDienThoai: bookPhone, maChiNhanh: maCN,
        maNhanVien: bookStaff, thoiGianHen: `${bookDate}T${bookTime}:00`,
        nguonDatLich: 'TaiQuay'
      });
      alert('Đặt lịch tại quầy thành công!');
      setBookPhone(''); setBookService(''); setBookStaff(''); setBookTime('');
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  // Tra cứu khách hàng
  const handleSearchCustomer = async () => {
    if (!searchPhone.trim()) return;
    try {
      const cus = await khachHangApi.getById(searchPhone);
      setFoundCustomer(cus);
      const bk = await datLichApi.getAll({ khachHang: searchPhone });
      setCustomerBookings(bk);
    } catch { setFoundCustomer(null); setCustomerBookings([]); alert('Không tìm thấy khách hàng!'); }
  };

  // Tra cứu KH cho hóa đơn
  const handleLookupInvoiceCustomer = async () => {
    if (!invoicePhone.trim()) return;
    try {
      const cus = await khachHangApi.getById(invoicePhone);
      setInvoiceCustomer(cus);
    } catch { setInvoiceCustomer(null); alert('Không tìm thấy khách hàng!'); }
  };

  const addInvoiceService = (sv: any) => {
    const exists = invoiceServices.find(s => s.maDichVu === sv.maDichVu);
    if (exists) {
      setInvoiceServices(invoiceServices.map(s => s.maDichVu === sv.maDichVu ? { ...s, soLuong: s.soLuong + 1 } : s));
    } else {
      setInvoiceServices([...invoiceServices, { ...sv, soLuong: 1 }]);
    }
  };

  const removeInvoiceService = (id: string) => {
    setInvoiceServices(invoiceServices.filter(s => s.maDichVu !== id));
  };

  const subtotal = invoiceServices.reduce((s, sv) => s + (sv.giaSauGiam || sv.gia) * sv.soLuong, 0);
  const earnedPoints = invoiceServices.reduce((s, sv) => s + (sv.diemThuong || 0) * sv.soLuong, 0);

  const applyPromoCode = async () => {
    setPromoError(''); setPromoApplied(null);
    if (!invoicePromo.trim()) return;
    try {
      const promos = await khuyenMaiApi.getAll(invoicePromo);
      const found = (Array.isArray(promos) ? promos : []).find(
        (p: any) => (p.maCode)?.toUpperCase() === invoicePromo.toUpperCase()
      );
      if (!found) { setPromoError('Mã không tồn tại'); return; }
      if (!found.trangThai) { setPromoError('Mã đã hết hạn'); return; }
      const now = new Date();
      if (found.ngayBatDau && new Date(found.ngayBatDau) > now) { setPromoError('Mã chưa đến ngày sử dụng'); return; }
      if (found.ngayKetThuc && new Date(found.ngayKetThuc) < now) { setPromoError('Mã đã hết hạn sử dụng'); return; }
      if (found.soLanDung >= found.soLanToiDa) { setPromoError('Mã đã hết lượt sử dụng'); return; }
      if (found.donHangToiThieu && subtotal < found.donHangToiThieu) { setPromoError(`Đơn tối thiểu ${found.donHangToiThieu.toLocaleString()}đ`); return; }
      setPromoApplied(found);
    } catch { setPromoError('Lỗi kiểm tra mã'); }
  };

  const discountAmt = promoApplied
    ? promoApplied.loaiGiam === 'PhanTram'
      ? Math.min(subtotal * promoApplied.giaTriGiam / 100, promoApplied.giaTriToiDa || Infinity)
      : promoApplied.giaTriGiam
    : 0;
  const totalPay = Math.max(0, subtotal - discountAmt);

  const handleCreateInvoice = async () => {
    if (!invoiceCustomer) { alert('Vui lòng tra cứu khách hàng trước!'); return; }
    if (invoiceServices.length === 0) { alert('Vui lòng chọn dịch vụ!'); return; }
    try {
      const maHD = 'HD' + Date.now().toString().slice(-8);
      const maCN = currentUser?.maChiNhanh || branches[0]?.maChiNhanh || 'CN001';
      await hoaDonApi.create({
        maHoaDon: maHD,
        soDienThoai: invoiceCustomer.soDienThoai,
        maDatLich: invoiceDatLich || null,
        maChiNhanh: maCN,
        maCode: promoApplied?.maCode || null,
        tongTien: subtotal, giamGia: discountAmt, thanhTien: totalPay,
        diemDuocCong: earnedPoints, diemDaDung: 0,
        phuongThucTT: payMethod, ghiChu: invoiceNote || null,
      });
      alert(`Tạo hóa đơn ${maHD} thành công! Thanh toán: ${totalPay.toLocaleString()}đ`);
      setInvoiceServices([]); setInvoiceCustomer(null); setInvoicePhone('');
      setPromoApplied(null); setInvoicePromo(''); setInvoiceDatLich('');
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  const getStatusText = (s: string) => {
    const m: Record<string,string> = { ChoXacNhan:'Chờ xác nhận', DaXacNhan:'Đã xác nhận', DangPhucVu:'Đang phục vụ', HoanThanh:'Hoàn thành', DaHuy:'Đã hủy' };
    return m[s] || s;
  };
  const getStatusColor = (s: string) => {
    const m: Record<string,string> = { ChoXacNhan:'#fbbf24', DaXacNhan:'#60a5fa', DangPhucVu:'#a78bfa', HoanThanh:'#22c55e', DaHuy:'#f87171' };
    return m[s] || '#a1a1aa';
  };
  const hangTV = (h: number) => ['Thường','Bạc','Vàng','Kim cương'][h] || 'Thường';

  const timeSlots = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  return (
    <div className="pos-container">
      <header className="pos-header">
        <div className="pos-logo">💈 30Shine <span>POS</span></div>
        <div className="pos-header-right">
          <span>👤 {currentUser?.hoTen || 'Lễ tân'}</span>
          <Link to="/" className="pos-logout">Đăng xuất</Link>
        </div>
      </header>

      <div className="pos-body">
        <aside className="pos-sidebar">
          <button className={activeTab === 'today' ? 'active' : ''} onClick={() => setActiveTab('today')}>📅 Lịch hẹn hôm nay</button>
          <button className={activeTab === 'book' ? 'active' : ''} onClick={() => setActiveTab('book')}>➕ Đặt lịch tại quầy</button>
          <button className={activeTab === 'invoice' ? 'active' : ''} onClick={() => setActiveTab('invoice')}>🧾 Tạo hóa đơn</button>
          <button className={activeTab === 'lookup' ? 'active' : ''} onClick={() => setActiveTab('lookup')}>🔍 Tra cứu khách</button>
        </aside>

        <main className="pos-main">
          {/* TAB: Lịch hẹn hôm nay */}
          {activeTab === 'today' && (
            <div className="pos-section">
              <h2>📅 Lịch Hẹn Hôm Nay <span className="pos-badge">{appointments.length}</span></h2>
              <table className="pos-table">
                <thead><tr><th>Mã</th><th>SĐT</th><th>Khách</th><th>NV</th><th>Giờ</th><th>Nguồn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.maDatLich}>
                      <td>{apt.maDatLich}</td>
                      <td>{apt.soDienThoai}</td>
                      <td>{apt.tenKhachHang || '-'}</td>
                      <td>{apt.tenNhanVien || '-'}</td>
                      <td>{new Date(apt.thoiGianHen).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</td>
                      <td>{apt.nguonDatLich}</td>
                      <td><span style={{padding:'2px 8px',borderRadius:12,fontSize:'0.75rem',fontWeight:600,background:`${getStatusColor(apt.trangThai)}20`,color:getStatusColor(apt.trangThai)}}>{getStatusText(apt.trangThai)}</span></td>
                      <td className="pos-actions">
                        {apt.trangThai === 'ChoXacNhan' && <button className="pos-btn confirm" onClick={() => handleUpdateStatus(apt.maDatLich,'DaXacNhan')}>Xác nhận</button>}
                        {apt.trangThai === 'DaXacNhan' && <button className="pos-btn serve" onClick={() => handleUpdateStatus(apt.maDatLich,'DangPhucVu')}>Phục vụ</button>}
                        {apt.trangThai === 'DangPhucVu' && <button className="pos-btn done" onClick={() => handleUpdateStatus(apt.maDatLich,'HoanThanh')}>Hoàn thành</button>}
                        {apt.trangThai !== 'DaHuy' && apt.trangThai !== 'HoanThanh' && <button className="pos-btn cancel" onClick={() => handleUpdateStatus(apt.maDatLich,'DaHuy')}>Hủy</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: Đặt lịch tại quầy */}
          {activeTab === 'book' && (
            <div className="pos-section">
              <h2>➕ Đặt Lịch Tại Quầy</h2>
              <div className="pos-form-grid">
                <div className="pos-field">
                  <label>SĐT Khách hàng *</label>
                  <input type="tel" value={bookPhone} onChange={e => setBookPhone(e.target.value)} placeholder="0901234567" />
                </div>
                <div className="pos-field">
                  <label>Ngày hẹn *</label>
                  <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} />
                </div>
                <div className="pos-field">
                  <label>Dịch vụ *</label>
                  <select value={bookService} onChange={e => setBookService(e.target.value)}>
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(s => <option key={s.maDichVu} value={s.maDichVu}>{s.tenDichVu} - {(s.gia||0).toLocaleString()}đ</option>)}
                  </select>
                </div>
                <div className="pos-field">
                  <label>Nhân viên *</label>
                  <select value={bookStaff} onChange={e => setBookStaff(e.target.value)}>
                    <option value="">-- Chọn thợ --</option>
                    {staff.map(s => <option key={s.maNhanVien} value={s.maNhanVien}>{s.hoTen} ({s.chucVu})</option>)}
                  </select>
                </div>
                <div className="pos-field">
                  <label>Giờ hẹn *</label>
                  <select value={bookTime} onChange={e => setBookTime(e.target.value)}>
                    <option value="">-- Chọn giờ --</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button className="pos-btn-primary" onClick={handleBookAtCounter}>✅ Đặt lịch</button>
            </div>
          )}

          {/* TAB: Tạo hóa đơn */}
          {activeTab === 'invoice' && (
            <div className="pos-section">
              <h2>🧾 Tạo Hóa Đơn</h2>
              <div className="pos-invoice-layout">
                <div className="pos-invoice-left">
                  {/* Tra cứu KH */}
                  <div className="pos-card">
                    <h3>👤 Khách hàng</h3>
                    <div className="pos-inline">
                      <input type="tel" value={invoicePhone} onChange={e => setInvoicePhone(e.target.value)} placeholder="Nhập SĐT khách..." />
                      <button className="pos-btn confirm" onClick={handleLookupInvoiceCustomer}>Tìm</button>
                    </div>
                    {invoiceCustomer && (
                      <div className="pos-customer-info">
                        <p><strong>{invoiceCustomer.hoTen}</strong> • {invoiceCustomer.soDienThoai}</p>
                        <p>Hạng: {hangTV(invoiceCustomer.hangThanhVien)} • Điểm: {invoiceCustomer.diemTichLuy}</p>
                      </div>
                    )}
                  </div>
                  {/* Chọn dịch vụ */}
                  <div className="pos-card">
                    <h3>✂️ Chọn dịch vụ</h3>
                    <div className="pos-service-grid">
                      {services.map(sv => (
                        <div key={sv.maDichVu} className="pos-sv-item" onClick={() => addInvoiceService(sv)}>
                          <span>{sv.tenDichVu}</span>
                          <span className="pos-sv-price">{(sv.giaSauGiam || sv.gia || 0).toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Mã KM */}
                  <div className="pos-card">
                    <h3>🎁 Mã khuyến mãi</h3>
                    <div className="pos-inline">
                      <input type="text" value={invoicePromo} onChange={e => setInvoicePromo(e.target.value.toUpperCase())} placeholder="Nhập mã..." />
                      <button className="pos-btn confirm" onClick={applyPromoCode}>Áp dụng</button>
                    </div>
                    {promoError && <p className="pos-error">{promoError}</p>}
                    {promoApplied && <p className="pos-success">✅ {promoApplied.tenKhuyenMai} (-{promoApplied.loaiGiam==='PhanTram'?`${promoApplied.giaTriGiam}%`:`${promoApplied.giaTriGiam.toLocaleString()}đ`})</p>}
                  </div>
                  {/* PTTT */}
                  <div className="pos-card">
                    <h3>💳 Phương thức thanh toán</h3>
                    <div className="pos-pay-grid">
                      {[{v:'TienMat',l:'💵 Tiền mặt'},{v:'ChuyenKhoan',l:'🏦 Chuyển khoản'},{v:'Momo',l:'📱 Momo'},{v:'VNPay',l:'💳 VNPay'}].map(m => (
                        <button key={m.v} className={`pos-pay-btn ${payMethod===m.v?'active':''}`} onClick={() => setPayMethod(m.v)}>{m.l}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tóm tắt */}
                <div className="pos-invoice-right">
                  <div className="pos-summary">
                    <h3>📄 Hóa đơn</h3>
                    {invoiceServices.length === 0 ? <p className="pos-empty">Chưa chọn dịch vụ</p> : (
                      <div className="pos-summary-items">
                        {invoiceServices.map(sv => (
                          <div key={sv.maDichVu} className="pos-summary-item">
                            <div><span>{sv.tenDichVu}</span><span className="pos-qty">×{sv.soLuong}</span></div>
                            <div className="pos-item-right">
                              <span>{((sv.giaSauGiam||sv.gia)*sv.soLuong).toLocaleString()}đ</span>
                              <button className="pos-remove" onClick={() => removeInvoiceService(sv.maDichVu)}>✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="pos-divider" />
                    <div className="pos-row"><span>Tạm tính</span><span>{subtotal.toLocaleString()}đ</span></div>
                    {discountAmt > 0 && <div className="pos-row discount"><span>Giảm giá</span><span>-{discountAmt.toLocaleString()}đ</span></div>}
                    <div className="pos-row total"><span>TỔNG CỘNG</span><span>{totalPay.toLocaleString()}đ</span></div>
                    {earnedPoints > 0 && <div className="pos-points">🎁 +{earnedPoints} điểm thưởng</div>}
                    <button className="pos-btn-pay" onClick={handleCreateInvoice}>💳 THANH TOÁN</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Tra cứu khách */}
          {activeTab === 'lookup' && (
            <div className="pos-section">
              <h2>🔍 Tra Cứu Khách Hàng</h2>
              <div className="pos-inline" style={{marginBottom:'1.5rem'}}>
                <input type="tel" value={searchPhone} onChange={e => setSearchPhone(e.target.value)} placeholder="Nhập SĐT khách hàng..." style={{flex:1}} />
                <button className="pos-btn confirm" onClick={handleSearchCustomer}>Tìm kiếm</button>
              </div>
              {foundCustomer && (
                <div className="pos-customer-detail">
                  <div className="pos-card">
                    <h3>👤 Thông tin khách hàng</h3>
                    <div className="pos-detail-grid">
                      <div><label>Họ tên</label><span>{foundCustomer.hoTen}</span></div>
                      <div><label>SĐT</label><span>{foundCustomer.soDienThoai}</span></div>
                      <div><label>Email</label><span>{foundCustomer.email || 'Chưa có'}</span></div>
                      <div><label>Giới tính</label><span>{foundCustomer.gioiTinh}</span></div>
                      <div><label>Hạng TV</label><span className="pos-tier">{hangTV(foundCustomer.hangThanhVien)}</span></div>
                      <div><label>Điểm tích lũy</label><span className="pos-points-val">{foundCustomer.diemTichLuy} điểm</span></div>
                      <div><label>Tổng điểm</label><span>{foundCustomer.tongDiemTich} điểm</span></div>
                    </div>
                  </div>
                  <div className="pos-card">
                    <h3>📋 Lịch sử đặt lịch ({customerBookings.length})</h3>
                    <table className="pos-table compact">
                      <thead><tr><th>Mã</th><th>Ngày</th><th>Giờ</th><th>Trạng thái</th></tr></thead>
                      <tbody>
                        {customerBookings.slice(0,10).map(bk => (
                          <tr key={bk.maDatLich}>
                            <td>{bk.maDatLich}</td>
                            <td>{new Date(bk.thoiGianHen).toLocaleDateString('vi-VN')}</td>
                            <td>{new Date(bk.thoiGianHen).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}</td>
                            <td><span style={{color:getStatusColor(bk.trangThai),fontWeight:600,fontSize:'0.8rem'}}>{getStatusText(bk.trangThai)}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Pos;
