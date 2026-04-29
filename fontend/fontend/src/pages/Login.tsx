import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập đăng nhập
    if (formData.phone === 'admin' && formData.password === 'admin') {
      navigate('/admin');
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

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại"
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

          <button type="submit" className="btn-submit">Đăng nhập</button>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button type="button" className="btn-social facebook">
              <span>🔵</span> Facebook
            </button>
            <button type="button" className="btn-social google">
              <span>🔴</span> Google
            </button>
          </div>

          <div className="auth-footer">
            <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
            <Link to="/" className="back-home">← Về trang chủ</Link>
          </div>
        </form>

        <div className="demo-info">
          <p><strong>Demo:</strong> admin/admin (Admin) hoặc bất kỳ (User)</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
