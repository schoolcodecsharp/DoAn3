import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'Nam',
    birthDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    // Giả lập đăng ký thành công
    alert('Đăng ký thành công!');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <div className="auth-header">
          <h1>💈 30Shine</h1>
          <h2>Đăng Ký Tài Khoản</h2>
          <p>Tạo tài khoản để đặt lịch dễ dàng hơn</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>Nam</option>
                <option>Nữ</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu *</label>
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu *</label>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>Tôi đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a></span>
            </label>
          </div>

          <button type="submit" className="btn-submit">Đăng ký</button>

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
            <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
            <Link to="/" className="back-home">← Về trang chủ</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
