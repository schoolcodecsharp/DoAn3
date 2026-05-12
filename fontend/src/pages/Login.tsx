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
        if (role === 'admin') navigate('/admin');
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
                <option value="user">Người dùng</option>
                <option value="staff">Nhân viên</option>
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
            <button type="button" className="btn-google" onClick={() => {
              if (window.google?.accounts?.id) {
                window.google.accounts.id.prompt();
              } else {
                setError('Google Sign-In chưa sẵn sàng. Vui lòng thử lại sau.');
              }
            }}>
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập với Google
            </button>

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
