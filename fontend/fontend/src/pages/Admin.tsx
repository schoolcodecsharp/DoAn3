import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Admin.css';
import {
  dichVuService,
  nhanVienService,
  chiNhanhService,
  khachHangService,
  generateCode,
  type DichVu,
  type NhanVien,
  type ChiNhanh,
  type KhachHang
} from '../utils/localStorage';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentEntity, setCurrentEntity] = useState<string>('');

  // State cho dữ liệu từ localStorage
  const [services, setServices] = useState<DichVu[]>([]);
  const [staff, setStaff] = useState<NhanVien[]>([]);
  const [customers, setCustomers] = useState<KhachHang[]>([]);
  const [branches, setBranches] = useState<ChiNhanh[]>([]);

  // Form data
  const [formData, setFormData] = useState<any>({});

  // Load dữ liệu từ localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setServices(dichVuService.getAll());
    setStaff(nhanVienService.getAll());
    setCustomers(khachHangService.getAll());
    setBranches(chiNhanhService.getAll());
  };

  const openModal = (type: 'add' | 'edit', entity: string, data?: any) => {
    setModalType(type);
    setCurrentEntity(entity);
    setFormData(data || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (currentEntity === 'service') {
      if (modalType === 'add') {
        const newService: DichVu = {
          maDichVu: generateCode('DV', services, 'maDichVu'),
          tenDichVu: formData.tenDichVu,
          danhMuc: formData.danhMuc,
          moTa: formData.moTa || '',
          gia: Number(formData.gia),
          thoiGianPhut: Number(formData.thoiGian),
          diemThuong: Number(formData.diemThuong || 0),
          trangThai: true,
          ngayTao: new Date().toISOString()
        };
        dichVuService.add(newService);
        alert('Thêm dịch vụ thành công!');
      } else {
        const updatedService: DichVu = {
          ...formData,
          gia: Number(formData.gia),
          thoiGianPhut: Number(formData.thoiGian),
          diemThuong: Number(formData.diemThuong)
        };
        dichVuService.update(formData.maDichVu, updatedService);
        alert('Cập nhật dịch vụ thành công!');
      }
      loadData();
    } else if (currentEntity === 'staff') {
      if (modalType === 'add') {
        const newStaff: NhanVien = {
          maNhanVien: generateCode('NV', staff, 'maNhanVien'),
          maChiNhanh: formData.maChiNhanh,
          hoTen: formData.hoTen,
          gioiTinh: formData.gioiTinh || 'Nam',
          ngaySinh: formData.ngaySinh || '',
          soDienThoai: formData.soDienThoai,
          email: formData.email || '',
          chucVu: formData.chucVu,
          luongCoBan: Number(formData.luong),
          trangThai: formData.trangThai === 'Đang làm',
          ngayVaoLam: new Date().toISOString().split('T')[0],
          matKhau: '123456',
          ngayTao: new Date().toISOString()
        };
        nhanVienService.add(newStaff);
        alert('Thêm nhân viên thành công!');
      } else {
        const updatedStaff: NhanVien = {
          ...formData,
          luongCoBan: Number(formData.luong),
          trangThai: formData.trangThai === 'Đang làm'
        };
        nhanVienService.update(formData.maNhanVien, updatedStaff);
        alert('Cập nhật nhân viên thành công!');
      }
      loadData();
    } else if (currentEntity === 'branch') {
      if (modalType === 'add') {
        const newBranch: ChiNhanh = {
          maChiNhanh: generateCode('CN', branches, 'maChiNhanh'),
          tenChiNhanh: formData.tenChiNhanh,
          diaChi: formData.diaChi,
          tinhThanh: formData.tinhThanh || 'Hà Nội',
          soDienThoai: formData.soDienThoai,
          email: formData.email || '',
          gioMoCua: formData.gioMoCua?.split(' - ')[0] || '08:00',
          gioDongCua: formData.gioMoCua?.split(' - ')[1] || '21:00',
          trangThai: formData.trangThai === 'Hoạt động',
          ngayTao: new Date().toISOString()
        };
        chiNhanhService.add(newBranch);
        alert('Thêm chi nhánh thành công!');
      } else {
        const updatedBranch: ChiNhanh = {
          ...formData,
          gioMoCua: formData.gioMoCua?.split(' - ')[0] || formData.gioMoCua,
          gioDongCua: formData.gioMoCua?.split(' - ')[1] || formData.gioDongCua,
          trangThai: formData.trangThai === 'Hoạt động'
        };
        chiNhanhService.update(formData.maChiNhanh, updatedBranch);
        alert('Cập nhật chi nhánh thành công!');
      }
      loadData();
    }
    
    closeModal();
  };

  const handleDelete = (entity: string, id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    if (entity === 'service') {
      dichVuService.delete(id);
      alert('Xóa dịch vụ thành công!');
    } else if (entity === 'staff') {
      nhanVienService.delete(id);
      alert('Xóa nhân viên thành công!');
    } else if (entity === 'branch') {
      chiNhanhService.delete(id);
      alert('Xóa chi nhánh thành công!');
    }
    loadData();
  };

  return (
    <div className="admin-container">
      <div className="admin-main">
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">💈 30SHINE</div>
            <div className="sidebar-subtitle">Admin Dashboard</div>
          </div>
          <nav className="sidebar-nav">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>📅 Quản lý đặt lịch</button>
            <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>✂️ Quản lý dịch vụ</button>
            <button className={activeTab === 'staff' ? 'active' : ''} onClick={() => setActiveTab('staff')}>👥 Quản lý nhân viên</button>
            <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>👤 Quản lý khách hàng</button>
            <button className={activeTab === 'branches' ? 'active' : ''} onClick={() => setActiveTab('branches')}>🏢 Quản lý chi nhánh</button>
            <button className={activeTab === 'promotions' ? 'active' : ''} onClick={() => setActiveTab('promotions')}>🎁 Khuyến mãi</button>
          </nav>
          <div style={{padding: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
            <Link to="/" className="btn-logout" style={{width: '100%', display: 'block', textAlign: 'center'}}>Đăng xuất</Link>
          </div>
        </aside>

        <main className="admin-content">
          <div className="content-header">
            <h2>{activeTab === 'dashboard' ? 'Bảng Điều Khiển' : 
                 activeTab === 'bookings' ? 'Quản Lý Đặt Lịch' :
                 activeTab === 'services' ? 'Quản Lý Dịch Vụ' :
                 activeTab === 'staff' ? 'Quản Lý Nhân Viên' :
                 activeTab === 'customers' ? 'Quản Lý Khách Hàng' :
                 activeTab === 'branches' ? 'Quản Lý Chi Nhánh' :
                 'Khuyến Mãi'}</h2>
            <div className="header-actions">
              <div className="user-info-header">
                <div className="user-avatar">A</div>
                <span style={{fontWeight: 600}}>Admin</span>
              </div>
            </div>
          </div>

          <div className="content-body">
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon orange">�</div>
                    <div className="stat-info">
                      <h3>Tổng Đơn Hàng</h3>
                      <p className="stat-number">156</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon blue">✂️</div>
                    <div className="stat-info">
                      <h3>Dịch Vụ</h3>
                      <p className="stat-number">{services.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon green">👥</div>
                    <div className="stat-info">
                      <h3>Nhân Viên</h3>
                      <p className="stat-number">{staff.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon purple">💰</div>
                    <div className="stat-info">
                      <h3>Doanh Thu Tháng</h3>
                      <p className="stat-number">45.8M</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="services-section" style={{background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <button className="btn-add" onClick={() => openModal('add', 'service')}>+ Thêm dịch vụ mới</button>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Tên dịch vụ</th>
                      <th>Danh mục</th>
                      <th>Giá</th>
                      <th>Thời gian</th>
                      <th>Điểm thưởng</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.maDichVu}>
                        <td>{service.maDichVu}</td>
                        <td>{service.tenDichVu}</td>
                        <td>{service.danhMuc}</td>
                        <td>{service.gia.toLocaleString()}đ</td>
                        <td>{service.thoiGianPhut} phút</td>
                        <td>{service.diemThuong}</td>
                        <td>
                          <button className="btn-action" onClick={() => openModal('edit', 'service', {...service, thoiGian: service.thoiGianPhut})}>Sửa</button>
                          <button className="btn-action danger" onClick={() => handleDelete('service', service.maDichVu)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="staff-section" style={{background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <button className="btn-add" onClick={() => openModal('add', 'staff')}>+ Thêm nhân viên</button>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Họ tên</th>
                      <th>Chức vụ</th>
                      <th>Chi nhánh</th>
                      <th>SĐT</th>
                      <th>Lương</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => {
                      const branch = branches.find(b => b.maChiNhanh === member.maChiNhanh);
                      return (
                        <tr key={member.maNhanVien}>
                          <td>{member.maNhanVien}</td>
                          <td>{member.hoTen}</td>
                          <td>{member.chucVu}</td>
                          <td>{branch?.tenChiNhanh || member.maChiNhanh}</td>
                          <td>{member.soDienThoai}</td>
                          <td>{member.luongCoBan.toLocaleString()}đ</td>
                          <td><span className="badge active">{member.trangThai ? 'Đang làm' : 'Đã nghỉ'}</span></td>
                          <td>
                            <button className="btn-action" onClick={() => openModal('edit', 'staff', {...member, luong: member.luongCoBan, trangThai: member.trangThai ? 'Đang làm' : 'Đã nghỉ'})}>Sửa</button>
                            <button className="btn-action danger" onClick={() => handleDelete('staff', member.maNhanVien)}>Xóa</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="customers-section" style={{background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SĐT</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Hạng TV</th>
                      <th>Điểm</th>
                      <th>Tổng điểm</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => {
                      const hangTV = ['Thường', 'Bạc', 'Vàng', 'Kim cương'][customer.hangThanhVien];
                      return (
                        <tr key={customer.soDienThoai}>
                          <td>{customer.soDienThoai}</td>
                          <td>{customer.hoTen}</td>
                          <td>{customer.email}</td>
                          <td><span className={`badge ${customer.hangThanhVien === 1 ? 'silver' : 'normal'}`}>{hangTV}</span></td>
                          <td>{customer.diemTichLuy}</td>
                          <td>{customer.tongDiemTich}</td>
                          <td>
                            <button className="btn-action">Chi tiết</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="branches-section" style={{background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <button className="btn-add" onClick={() => openModal('add', 'branch')}>+ Thêm chi nhánh</button>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Tên chi nhánh</th>
                      <th>Địa chỉ</th>
                      <th>SĐT</th>
                      <th>Giờ mở - đóng</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((branch) => (
                      <tr key={branch.maChiNhanh}>
                        <td>{branch.maChiNhanh}</td>
                        <td>{branch.tenChiNhanh}</td>
                        <td>{branch.diaChi}</td>
                        <td>{branch.soDienThoai}</td>
                        <td>{branch.gioMoCua} - {branch.gioDongCua}</td>
                        <td><span className="badge active">{branch.trangThai ? 'Hoạt động' : 'Đóng'}</span></td>
                        <td>
                          <button className="btn-action" onClick={() => openModal('edit', 'branch', {...branch, gioMoCua: `${branch.gioMoCua} - ${branch.gioDongCua}`, trangThai: branch.trangThai ? 'Hoạt động' : 'Đóng'})}>Sửa</button>
                          <button className="btn-action danger" onClick={() => handleDelete('branch', branch.maChiNhanh)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Thêm mới' : 'Chỉnh sửa'} {
                currentEntity === 'service' ? 'Dịch vụ' :
                currentEntity === 'staff' ? 'Nhân viên' :
                currentEntity === 'branch' ? 'Chi nhánh' : ''
              }</h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              {currentEntity === 'service' && (
                <>
                  <div className="form-group">
                    <label>Tên dịch vụ *</label>
                    <input type="text" name="tenDichVu" value={formData.tenDichVu || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Danh mục *</label>
                    <select name="danhMuc" value={formData.danhMuc || ''} onChange={handleInputChange} required>
                      <option value="">-- Chọn danh mục --</option>
                      <option value="Cắt & Tạo kiểu">Cắt & Tạo kiểu</option>
                      <option value="Gội đầu & Massage">Gội đầu & Massage</option>
                      <option value="Nhuộm tóc">Nhuộm tóc</option>
                      <option value="Uốn & Duỗi">Uốn & Duỗi</option>
                      <option value="Chăm sóc tóc">Chăm sóc tóc</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giá (VNĐ) *</label>
                      <input type="number" name="gia" value={formData.gia || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Thời gian (phút) *</label>
                      <input type="number" name="thoiGian" value={formData.thoiGian || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Điểm thưởng</label>
                    <input type="number" name="diemThuong" value={formData.diemThuong || 0} onChange={handleInputChange} />
                  </div>
                </>
              )}

              {currentEntity === 'staff' && (
                <>
                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input type="text" name="hoTen" value={formData.hoTen || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Chức vụ *</label>
                      <select name="chucVu" value={formData.chucVu || ''} onChange={handleInputChange} required>
                        <option value="">-- Chọn chức vụ --</option>
                        <option value="Trainee">Trainee</option>
                        <option value="Stylist">Stylist</option>
                        <option value="Senior Stylist">Senior Stylist</option>
                        <option value="Lễ tân">Lễ tân</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Chi nhánh *</label>
                      <select name="maChiNhanh" value={formData.maChiNhanh || ''} onChange={handleInputChange} required>
                        <option value="">-- Chọn chi nhánh --</option>
                        {branches.map(b => <option key={b.maChiNhanh} value={b.maChiNhanh}>{b.tenChiNhanh}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input type="tel" name="soDienThoai" value={formData.soDienThoai || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Lương cơ bản (VNĐ) *</label>
                      <input type="number" name="luong" value={formData.luong || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select name="trangThai" value={formData.trangThai || 'Đang làm'} onChange={handleInputChange}>
                      <option value="Đang làm">Đang làm</option>
                      <option value="Nghỉ phép">Nghỉ phép</option>
                      <option value="Đã nghỉ">Đã nghỉ</option>
                    </select>
                  </div>
                </>
              )}

              {currentEntity === 'branch' && (
                <>
                  <div className="form-group">
                    <label>Tên chi nhánh *</label>
                    <input type="text" name="tenChiNhanh" value={formData.tenChiNhanh || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ *</label>
                    <input type="text" name="diaChi" value={formData.diaChi || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input type="tel" name="soDienThoai" value={formData.soDienThoai || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Giờ mở - đóng cửa *</label>
                      <input type="text" name="gioMoCua" value={formData.gioMoCua || ''} onChange={handleInputChange} placeholder="08:00 - 21:00" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select name="trangThai" value={formData.trangThai || 'Hoạt động'} onChange={handleInputChange}>
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm đóng">Tạm đóng</option>
                    </select>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-submit-modal">{modalType === 'add' ? 'Thêm mới' : 'Cập nhật'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
