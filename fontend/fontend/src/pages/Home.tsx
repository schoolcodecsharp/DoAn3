import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <span>📞 Hotline: 1900 2222</span>
          <span>⏰ Giờ làm việc: 8:30 - 20:30</span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>💈 30SHINE</h1>
          </div>
          <nav className="nav">
            <a href="#services">Dịch vụ</a>
            <a href="#branches">Chi nhánh</a>
            <a href="#about">Giới thiệu</a>
            <Link to="/login" className="btn-login">Đăng nhập</Link>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h2>ĐẶT LỊCH GIỮ CHỖ CHỈ 30 GIÂY</h2>
          <p>Cắt xong trả tiền, hủy lịch không sao</p>
          <Link to="/register" className="btn-booking-large">ĐẶT LỊCH NGAY</Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>DỊCH VỤ TÓC</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image">✂️</div>
            <h3>Cắt tóc</h3>
            <p className="service-price">Giá từ 94.000VNĐ</p>
            <a href="#" className="service-link">Tìm hiểu thêm →</a>
          </div>
          <div className="service-card">
            <div className="service-image">🌀</div>
            <h3>Uốn định hình</h3>
            <p className="service-price">Giá từ 386.000VNĐ</p>
            <a href="#" className="service-link">Tìm hiểu thêm →</a>
          </div>
          <div className="service-card">
            <div className="service-image">🎨</div>
            <h3>Thay đổi màu tóc</h3>
            <p className="service-price">Giá từ 199.000VNĐ</p>
            <a href="#" className="service-link">Tìm hiểu thêm →</a>
          </div>
        </div>

        <h2 className="section-title-alt">THƯ GIÃN VÀ CHĂM SÓC DA</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image">💆</div>
            <h3>Gội dưỡng sinh thư giãn</h3>
            <p className="service-price">Giá từ 59.000VNĐ</p>
            <a href="#" className="service-link">Tìm hiểu thêm →</a>
          </div>
          <div className="service-card">
            <div className="service-image">👂</div>
            <h3>Lấy ráy tai êm</h3>
            <p className="service-price">Giá 70.000VNĐ</p>
            <a href="#" className="service-link">Tìm hiểu thêm →</a>
          </div>
        </div>
      </section>

      {/* Shine Collection */}
      <section className="shine-collection">
        <h2>SHINE COLLECTION</h2>
        <p className="subtitle">'VIBE' NÀO CŨNG TOẢ SÁNG</p>
        <div className="collection-grid">
          <div className="collection-item">
            <div className="collection-badge">CREATIVE</div>
            <p>Phong cách sáng tạo</p>
          </div>
          <div className="collection-item">
            <div className="collection-badge">K-PERM</div>
            <p>Uốn Hàn Quốc</p>
          </div>
          <div className="collection-item">
            <div className="collection-badge">BAD BOY</div>
            <p>Phong cách cá tính</p>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="branches-section">
        <h2>TÌM 30SHINE GẦN NHẤT</h2>
        <p className="subtitle">Để xe thuận tiện an toàn, bản đồ dẫn đường chi tiết</p>
        <div className="city-grid">
          <div className="city-card">
            <h3>Hà Nội</h3>
            <p className="salon-count">20+ Salon</p>
            <div className="city-salons">
              <div className="salon-item">
                <p>📍 30Shine Cầu Giấy</p>
                <span>72 Cầu Giấy, Dịch Vọng Hậu</span>
              </div>
              <div className="salon-item">
                <p>📍 30Shine Hoàng Mai</p>
                <span>121 Nguyễn Đức Cảnh, Tương Mai</span>
              </div>
            </div>
          </div>
          <div className="city-card">
            <h3>TP. Hồ Chí Minh</h3>
            <p className="salon-count">50+ Salon</p>
            <div className="city-salons">
              <div className="salon-item">
                <p>📍 30Shine Bình Thạnh</p>
                <span>203 Xô Viết Nghệ Tĩnh, P.17</span>
              </div>
              <div className="salon-item">
                <p>📍 30Shine Quận 7</p>
                <span>12 Nguyễn Thị Thập, Tân Phú</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="commitment-section">
        <h2>CAM KẾT 30SHINE CARE</h2>
        <p className="subtitle">Sự hài lòng của anh là ưu tiên hàng đầu của 30Shine</p>
        <div className="commitment-grid">
          <div className="commitment-card">
            <div className="commitment-icon">30</div>
            <h3>30 ngày</h3>
            <p>Đổi/trả hàng miễn phí</p>
          </div>
          <div className="commitment-card">
            <div className="commitment-icon">07</div>
            <h3>07 ngày</h3>
            <p>Bảo hành tóc miễn phí</p>
          </div>
          <div className="commitment-card">
            <div className="commitment-icon">⏱️</div>
            <h3>Chính sách đặc biệt</h3>
            <p>Nếu khách chờ lâu</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>VỀ CHÚNG TÔI</h2>
        <div className="about-content">
          <p>30Shine là chuỗi salon tóc nam hàng đầu Việt Nam với hơn 10 năm kinh nghiệm</p>
          <div className="stats">
            <div className="stat-item">
              <h3>100+</h3>
              <p>Chi nhánh</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Stylist chuyên nghiệp</p>
            </div>
            <div className="stat-item">
              <h3>2.5M+</h3>
              <p>Khách hàng tin dùng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>VỀ CHÚNG TÔI</h3>
            <p><a href="#">Về 30Shine</a></p>
            <p><a href="#">30Shine Shop</a></p>
            <p><a href="#">Tìm 30Shine gần nhất</a></p>
          </div>
          <div className="footer-section">
            <h3>LIÊN HỆ</h3>
            <p>📞 Hotline: 1900 2222</p>
            <p>📧 Email: contact@30shine.com</p>
            <p>⏰ Giờ phục vụ: 8:30 - 20:30</p>
          </div>
          <div className="footer-section">
            <h3>CHÍNH SÁCH</h3>
            <p><a href="#">Chính sách bảo mật</a></p>
            <p><a href="#">Điều kiện giao dịch</a></p>
            <p><a href="#">Câu hỏi thường gặp</a></p>
          </div>
          <div className="footer-section">
            <h3>THEO DÕI CHÚNG TÔI</h3>
            <p>Facebook | Instagram | TikTok</p>
            <p>YouTube | Zalo</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 30Shine Barber Shop. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <Link to="/register" className="float-btn booking">
          📅 Đặt lịch
        </Link>
        <a href="tel:19002222" className="float-btn hotline">
          📞 Hotline
        </a>
      </div>
    </div>
  );
}

export default Home;
