import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authApi } from '../utils/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await authApi.login(formData.phone, formData.password);
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        const role = result.user.VaiTro;
        if (role === 'admin') navigate('/admin');
        else if (role === 'staff') navigate('/staff');
        else navigate('/user');
      }
    } catch (err: any) {
      setError(err.message || 'Sai số điện thoại hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: string) => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'staff') {
      navigate('/staff');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>💈 30Shine</h1>
          <h2>Đăng Nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        {error && <div style={{background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem'}}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số điện thoại / Tài khoản</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại hoặc tài khoản"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <div className="auth-divider">
            <span>Đăng nhập nhanh theo vai trò</span>
          </div>

          <div className="role-buttons">
            <button type="button" className="btn-role admin" onClick={() => handleQuickLogin('admin')}>
              <span className="role-icon">⚙️</span>
              <div className="role-info">
                <strong>Admin</strong>
                <span>Quản trị hệ thống</span>
              </div>
            </button>
            <button type="button" className="btn-role staff" onClick={() => handleQuickLogin('staff')}>
              <span className="role-icon">👨‍💼</span>
              <div className="role-info">
                <strong>Nhân viên</strong>
                <span>Stylist / Lễ tân</span>
              </div>
            </button>
            <button type="button" className="btn-role user" onClick={() => handleQuickLogin('user')}>
              <span className="role-icon">👤</span>
              <div className="role-info">
                <strong>Khách hàng</strong>
                <span>Đặt lịch & Dịch vụ</span>
              </div>
            </button>
          </div>

          <div className="auth-footer">
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            <Link to="/" className="back-home">← Về trang chủ</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
