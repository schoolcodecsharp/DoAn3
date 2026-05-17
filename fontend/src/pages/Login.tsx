import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authApi } from '../utils/api';
import introImage from '../assets/barbershop_intro.png';

declare global {
  interface Window {
    google?: any;
  }
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accountType: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleResponse = useCallback(async (response: any) => {
    setLoading(true);
    setError('');
    try {
      const result = await authApi.googleLogin(response.credential);
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        const role = result.user.vaiTro || result.user.VaiTro;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff') navigate('/staff');
        else navigate('/user');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập Google thất bại!');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Initialize Google Identity Services
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { 
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%',
          }
        );
      }
    };

    // Wait for GSI script to load
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 100);
      // Clean up after 5 seconds
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [handleGoogleResponse]);

  // Validate email format
  const isValidEmail = (email: string) => {
    return email.includes('@');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate email
    if (!isValidEmail(formData.email)) {
      setError('Vui lòng nhập địa chỉ email hợp lệ (có chứa @)');
      setLoading(false);
      return;
    }
    
    try {
      const result = await authApi.login(formData.email, formData.password, formData.accountType);
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        
        // Kiểm tra xem có pendingBooking không
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          const booking = JSON.parse(pendingBooking);
          localStorage.removeItem('pendingBooking');
          navigate('/user', { state: { preSelectedService: booking.serviceId } });
          return;
        }
        
        // Nếu không có pendingBooking, điều hướng theo role
        const role = result.user.vaiTro || result.user.VaiTro;
        const chucVu = result.user.chucVu || result.user.ChucVu;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff' && chucVu === 'Lễ tân') navigate('/pos');
        else if (role === 'staff') navigate('/staff');
        else navigate('/user');
      }
    } catch (err: any) {
      setError(err.message || 'Sai email hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Login Form */}
      <div className="auth-left">
        <div className="auth-box">
          <div className="auth-header">
            <h1>💈 30Shine</h1>
            <h2>Đăng Nhập</h2>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Loại tài khoản</label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  backgroundColor: '#1A1A1B',
                  color: '#fff',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <option value="user">Khách hàng</option>
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản lý</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email / Gmail</label>
              <input
                type="email"
                placeholder="Nhập email hoặc gmail của bạn"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="forgot-link">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>

            <div className="auth-divider">
              <span>hoặc</span>
            </div>

            {/* Google Login Button */}
            <div id="google-signin-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>
            
            {/* Fallback button if GSI doesn't render */}
           

            <div className="auth-footer">
              <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
              <Link to="/" className="back-home">← Về trang chủ</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image Introduction */}
      <div className="auth-right">
        <div className="auth-intro-image">
          <img src={introImage} alt="30Shine Premium Barbershop" className="intro-photo" />
          <div className="intro-image-overlay">
            <div className="intro-overlay-content">
              <p className="intro-tagline">PREMIUM HAIR SALON</p>
              <h2>Chào mừng đến <span>30Shine</span></h2>
              <p className="intro-desc">
                Hệ thống salon tóc nam hàng đầu Việt Nam với hơn 100 chi nhánh trên toàn quốc.
              </p>
              <div className="intro-stats-row">
                <div className="intro-stat">
                  <strong>500+</strong>
                  <span>Stylist</span>
                </div>
                <div className="intro-stat-divider"></div>
                <div className="intro-stat">
                  <strong>100+</strong>
                  <span>Chi nhánh</span>
                </div>
                <div className="intro-stat-divider"></div>
                <div className="intro-stat">
                  <strong>2M+</strong>
                  <span>Khách hàng</span>
                </div>
                <div className="intro-stat-divider"></div>
                <div className="intro-stat">
                  <strong>4.8</strong>
                  <span>Đánh giá</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
