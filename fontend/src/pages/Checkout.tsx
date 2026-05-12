import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';
import { dichVuApi, chiNhanhApi, khuyenMaiApi, hoaDonApi } from '../utils/api';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateService = location.state?.service;
  const stateServiceId = location.state?.serviceId;
  const stateDatLich = location.state?.datLich;

  const [currentUser] = useState<any>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('TienMat');
  const [note, setNote] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sv, br] = await Promise.all([
        dichVuApi.getAll(),
        chiNhanhApi.getAll(),
      ]);
      setServices(sv);
      setBranches(br);
      if (br.length > 0) setSelectedBranch(br[0].maChiNhanh);

      // Pre-select service from navigation state
      if (stateService) {
        setSelectedServices([{ ...stateService, soLuong: 1 }]);
      } else if (stateServiceId) {
        const found = sv.find((s: any) => s.maDichVu === stateServiceId);
        if (found) setSelectedServices([{ ...found, soLuong: 1 }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addService = (service: any) => {
    const exists = selectedServices.find((s) => s.maDichVu === service.maDichVu);
    if (exists) {
      setSelectedServices(selectedServices.map((s) =>
        s.maDichVu === service.maDichVu ? { ...s, soLuong: s.soLuong + 1 } : s
      ));
    } else {
      setSelectedServices([...selectedServices, { ...service, soLuong: 1 }]);
    }
  };

  const removeService = (maDichVu: string) => {
    setSelectedServices(selectedServices.filter((s) => s.maDichVu !== maDichVu));
  };

  const updateQuantity = (maDichVu: string, qty: number) => {
    if (qty < 1) { removeService(maDichVu); return; }
    setSelectedServices(selectedServices.map((s) =>
      s.maDichVu === maDichVu ? { ...s, soLuong: qty } : s
    ));
  };

  const subtotal = selectedServices.reduce((sum, s) => sum + (s.giaSauGiam || s.gia) * s.soLuong, 0);

  const applyPromo = async () => {
    setPromoError('');
    setPromoApplied(null);
    if (!promoCode.trim()) { setPromoError('Vui lòng nhập mã khuyến mãi'); return; }
    try {
      const promos = await khuyenMaiApi.getAll(promoCode);
      const found = (Array.isArray(promos) ? promos : []).find(
        (p: any) => (p.maCode || p.MaCode)?.toUpperCase() === promoCode.toUpperCase()
      );
      if (!found) { setPromoError('Mã khuyến mãi không tồn tại'); return; }
      if (!found.trangThai) { setPromoError('Mã khuyến mãi đã hết hạn'); return; }
      if (found.donHangToiThieu && subtotal < found.donHangToiThieu) {
        setPromoError(`Đơn hàng tối thiểu ${found.donHangToiThieu.toLocaleString()}đ`);
        return;
      }
      setPromoApplied(found);
    } catch {
      setPromoError('Không thể kiểm tra mã khuyến mãi');
    }
  };

  const discountAmount = promoApplied
    ? promoApplied.loaiGiam === 'PhanTram'
      ? Math.min(subtotal * promoApplied.giaTriGiam / 100, promoApplied.giaTriToiDa || Infinity)
      : promoApplied.giaTriGiam
    : 0;

  const pointDiscount = usePoints ? Math.min(pointsToUse * 1000, subtotal - discountAmount) : 0;
  const totalPayment = Math.max(0, subtotal - discountAmount - pointDiscount);
  const earnedPoints = selectedServices.reduce((sum, s) => sum + (s.diemThuong || 0) * s.soLuong, 0);

  const handlePayment = async () => {
    if (!currentUser) { alert('Vui lòng đăng nhập!'); navigate('/login'); return; }
    if (selectedServices.length === 0) { alert('Vui lòng chọn dịch vụ!'); return; }
    if (!selectedBranch) { alert('Vui lòng chọn chi nhánh!'); return; }

    setLoading(true);
    try {
      const sdt = currentUser.SoDienThoai || currentUser.soDienThoai;
      const maHD = 'HD' + Date.now().toString().slice(-8);
      await hoaDonApi.create({
        maHoaDon: maHD,
        soDienThoai: sdt,
        maDatLich: stateDatLich?.maDatLich || null,
        maChiNhanh: selectedBranch,
        maCode: promoApplied?.maCode || null,
        tongTien: subtotal,
        giamGia: discountAmount + pointDiscount,
        thanhTien: totalPayment,
        diemDuocCong: earnedPoints,
        diemDaDung: usePoints ? pointsToUse : 0,
        phuongThucTT: paymentMethod,
        ghiChu: note || null,
      });
      setCreatedInvoice(maHD);
      setOrderSuccess(true);
    } catch (err: any) {
      alert('Lỗi thanh toán: ' + err.message);
    }
    setLoading(false);
  };

  if (orderSuccess) {
    return (
      <div className="co-container">
        <div className="co-success-screen">
          <div className="co-success-icon">✅</div>
          <h1>Thanh toán thành công!</h1>
          <p className="co-success-id">Mã hóa đơn: <strong>{createdInvoice}</strong></p>
          <div className="co-success-details">
            <div className="co-success-row">
              <span>Tổng thanh toán</span>
              <span className="co-success-amount">{totalPayment.toLocaleString()}đ</span>
            </div>
            <div className="co-success-row">
              <span>Phương thức</span>
              <span>{paymentMethod === 'TienMat' ? 'Tiền mặt' : paymentMethod === 'ChuyenKhoan' ? 'Chuyển khoản' : paymentMethod}</span>
            </div>
            <div className="co-success-row">
              <span>Điểm thưởng nhận được</span>
              <span className="co-success-points">+{earnedPoints} điểm</span>
            </div>
          </div>
          <div className="co-success-actions">
            <Link to="/user" className="co-btn-primary">Xem hóa đơn của tôi</Link>
            <Link to="/" className="co-btn-secondary">Về trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-container">
      {/* Header */}
      <header className="co-header">
        <div className="co-header-content">
          <Link to="/" className="co-logo">💈 30Shine</Link>
          <h2 className="co-header-title">Thanh Toán</h2>
          <div className="co-header-user">
            {currentUser ? (
              <span>👤 {currentUser.hoTen}</span>
            ) : (
              <Link to="/login" className="co-btn-login">Đăng nhập</Link>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="co-progress">
        <div className={`co-step ${step >= 1 ? 'active' : ''}`}>
          <div className="co-step-circle">1</div>
          <span>Chọn dịch vụ</span>
        </div>
        <div className="co-step-line"></div>
        <div className={`co-step ${step >= 2 ? 'active' : ''}`}>
          <div className="co-step-circle">2</div>
          <span>Xác nhận</span>
        </div>
        <div className="co-step-line"></div>
        <div className={`co-step ${step >= 3 ? 'active' : ''}`}>
          <div className="co-step-circle">3</div>
          <span>Thanh toán</span>
        </div>
      </div>

      <div className="co-main">
        {/* Left Column */}
        <div className="co-left">
          {step === 1 && (
            <>
              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">🏢</span>
                  Chọn chi nhánh
                </h2>
                <div className="co-branch-grid">
                  {branches.map((branch: any) => (
                    <div
                      key={branch.maChiNhanh}
                      className={`co-branch-card ${selectedBranch === branch.maChiNhanh ? 'selected' : ''}`}
                      onClick={() => setSelectedBranch(branch.maChiNhanh)}
                    >
                      <h4>{branch.tenChiNhanh}</h4>
                      <p>📍 {branch.diaChi}</p>
                      <p>📞 {branch.soDienThoai}</p>
                      {selectedBranch === branch.maChiNhanh && <span className="co-check">✓</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">✂️</span>
                  Chọn dịch vụ
                </h2>
                <div className="co-service-grid">
                  {services.map((sv: any) => {
                    const isSelected = selectedServices.some((s) => s.maDichVu === sv.maDichVu);
                    return (
                      <div key={sv.maDichVu} className={`co-service-card ${isSelected ? 'selected' : ''}`} onClick={() => addService(sv)}>
                        <div className="co-service-top">
                          <h4>{sv.tenDichVu}</h4>
                          <span className="co-service-cat">{sv.danhMuc}</span>
                        </div>
                        <div className="co-service-bottom">
                          <span className="co-service-price">{(sv.giaSauGiam || sv.gia || 0).toLocaleString()}đ</span>
                          <span className="co-service-time">⏱ {sv.thoiGianPhut}p</span>
                        </div>
                        {isSelected && <span className="co-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </section>

              {selectedServices.length > 0 && (
                <button className="co-btn-next" onClick={() => setStep(2)}>
                  Tiếp tục xác nhận →
                </button>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">📋</span>
                  Dịch vụ đã chọn
                </h2>
                <div className="co-cart-list">
                  {selectedServices.map((sv) => (
                    <div key={sv.maDichVu} className="co-cart-item">
                      <div className="co-cart-info">
                        <h4>{sv.tenDichVu}</h4>
                        <p className="co-cart-cat">{sv.danhMuc} • {sv.thoiGianPhut} phút</p>
                      </div>
                      <div className="co-cart-qty">
                        <button onClick={() => updateQuantity(sv.maDichVu, sv.soLuong - 1)}>−</button>
                        <span>{sv.soLuong}</span>
                        <button onClick={() => updateQuantity(sv.maDichVu, sv.soLuong + 1)}>+</button>
                      </div>
                      <div className="co-cart-price">
                        {((sv.giaSauGiam || sv.gia) * sv.soLuong).toLocaleString()}đ
                      </div>
                      <button className="co-cart-remove" onClick={() => removeService(sv.maDichVu)}>✕</button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Promo Code */}
              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">🎁</span>
                  Mã khuyến mãi
                </h2>
                <div className="co-promo-input">
                  <input
                    type="text"
                    placeholder="Nhập mã khuyến mãi..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={applyPromo}>Áp dụng</button>
                </div>
                {promoError && <p className="co-promo-error">❌ {promoError}</p>}
                {promoApplied && (
                  <div className="co-promo-success">
                    <span>✅ {promoApplied.tenKhuyenMai}</span>
                    <span className="co-promo-discount">
                      -{promoApplied.loaiGiam === 'PhanTram' ? `${promoApplied.giaTriGiam}%` : `${promoApplied.giaTriGiam.toLocaleString()}đ`}
                    </span>
                  </div>
                )}
              </section>

              {/* Points */}
              {currentUser && currentUser.diemTichLuy > 0 && (
                <section className="co-section">
                  <h2 className="co-section-title">
                    <span className="co-section-icon">💎</span>
                    Điểm tích lũy ({currentUser.diemTichLuy} điểm)
                  </h2>
                  <div className="co-points-toggle">
                    <label className="co-switch">
                      <input type="checkbox" checked={usePoints} onChange={(e) => { setUsePoints(e.target.checked); if (e.target.checked) setPointsToUse(Math.min(currentUser.diemTichLuy, Math.floor((subtotal - discountAmount) / 1000))); }} />
                      <span className="co-slider"></span>
                    </label>
                    <span>Sử dụng điểm tích lũy (1 điểm = 1,000đ)</span>
                  </div>
                  {usePoints && (
                    <div className="co-points-input">
                      <input
                        type="number"
                        min={0}
                        max={Math.min(currentUser.diemTichLuy, Math.floor((subtotal - discountAmount) / 1000))}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(Number(e.target.value))}
                      />
                      <span>điểm (giảm {pointDiscount.toLocaleString()}đ)</span>
                    </div>
                  )}
                </section>
              )}

              <div className="co-step-buttons">
                <button className="co-btn-back" onClick={() => setStep(1)}>← Quay lại</button>
                <button className="co-btn-next" onClick={() => setStep(3)}>Thanh toán →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">💳</span>
                  Phương thức thanh toán
                </h2>
                <div className="co-payment-grid">
                  {[
                    { value: 'TienMat', icon: '💵', label: 'Tiền mặt', desc: 'Thanh toán tại cửa hàng' },
                    { value: 'ChuyenKhoan', icon: '🏦', label: 'Chuyển khoản', desc: 'Qua ngân hàng' },
                    { value: 'Momo', icon: '📱', label: 'Momo', desc: 'Ví điện tử Momo' },
                    { value: 'VNPay', icon: '💳', label: 'VNPay', desc: 'Thanh toán online' },
                  ].map((method) => (
                    <div
                      key={method.value}
                      className={`co-payment-card ${paymentMethod === method.value ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <span className="co-payment-icon">{method.icon}</span>
                      <h4>{method.label}</h4>
                      <p>{method.desc}</p>
                      {paymentMethod === method.value && <span className="co-check">✓</span>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="co-section">
                <h2 className="co-section-title">
                  <span className="co-section-icon">📝</span>
                  Ghi chú
                </h2>
                <textarea
                  className="co-note-input"
                  placeholder="Thêm ghi chú cho hóa đơn (không bắt buộc)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </section>

              <div className="co-step-buttons">
                <button className="co-btn-back" onClick={() => setStep(2)}>← Quay lại</button>
                <button className="co-btn-pay" onClick={handlePayment} disabled={loading}>
                  {loading ? '⏳ Đang xử lý...' : `💳 Thanh toán ${totalPayment.toLocaleString()}đ`}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="co-right">
          <div className="co-summary">
            <h3 className="co-summary-title">📄 Tóm tắt đơn hàng</h3>
            
            {currentUser && (
              <div className="co-customer-info">
                <div className="co-customer-avatar">{currentUser.hoTen?.charAt(0) || 'K'}</div>
                <div>
                  <strong>{currentUser.hoTen}</strong>
                  <p>{currentUser.soDienThoai || currentUser.SoDienThoai}</p>
                </div>
              </div>
            )}

            <div className="co-summary-branch">
              📍 {branches.find((b: any) => b.maChiNhanh === selectedBranch)?.tenChiNhanh || 'Chưa chọn'}
            </div>

            <div className="co-summary-items">
              {selectedServices.map((sv) => (
                <div key={sv.maDichVu} className="co-summary-item">
                  <div>
                    <span>{sv.tenDichVu}</span>
                    <span className="co-summary-qty">×{sv.soLuong}</span>
                  </div>
                  <span>{((sv.giaSauGiam || sv.gia) * sv.soLuong).toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="co-summary-divider"></div>

            <div className="co-summary-row">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            {discountAmount > 0 && (
              <div className="co-summary-row discount">
                <span>🎁 Khuyến mãi</span>
                <span>-{discountAmount.toLocaleString()}đ</span>
              </div>
            )}
            {pointDiscount > 0 && (
              <div className="co-summary-row discount">
                <span>💎 Điểm tích lũy</span>
                <span>-{pointDiscount.toLocaleString()}đ</span>
              </div>
            )}

            <div className="co-summary-divider"></div>

            <div className="co-summary-total">
              <span>TỔNG CỘNG</span>
              <span>{totalPayment.toLocaleString()}đ</span>
            </div>

            {earnedPoints > 0 && (
              <div className="co-summary-points">
                🎁 Nhận được +{earnedPoints} điểm thưởng
              </div>
            )}

            <div className="co-summary-secure">
              🔒 Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="co-footer">
        <p>© 2026 30Shine. Bảo mật thông tin thanh toán.</p>
      </footer>
    </div>
  );
}

export default Checkout;
