import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/ServiceDetail.css';
import { dichVuApi, danhGiaApi, chiNhanhApi } from '../utils/api';

function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const currentUser = (() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  })();

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sv, allSv, rv, br] = await Promise.all([
        dichVuApi.getById(id!),
        dichVuApi.getAll(),
        danhGiaApi.getAll({}).catch(() => []),
        chiNhanhApi.getAll(),
      ]);
      setService(sv);
      setAllServices(allSv);
      setReviews(Array.isArray(rv) ? rv : []);
      setBranches(br);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const serviceImages = [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop',
  ];

  const relatedServices = allServices
    .filter((s: any) => s.maDichVu !== id && s.danhMuc === service?.danhMuc)
    .slice(0, 4);

  const handleBookNow = () => {
    if (!currentUser) {
      // Lưu thông tin dịch vụ vào localStorage để sau khi đăng nhập có thể quay lại
      localStorage.setItem('pendingBooking', JSON.stringify({ serviceId: id }));
      alert('Vui lòng đăng nhập để đặt lịch!');
      navigate('/login');
    } else {
      navigate('/user', { state: { preSelectedService: id } });
    }
  };

  if (loading) {
    return (
      <div className="sd-loading">
        <div className="sd-spinner"></div>
        <p>Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="sd-not-found">
        <h2>Không tìm thấy dịch vụ</h2>
        <Link to="/" className="sd-back-btn">← Về trang chủ</Link>
      </div>
    );
  }

  const mainImage = service.hinhAnh || serviceImages[0];
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.saoDichVu || 0), 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="sd-container">
      {/* Header */}
      <header className="sd-header">
        <div className="sd-header-content">
          <Link to="/" className="sd-logo">💈 30Shine</Link>
          <nav className="sd-nav">
            <Link to="/">Trang chủ</Link>
            <Link to="/#services">Dịch vụ</Link>
            <Link to="/#branches">Chi nhánh</Link>
            {currentUser ? (
              <Link to="/user" className="sd-btn-user">
                👤 {currentUser.hoTen}
              </Link>
            ) : (
              <Link to="/login" className="sd-btn-login">Đăng nhập</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="sd-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="sd-breadcrumb-sep">›</span>
        <Link to="/#services">Dịch vụ</Link>
        <span className="sd-breadcrumb-sep">›</span>
        <span className="sd-breadcrumb-current">{service.tenDichVu}</span>
      </div>

      {/* Main Content */}
      <div className="sd-main">
        {/* Image Gallery */}
        <div className="sd-gallery">
          <div className="sd-main-image">
            <img src={activeImageIdx === 0 ? mainImage : serviceImages[activeImageIdx]} alt={service.tenDichVu} />
            <div className="sd-image-badge">
              <span className="sd-category-tag">{service.danhMuc}</span>
            </div>
          </div>
          <div className="sd-thumbnails">
            {[mainImage, ...serviceImages.slice(1)].slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className={`sd-thumb ${activeImageIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={img} alt={`Ảnh ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Service Info */}
        <div className="sd-info">
          <div className="sd-info-header">
            <span className="sd-category">{service.danhMuc}</span>
            <div className="sd-rating">
              <span className="sd-stars">{'★'.repeat(Math.round(Number(avgRating)))}</span>
              <span className="sd-rating-text">{avgRating} ({reviews.length} đánh giá)</span>
            </div>
          </div>

          <h1 className="sd-title">{service.tenDichVu}</h1>

          <div className="sd-price-section">
            {service.giaSauGiam ? (
              <>
                <span className="sd-price-original">{(service.gia || 0).toLocaleString()}đ</span>
                <span className="sd-price-sale">{(service.giaSauGiam || 0).toLocaleString()}đ</span>
                <span className="sd-discount-tag">
                  -{Math.round((1 - service.giaSauGiam / service.gia) * 100)}%
                </span>
              </>
            ) : (
              <span className="sd-price">{(service.gia || 0).toLocaleString()}đ</span>
            )}
          </div>

          <div className="sd-meta-grid">
            <div className="sd-meta-item">
              <span className="sd-meta-icon">⏱️</span>
              <div>
                <span className="sd-meta-label">Thời gian</span>
                <span className="sd-meta-value">{service.thoiGianPhut} phút</span>
              </div>
            </div>
            <div className="sd-meta-item">
              <span className="sd-meta-icon">🎁</span>
              <div>
                <span className="sd-meta-label">Điểm thưởng</span>
                <span className="sd-meta-value">+{service.diemThuong} điểm</span>
              </div>
            </div>
            <div className="sd-meta-item">
              <span className="sd-meta-icon">📍</span>
              <div>
                <span className="sd-meta-label">Chi nhánh</span>
                <span className="sd-meta-value">{branches.length} cơ sở</span>
              </div>
            </div>
            <div className="sd-meta-item">
              <span className="sd-meta-icon">✅</span>
              <div>
                <span className="sd-meta-label">Trạng thái</span>
                <span className="sd-meta-value">{service.trangThai ? 'Đang hoạt động' : 'Tạm dừng'}</span>
              </div>
            </div>
          </div>

          <div className="sd-description">
            <h3>Mô tả dịch vụ</h3>
            <p>{service.moTa || 'Dịch vụ chất lượng cao tại 30Shine. Đội ngũ stylist chuyên nghiệp, sử dụng sản phẩm cao cấp, mang đến trải nghiệm tuyệt vời cho khách hàng.'}</p>
            <ul className="sd-features">
              <li>✓ Stylist chuyên nghiệp, giàu kinh nghiệm</li>
              <li>✓ Sản phẩm chính hãng, an toàn</li>
              <li>✓ Không gian hiện đại, thoải mái</li>
              <li>✓ Tích điểm thưởng mỗi lần sử dụng</li>
            </ul>
          </div>

          <div className="sd-actions">
            <button className="sd-btn-book" onClick={handleBookNow}>
              ✂️ Đặt lịch ngay
              <span className="sd-btn-arrow">→</span>
            </button>
            <Link to="/checkout" state={{ serviceId: id, service }} className="sd-btn-checkout">
              💳 Thanh toán nhanh
            </Link>
          </div>

          <div className="sd-promo-banner">
            <span className="sd-promo-icon">🔥</span>
            <div>
              <strong>Ưu đãi đặc biệt!</strong>
              <p>Giảm 15% cho khách hàng đặt lịch lần đầu qua website</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="sd-reviews-section">
        <div className="sd-section-header">
          <h2>Đánh giá từ khách hàng</h2>
          <div className="sd-overall-rating">
            <span className="sd-big-rating">{avgRating}</span>
            <span className="sd-big-stars">★★★★★</span>
            <span className="sd-review-count">{reviews.length} đánh giá</span>
          </div>
        </div>
        <div className="sd-reviews-list">
          {reviews.length === 0 ? (
            <div className="sd-no-reviews">
              <p>Chưa có đánh giá nào cho dịch vụ này</p>
              <span>Hãy là người đầu tiên đánh giá! ⭐</span>
            </div>
          ) : (
            reviews.slice(0, 5).map((review: any, idx: number) => (
              <div key={idx} className="sd-review-card">
                <div className="sd-review-header">
                  <div className="sd-reviewer-avatar">
                    {(review.soDienThoai || 'K').charAt(0)}
                  </div>
                  <div>
                    <div className="sd-reviewer-name">Khách hàng {review.soDienThoai?.slice(-4)}</div>
                    <div className="sd-review-stars">
                      {'★'.repeat(review.saoDichVu || 5)}{'☆'.repeat(5 - (review.saoDichVu || 5))}
                    </div>
                  </div>
                  <span className="sd-review-date">
                    {review.ngayDanhGia ? new Date(review.ngayDanhGia).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                <p className="sd-review-text">{review.nhanXet || 'Dịch vụ rất tốt!'}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="sd-related-section">
          <h2>Dịch vụ liên quan</h2>
          <div className="sd-related-grid">
            {relatedServices.map((sv: any, idx: number) => (
              <Link key={sv.maDichVu} to={`/service/${sv.maDichVu}`} className="sd-related-card">
                <div className="sd-related-image">
                  <img src={sv.hinhAnh || serviceImages[idx % serviceImages.length]} alt={sv.tenDichVu} />
                </div>
                <div className="sd-related-info">
                  <h4>{sv.tenDichVu}</h4>
                  <span className="sd-related-price">{(sv.gia || 0).toLocaleString()}đ</span>
                  <span className="sd-related-time">⏱ {sv.thoiGianPhut} phút</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="sd-footer">
        <p>© 2026 30Shine - Hệ thống salon tóc nam hàng đầu Việt Nam</p>
      </footer>
    </div>
  );
}

export default ServiceDetail;
