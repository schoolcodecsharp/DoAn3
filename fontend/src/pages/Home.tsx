import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { dichVuApi, chiNhanhApi } from '../utils/api';

import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';
import hero4 from '../assets/hero4.png';

const heroImages = [
  { src: hero1, alt: 'Không gian Premium Barbershop' },
  { src: hero2, alt: 'Stylist chuyên nghiệp đang phục vụ' },
  { src: hero3, alt: 'Dụng cụ và sản phẩm cao cấp' },
  { src: hero4, alt: 'Phong cách hiện đại cho phái mạnh' },
];

function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setServices(await dichVuApi.getAll());
        setBranches(await chiNhanhApi.getAll());
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const branchesByCity = branches.reduce((acc: any, branch: any) => {
    const city = branch.tinhThanh || 'Khác';
    if (!acc[city]) acc[city] = [];
    acc[city].push(branch);
    return acc;
  }, {} as Record<string, any[]>);

  // Fallback images for services that don't have images from DB
  const fallbackServiceImages = [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=300&fit=crop',
  ];

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

      {/* Hero Banner with Image Slideshow */}
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
            <Link to="/checkout" className="btn-secondary" style={{marginLeft: '0.5rem'}}>
              💳 Thanh Toán
            </Link>
            <a href="#services" className="btn-secondary">
              Xem Dịch Vụ
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-slideshow">
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
            <div className="hero-slide-overlay"></div>
          </div>
          <div className="hero-dots">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
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

      {/* Marquee Text - "Có Mặt Khắp Mọi Nơi" */}
      <section className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-content">
            <span className="marquee-text">DỊCH VỤ NỔI BẬT</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">CÓ MẶT KHẮP MỌI NƠI</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">PREMIUM HAIR SALON</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">30SHINE</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">PHONG CÁCH ĐỈNH CAO</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">DỊCH VỤ NỔI BẬT</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">CÓ MẶT KHẮP MỌI NƠI</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">PREMIUM HAIR SALON</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">30SHINE</span>
            <span className="marquee-dot">✦</span>
            <span className="marquee-text">PHONG CÁCH ĐỈNH CAO</span>
            <span className="marquee-dot">✦</span>
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
          {services.slice(0, 6).map((service: any, index: number) => {
            const imageUrl = service.hinhAnh || fallbackServiceImages[index % fallbackServiceImages.length];
            return (
              <div key={service.maDichVu} className="service-card">
                <span className="service-number">0{index + 1}</span>
                <div className="service-card-image">
                  <img
                    src={imageUrl}
                    alt={service.tenDichVu}
                    className="service-img"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="service-image-placeholder" style={{ display: 'none' }}>
                    <span>✂️</span>
                  </div>
                </div>
                <div className="service-card-content">
                  <h3>{service.tenDichVu}</h3>
                  <p className="service-price">{(service.gia || 0).toLocaleString()}đ</p>
                  <p className="service-description">
                    {service.moTa || 'Dịch vụ chất lượng cao tại 30Shine'}
                  </p>
                  <p className="service-duration">
                    ⏱ {service.thoiGianPhut} phút • 🎁 +{service.diemThuong} điểm
                  </p>
                  <Link to={`/service/${service.maDichVu}`} className="service-link">
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            );
          })}
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
              <div className="city-card-header">
                <div className="city-icon">📍</div>
                <div>
                  <h3>{city}</h3>
                  <p className="salon-count">{(cityBranches as any[]).length} chi nhánh</p>
                </div>
              </div>
              <div className="salon-list">
                {(cityBranches as any[]).map((branch: any) => (
                  <div key={branch.maChiNhanh} className="salon-item">
                    <p className="salon-name">{branch.tenChiNhanh}</p>
                    <span className="salon-address">📍 {branch.diaChi}</span>
                    <span className="salon-info">📞 {branch.soDienThoai} • 🕐 {branch.gioMoCua} - {branch.gioDongCua}</span>
                  </div>
                ))}
              </div>
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
