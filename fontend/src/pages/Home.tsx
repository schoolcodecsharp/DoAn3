import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { dichVuApi, chiNhanhApi } from '../utils/api';

function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setServices(await dichVuApi.getAll());
        setBranches(await chiNhanhApi.getAll());
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const branchesByCity = branches.reduce((acc: any, branch: any) => {
    const city = branch.TinhThanh || branch.tinhThanh;
    if (!acc[city]) acc[city] = [];
    acc[city].push(branch);
    return acc;
  }, {} as Record<string, any[]>);

  const serviceImages = [
    '/images/haircut.png',
    '/images/massage.png',
    '/images/haircut.png',
    '/images/massage.png',
    '/images/haircut.png',
    '/images/massage.png',
  ];

  const serviceEmojis = ['✂️', '💆', '🎨', '💇', '🧴', '💈'];

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>💈 30Shine</h1>
          </div>
          <nav className="nav">
            <a href="#services">Dịch vụ</a>
            <a href="#branches">Chi nhánh</a>
            <a href="#about">Về chúng tôi</a>
            <Link to="/login" className="btn-login">Đăng nhập</Link>
            <Link to="/register" className="btn-primary">Đăng ký</Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <p className="hero-label">Premium Hair Salon</p>
          <h2>
            Trải Nghiệm
            <span className="highlight">Phong Cách Đỉnh Cao</span>
          </h2>
          <p>
            Hệ thống salon tóc nam hàng đầu Việt Nam. Đội ngũ stylist chuyên nghiệp, 
            không gian hiện đại, dịch vụ 5 sao cho phái mạnh.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-booking-large">
              Đặt Lịch Ngay →
            </Link>
            <a href="#services" className="btn-secondary">
              Xem Dịch Vụ
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero.png" alt="30Shine Premium Barbershop" />
          <div className="hero-badge">
            <div className="badge-text">
              <strong>10+</strong>
              <span>Năm kinh nghiệm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Chi Nhánh Toàn Quốc</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Stylist Chuyên Nghiệp</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Khách Hàng Hài Lòng</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8⭐</div>
            <div className="stat-label">Đánh Giá Trung Bình</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="section-header">
          <p className="section-label">Dịch Vụ Của Chúng Tôi</p>
          <h2>Dịch Vụ Nổi Bật</h2>
          <p className="section-subtitle">
            Đa dạng dịch vụ từ cắt tóc, gội đầu, massage đến nhuộm, uốn với chất lượng hàng đầu
          </p>
        </div>
        <div className="services-grid">
          {services.slice(0, 6).map((service: any, index: number) => (
            <div key={service.MaDichVu || service.maDichVu} className="service-card">
              <span className="service-number">0{index + 1}</span>
              <div className="service-card-image">
                <img src={serviceImages[index % serviceImages.length]} alt={service.TenDichVu || service.tenDichVu} />
              </div>
              <div className="service-card-content">
                <h3>{service.TenDichVu || service.tenDichVu}</h3>
                <p className="service-price">{(service.Gia || service.gia || 0).toLocaleString()}đ</p>
                <p className="service-description">
                  {service.MoTa || service.moTa || 'Dịch vụ chất lượng cao tại 30Shine'}
                </p>
                <p className="service-description">
                  {serviceEmojis[index % serviceEmojis.length]} {service.ThoiGianPhut || service.thoiGianPhut} phút • 🎁 +{service.DiemThuong || service.diemThuong} điểm
                </p>
                <Link to="/login" className="service-link">
                  Đặt lịch ngay →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Branches Section */}
      <section className="branches-section" id="branches">
        <div className="section-header">
          <p className="section-label">Hệ Thống Chi Nhánh</p>
          <h2>Có Mặt Khắp Nơi</h2>
          <p className="section-subtitle">
            Hệ thống chi nhánh trải dài trên toàn quốc, luôn sẵn sàng phục vụ bạn
          </p>
        </div>
        <div className="city-grid">
          {Object.entries(branchesByCity).map(([city, cityBranches]) => (
            <div key={city} className="city-card">
              <h3>{city}</h3>
              <p className="salon-count">{cityBranches.length} chi nhánh</p>
              {cityBranches.map(branch => (
                <div key={branch.MaChiNhanh || branch.maChiNhanh} className="salon-item">
                  <p>{branch.TenChiNhanh || branch.tenChiNhanh}</p>
                  <span>{branch.DiaChi || branch.diaChi}</span>
                  <br />
                  <span>📞 {branch.SoDienThoai || branch.soDienThoai} • 🕐 {branch.GioMoCua || branch.gioMoCua} - {branch.GioDongCua || branch.gioDongCua}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="about">
        <div className="footer-content">
          <div className="footer-section">
            <h3>💈 30Shine</h3>
            <p>Hệ thống salon tóc nam hàng đầu Việt Nam</p>
            <p>Mang đến phong cách đỉnh cao cho phái mạnh</p>
          </div>
          <div className="footer-section">
            <h3>Dịch Vụ</h3>
            <a href="#services">Cắt tóc nam</a>
            <a href="#services">Gội đầu massage</a>
            <a href="#services">Nhuộm tóc</a>
            <a href="#services">Uốn & Duỗi</a>
          </div>
          <div className="footer-section">
            <h3>Hỗ Trợ</h3>
            <a href="#">Đặt lịch online</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
            <a href="#">Liên hệ</a>
          </div>
          <div className="footer-section">
            <h3>Liên Hệ</h3>
            <p>📞 Hotline: 1900 27 27 30</p>
            <p>📧 Email: info@30shine.com</p>
            <p>🌐 Website: www.30shine.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 30Shine. All rights reserved. | Đồ án 3 - Nguyễn Văn Trường</p>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        <Link to="/login" className="float-btn">
          ✂️ Đặt Lịch
        </Link>
        <a href="tel:1900272730" className="float-btn hotline">
          📞 Hotline
        </a>
      </div>
    </div>
  );
}

export default Home;
