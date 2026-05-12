import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authApi } from '../utils/api';

declare global {
  interface Window {
    google?: any;
  }
}

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '', gender: 'Nam', birthDate: ''
  });

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
      setError(err.message || 'Đăng ký Google thất bại!');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signup-btn'),
          { 
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: 'signup_with',
            shape: 'rectangular',
            width: '100%',
          }
        );
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [handleGoogleResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp!'); return;
    }
    setLoading(true); setError('');
    try {
      await authApi.register({
        hoTen: formData.fullName, soDienThoai: formData.phone, email: formData.email,
        matKhau: formData.password, gioiTinh: formData.gender, ngaySinh: formData.birthDate || null,
      });
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại!');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      {/* Left Side - Store Introduction */}
      <div className="auth-right">
        <div className="auth-intro">
          <div className="auth-intro-logo">💈</div>
          <p className="auth-intro-subtitle">Premium Hair Salon</p>
          <h2>Tham gia <span>30Shine</span></h2>
          <p className="auth-intro-desc">
            Đăng ký tài khoản để trải nghiệm dịch vụ đặt lịch nhanh chóng, 
            tích điểm thành viên, và nhận ưu đãi độc quyền từ hệ thống salon tóc nam hàng đầu Việt Nam.
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">📅</div>
              <div className="auth-feature-text">
                <strong>Đặt lịch online 24/7</strong>
                <span>Chọn thời gian, chi nhánh phù hợp</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🎁</div>
              <div className="auth-feature-text">
                <strong>Tích điểm nhận ưu đãi</strong>
                <span>Mỗi dịch vụ đều được cộng điểm</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">💎</div>
              <div className="auth-feature-text">
                <strong>Nâng hạng thành viên</strong>
                <span>Bạc → Vàng → Kim Cương</span>
              </div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔔</div>
              <div className="auth-feature-text">
                <strong>Thông báo khuyến mãi</strong>
                <span>Không bỏ lỡ deal hot nào</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="auth-left">
        <div className="auth-box register-box">
          <div className="auth-header">
            <h1>💈 30Shine</h1>
            <h2>Đăng Ký Tài Khoản</h2>
            <p>Tạo tài khoản để đặt lịch dễ dàng hơn</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input type="text" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option>Nam</option>
                  <option>Nữ</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" placeholder="0901234567" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Mật khẩu *</label>
                <input type="password" placeholder="Tối thiểu 6 ký tự" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required minLength={6} />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu *</label>
                <input type="password" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a></span>
              </label>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
            
            <div className="auth-divider"><span>hoặc</span></div>
            
            {/* Google Sign-up Button */}
            <div id="google-signup-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>
            
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
              Đăng ký với Google
            </button>

            <div className="auth-footer">
              <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
              <Link to="/" className="back-home">← Về trang chủ</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
