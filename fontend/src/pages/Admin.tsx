import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Admin.css';
import { dichVuApi, nhanVienApi, chiNhanhApi, khachHangApi, datLichApi, khuyenMaiApi } from '../utils/api';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentEntity, setCurrentEntity] = useState<string>('');

  // State cho dữ liệu từ localStorage
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);

  // Form data
  const [formData, setFormData] = useState<any>({});

  // Search states
  const [searchService, setSearchService] = useState('');
  const [searchStaff, setSearchStaff] = useState('');
  const [searchCustomer, setSearchCustomer] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [searchBooking, setSearchBooking] = useState('');
  const [searchPromo, setSearchPromo] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  // Load dữ liệu từ localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const safeCall = async (fn: () => Promise<any>, fallback: any = []) => {
      try { return await fn(); } catch { return fallback; }
    };
    const [sv, st, cus, br, bk, pr] = await Promise.all([
      safeCall(() => dichVuApi.getAll()),
      safeCall(() => nhanVienApi.getAll()),
      safeCall(() => khachHangApi.getAll()),
      safeCall(() => chiNhanhApi.getAll()),
      safeCall(() => datLichApi.getAll({})),
      safeCall(() => khuyenMaiApi.getAll()),
    ]);
    setServices(sv); setStaff(st); setCustomers(cus);
    setBranches(br); setBookings(bk); setPromotions(pr);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    if (currentEntity === 'service') {
      if (modalType === 'add') {
        const maDV = 'DV' + String(services.length + 1).padStart(3, '0');
        await dichVuApi.create({ maDichVu: maDV, tenDichVu: formData.tenDichVu, danhMuc: formData.danhMuc, moTa: formData.moTa || '', gia: Number(formData.gia), thoiGianPhut: Number(formData.thoiGian), diemThuong: Number(formData.diemThuong || 0) });
        alert('Thêm dịch vụ thành công!');
      } else {
        await dichVuApi.update(formData.maDichVu || formData.MaDichVu, { tenDichVu: formData.tenDichVu || formData.TenDichVu, danhMuc: formData.danhMuc || formData.DanhMuc, moTa: formData.moTa || formData.MoTa || '', gia: Number(formData.gia || formData.Gia), thoiGianPhut: Number(formData.thoiGian || formData.ThoiGianPhut), diemThuong: Number(formData.diemThuong || formData.DiemThuong || 0) });
        alert('Cập nhật dịch vụ thành công!');
      }
      loadData();
    } else if (currentEntity === 'staff') {
      if (modalType === 'add') {
        const maNV = 'NV' + String(staff.length + 1).padStart(3, '0');
        await nhanVienApi.create({ maNhanVien: maNV, maChiNhanh: formData.maChiNhanh, hoTen: formData.hoTen, gioiTinh: formData.gioiTinh || 'Nam', soDienThoai: formData.soDienThoai, email: formData.email || '', chucVu: formData.chucVu, luongCoBan: Number(formData.luong), matKhau: '123456' });
        alert('Thêm nhân viên thành công!');
      } else {
        await nhanVienApi.update(formData.maNhanVien || formData.MaNhanVien, { maChiNhanh: formData.maChiNhanh || formData.MaChiNhanh, hoTen: formData.hoTen || formData.HoTen, gioiTinh: formData.gioiTinh || formData.GioiTinh, soDienThoai: formData.soDienThoai || formData.SoDienThoai, email: formData.email || formData.Email || '', chucVu: formData.chucVu || formData.ChucVu, luongCoBan: Number(formData.luong || formData.LuongCoBan), trangThai: formData.trangThai === 'Đang làm' ? 1 : 0 });
        alert('Cập nhật nhân viên thành công!');
      }
      loadData();
    } else if (currentEntity === 'branch') {
      if (modalType === 'add') {
        const maCN = 'CN' + String(branches.length + 1).padStart(3, '0');
        await chiNhanhApi.create({ maChiNhanh: maCN, tenChiNhanh: formData.tenChiNhanh, diaChi: formData.diaChi, tinhThanh: formData.tinhThanh || 'Hà Nội', soDienThoai: formData.soDienThoai, email: formData.email || '', gioMoCua: formData.gioMoCua?.split(' - ')[0] || '08:00', gioDongCua: formData.gioMoCua?.split(' - ')[1] || '21:00' });
        alert('Thêm chi nhánh thành công!');
      } else {
        await chiNhanhApi.update(formData.maChiNhanh || formData.MaChiNhanh, { tenChiNhanh: formData.tenChiNhanh || formData.TenChiNhanh, diaChi: formData.diaChi || formData.DiaChi, tinhThanh: formData.tinhThanh || formData.TinhThanh || 'Hà Nội', soDienThoai: formData.soDienThoai || formData.SoDienThoai, email: formData.email || formData.Email || '', gioMoCua: (formData.gioMoCua || formData.GioMoCua || '08:00').split(' - ')[0], gioDongCua: (formData.gioMoCua || formData.GioDongCua || '21:00').split(' - ').pop(), trangThai: formData.trangThai === 'Hoạt động' ? 1 : 0 });
        alert('Cập nhật chi nhánh thành công!');
      }
      loadData();
    } else if (currentEntity === 'customer') {
      if (modalType === 'add') {
        await khachHangApi.create({ soDienThoai: formData.soDienThoai, hoTen: formData.hoTen, gioiTinh: formData.gioiTinh || 'Nam', email: formData.email || '', matKhau: formData.matKhau || '123456' });
        alert('Thêm khách hàng thành công!');
      } else {
        await khachHangApi.update(formData.soDienThoai, { hoTen: formData.hoTen, gioiTinh: formData.gioiTinh || 'Nam', email: formData.email || '' });
        alert('Cập nhật khách hàng thành công!');
      }
      loadData();
    } else if (currentEntity === 'promotion') {
      if (modalType === 'add') {
        await khuyenMaiApi.create({
          maCode: formData.maCode,
          tenKhuyenMai: formData.tenKhuyenMai,
          loaiGiam: formData.loaiGiam || 'PhanTram',
          giaTriGiam: Number(formData.giaTriGiam),
          giaTriToiDa: formData.giaTriToiDa ? Number(formData.giaTriToiDa) : null,
          donHangToiThieu: formData.donHangToiThieu ? Number(formData.donHangToiThieu) : 0,
          soLanToiDa: formData.soLanToiDa ? Number(formData.soLanToiDa) : 100,
          ngayBatDau: formData.ngayBatDau,
          ngayKetThuc: formData.ngayKetThuc,
        });
        alert('Thêm khuyến mãi thành công!');
      } else {
        await khuyenMaiApi.update(formData.maCode, {
          tenKhuyenMai: formData.tenKhuyenMai,
          loaiGiam: formData.loaiGiam || 'PhanTram',
          giaTriGiam: Number(formData.giaTriGiam),
          giaTriToiDa: formData.giaTriToiDa ? Number(formData.giaTriToiDa) : null,
          donHangToiThieu: formData.donHangToiThieu ? Number(formData.donHangToiThieu) : 0,
          soLanToiDa: formData.soLanToiDa ? Number(formData.soLanToiDa) : 100,
          ngayBatDau: formData.ngayBatDau,
          ngayKetThuc: formData.ngayKetThuc,
          trangThai: formData.trangThai === 'true' || formData.trangThai === true,
        });
        alert('Cập nhật khuyến mãi thành công!');
      }
      loadData();
    } else if (currentEntity === 'product') {
      if (modalType === 'add') {
        const maSP = 'SP' + String(products.length + 1).padStart(3, '0');
        await sanPhamApi.create({ maSanPham: maSP, maChiNhanh: formData.maChiNhanh, tenSanPham: formData.tenSanPham, thuongHieu: formData.thuongHieu || '', danhMuc: formData.danhMuc || '', giaNhap: Number(formData.giaNhap), giaBan: Number(formData.giaBan), soLuong: Number(formData.soLuong || 0), soLuongToiThieu: Number(formData.soLuongToiThieu || 5) });
        alert('Thêm sản phẩm thành công!');
      } else {
        await sanPhamApi.update(formData.maSanPham, formData.maChiNhanh, { tenSanPham: formData.tenSanPham, thuongHieu: formData.thuongHieu, danhMuc: formData.danhMuc, giaNhap: Number(formData.giaNhap), giaBan: Number(formData.giaBan), soLuong: Number(formData.soLuong), soLuongToiThieu: Number(formData.soLuongToiThieu || 5), trangThai: true });
        alert('Cập nhật sản phẩm thành công!');
      }
      loadData();
    }
    } catch (err: any) { alert('Lỗi: ' + err.message); }
    closeModal();
  };

  const handleDelete = async (entity: string, id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    try {
      if (entity === 'service') { await dichVuApi.delete(id); alert('Xóa dịch vụ thành công!'); }
      else if (entity === 'staff') { await nhanVienApi.delete(id); alert('Xóa nhân viên thành công!'); }
      else if (entity === 'customer') { await khachHangApi.delete(id); alert('Xóa khách hàng thành công!'); }
      else if (entity === 'branch') { await chiNhanhApi.delete(id); alert('Xóa chi nhánh thành công!'); }
      else if (entity === 'promotion') { await khuyenMaiApi.delete(id); alert('Xóa khuyến mãi thành công!'); }
      loadData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
  };

  const handleSearch = async (entity: string, keyword: string) => {
    try {
      if (entity === 'service') { setSearchService(keyword); setServices(await dichVuApi.getAll(keyword)); }
      else if (entity === 'staff') { setSearchStaff(keyword); setStaff(await nhanVienApi.getAll(keyword)); }
      else if (entity === 'customer') { setSearchCustomer(keyword); setCustomers(await khachHangApi.getAll(keyword)); }
      else if (entity === 'branch') { setSearchBranch(keyword); setBranches(await chiNhanhApi.getAll(keyword)); }
      else if (entity === 'booking') { setSearchBooking(keyword); setBookings(await datLichApi.getAll({ search: keyword })); }
      else if (entity === 'promo') { setSearchPromo(keyword); setPromotions(await khuyenMaiApi.getAll(keyword)); }
    } catch (err) { console.error(err); }
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
            <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>📦 Sản phẩm tồn kho</button>
            <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>📈 Báo cáo</button>
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
                 activeTab === 'products' ? 'Sản Phẩm Tồn Kho' :
                 activeTab === 'reports' ? 'Báo Cáo & Thống Kê' :
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
                    <div className="stat-icon orange">📋</div>
                    <div className="stat-info">
                      <h3>Tổng Đặt Lịch</h3>
                      <p className="stat-number">{bookings.length}</p>
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
                    <div className="stat-icon purple">👤</div>
                    <div className="stat-info">
                      <h3>Khách Hàng</h3>
                      <p className="stat-number">{customers.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="services-section" style={{background: 'black', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'service')}>+ Thêm dịch vụ mới</button>
                  <input type="text" placeholder="🔍 Tìm kiếm dịch vụ..." value={searchService} onChange={e => handleSearch('service', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #ddd',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
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
                    {services.map((service: any) => (
                      <tr key={service.MaDichVu || service.maDichVu}>
                        <td>{service.MaDichVu || service.maDichVu}</td>
                        <td>{service.TenDichVu || service.tenDichVu}</td>
                        <td>{service.DanhMuc || service.danhMuc}</td>
                        <td>{(service.Gia || service.gia || 0).toLocaleString()}đ</td>
                        <td>{service.ThoiGianPhut || service.thoiGianPhut} phút</td>
                        <td>{service.DiemThuong || service.diemThuong}</td>
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
              <div className="staff-section" style={{background: 'black', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'staff')}>+ Thêm nhân viên</button>
                  <input type="text" placeholder="🔍 Tìm kiếm nhân viên..." value={searchStaff} onChange={e => handleSearch('staff', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #ddd',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
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
              <div className="customers-section" style={{background: 'black', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'customer')}>+ Thêm khách hàng</button>
                  <input type="text" placeholder="🔍 Tìm kiếm khách hàng..." value={searchCustomer} onChange={e => handleSearch('customer', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #ddd',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SĐT</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Giới tính</th>
                      <th>Hạng TV</th>
                      <th>Điểm</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer: any) => {
                      const sdt = customer.soDienThoai;
                      const h = customer.hangThanhVien ?? 0;
                      const hangTV = ['Thường', 'Bạc', 'Vàng', 'Kim cương'][h];
                      return (
                        <tr key={sdt}>
                          <td>{sdt}</td>
                          <td>{customer.hoTen}</td>
                          <td>{customer.email}</td>
                          <td>{customer.gioiTinh}</td>
                          <td><span className={`badge ${h >= 2 ? 'active' : h === 1 ? 'silver' : 'normal'}`}>{hangTV}</span></td>
                          <td>{customer.diemTichLuy}</td>
                          <td>
                            <button className="btn-action" onClick={() => openModal('edit', 'customer', customer)}>Sửa</button>
                            <button className="btn-action danger" onClick={() => handleDelete('customer', sdt)}>Xóa</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'branches' && (
              <div className="branches-section" style={{background: 'black', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'branch')}>+ Thêm chi nhánh</button>
                  <input type="text" placeholder="🔍 Tìm kiếm chi nhánh..." value={searchBranch} onChange={e => handleSearch('branch', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #ddd',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
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
                    {branches.map((branch: any) => (
                      <tr key={branch.MaChiNhanh || branch.maChiNhanh}>
                        <td>{branch.MaChiNhanh || branch.maChiNhanh}</td>
                        <td>{branch.TenChiNhanh || branch.tenChiNhanh}</td>
                        <td>{branch.DiaChi || branch.diaChi}</td>
                        <td>{branch.SoDienThoai || branch.soDienThoai}</td>
                        <td>{branch.GioMoCua || branch.gioMoCua} - {branch.GioDongCua || branch.gioDongCua}</td>
                        <td><span className="badge active">{(branch.TrangThai ?? branch.trangThai) ? 'Hoạt động' : 'Đóng'}</span></td>
                        <td>
                          <button className="btn-action" onClick={() => openModal('edit', 'branch', branch)}>Sửa</button>
                          <button className="btn-action danger" onClick={() => handleDelete('branch', branch.MaChiNhanh || branch.maChiNhanh)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div style={{background: '#242426', padding: '2rem', borderRadius: '8px', border: '1px solid #3f3f46'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <h3 style={{color: '#D4AF37', fontSize: '1.1rem', margin:0}}>📅 Tất cả lịch hẹn ({bookings.length})</h3>
                  <input type="text" placeholder="🔍 Tìm kiếm lịch hẹn..." value={searchBooking} onChange={e => handleSearch('booking', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #555',background:'#1a1a1c',color:'white',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>SĐT Khách</th>
                      <th>Chi nhánh</th>
                      <th>Nhân viên</th>
                      <th>Thời gian hẹn</th>
                      <th>Nguồn</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking: any) => {
                      const trangThai = booking.TrangThai || booking.trangThai;
                      const statusMap: Record<string, {text: string; color: string}> = {
                        'ChoXacNhan': {text: 'Chờ xác nhận', color: '#fbbf24'},
                        'DaXacNhan': {text: 'Đã xác nhận', color: '#60a5fa'},
                        'DangPhucVu': {text: 'Đang phục vụ', color: '#a78bfa'},
                        'HoanThanh': {text: 'Hoàn thành', color: '#22c55e'},
                        'DaHuy': {text: 'Đã hủy', color: '#f87171'}
                      };
                      const status = statusMap[trangThai] || {text: trangThai, color: '#a1a1aa'};
                      const maDL = booking.MaDatLich || booking.maDatLich;
                      return (
                        <tr key={maDL}>
                          <td>{maDL}</td>
                          <td>{booking.SoDienThoai || booking.soDienThoai}</td>
                          <td>{booking.tenChiNhanh || booking.TenChiNhanh || booking.maChiNhanh || booking.MaChiNhanh}</td>
                          <td>{booking.tenNhanVien || booking.TenNhanVien || 'Chưa chọn'}</td>
                          <td>{new Date(booking.ThoiGianHen || booking.thoiGianHen).toLocaleString('vi-VN')}</td>
                          <td>{booking.NguonDatLich || booking.nguonDatLich}</td>
                          <td><span style={{padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: `${status.color}20`, color: status.color}}>{status.text}</span></td>
                          <td>
                            {trangThai === 'ChoXacNhan' && (
                              <button className="btn-action" onClick={async () => { await datLichApi.updateStatus(maDL, 'DaXacNhan'); loadData(); }}>Xác nhận</button>
                            )}
                            {trangThai === 'DaXacNhan' && (
                              <button className="btn-action" style={{background:'#a78bfa20',color:'#a78bfa'}} onClick={async () => { await datLichApi.updateStatus(maDL, 'DangPhucVu'); loadData(); }}>Phục vụ</button>
                            )}
                            {trangThai === 'DangPhucVu' && (
                              <button className="btn-action" style={{background:'#22c55e20',color:'#22c55e'}} onClick={async () => { await datLichApi.updateStatus(maDL, 'HoanThanh'); loadData(); }}>Hoàn thành</button>
                            )}
                            {trangThai !== 'DaHuy' && trangThai !== 'HoanThanh' && (
                              <button className="btn-action danger" onClick={async () => { await datLichApi.updateStatus(maDL, 'DaHuy'); loadData(); }}>Hủy</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'promotions' && (
              <div style={{background: '#242426', padding: '2rem', borderRadius: '8px', border: '1px solid #3f3f46'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'promotion')}>+ Thêm khuyến mãi</button>
                  <input type="text" placeholder="🔍 Tìm khuyến mãi..." value={searchPromo} onChange={e => handleSearch('promo', e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #555',background:'#1a1a1c',color:'white',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã Code</th>
                      <th>Tên KM</th>
                      <th>Loại giảm</th>
                      <th>Giá trị</th>
                      <th>Đơn tối thiểu</th>
                      <th>Đã dùng</th>
                      <th>Thời hạn</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map((promo) => (
                      <tr key={promo.maCode}>
                        <td style={{color: '#D4AF37', fontWeight: 700}}>{promo.maCode}</td>
                        <td>{promo.tenKhuyenMai}</td>
                        <td>{promo.loaiGiam === 'PhanTram' ? 'Phần trăm' : 'Số tiền'}</td>
                        <td style={{color: '#22c55e', fontWeight: 600}}>{promo.loaiGiam === 'PhanTram' ? `${promo.giaTriGiam}%` : `${(promo.giaTriGiam || 0).toLocaleString()}đ`}</td>
                        <td>{(promo.donHangToiThieu || 0).toLocaleString()}đ</td>
                        <td>{promo.soLanDung}/{promo.soLanToiDa}</td>
                        <td>{promo.ngayBatDau ? new Date(promo.ngayBatDau).toLocaleDateString('vi-VN') : ''} → {promo.ngayKetThuc ? new Date(promo.ngayKetThuc).toLocaleDateString('vi-VN') : ''}</td>
                        <td><span className={`badge ${promo.trangThai ? 'active' : ''}`}>{promo.trangThai ? 'Hoạt động' : 'Hết hạn'}</span></td>
                        <td>
                          <button className="btn-action" onClick={() => openModal('edit', 'promotion', {
                            maCode: promo.maCode,
                            tenKhuyenMai: promo.tenKhuyenMai,
                            loaiGiam: promo.loaiGiam,
                            giaTriGiam: promo.giaTriGiam,
                            giaTriToiDa: promo.giaTriToiDa,
                            donHangToiThieu: promo.donHangToiThieu,
                            soLanToiDa: promo.soLanToiDa,
                            ngayBatDau: promo.ngayBatDau ? promo.ngayBatDau.split('T')[0] : '',
                            ngayKetThuc: promo.ngayKetThuc ? promo.ngayKetThuc.split('T')[0] : '',
                            trangThai: promo.trangThai,
                          })}>Sửa</button>
                          <button className="btn-action danger" onClick={() => handleDelete('promotion', promo.maCode)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div style={{background:'#242426',padding:'2rem',borderRadius:'8px',border:'1px solid #3f3f46'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',gap:'1rem',flexWrap:'wrap'}}>
                  <button className="btn-add" onClick={() => openModal('add', 'product')}>+ Thêm sản phẩm</button>
                  <input type="text" placeholder="🔍 Tìm sản phẩm..." value={searchProduct} onChange={e => { setSearchProduct(e.target.value); sanPhamApi.getAll({search:e.target.value}).then(setProducts).catch(()=>{}); }} style={{padding:'0.6rem 1rem',borderRadius:'8px',border:'1px solid #555',background:'#1a1a1c',color:'white',minWidth:'250px',fontSize:'0.9rem'}} />
                </div>
                {lowStockItems.length > 0 && (
                  <div style={{background:'#7f1d1d20',border:'1px solid #f87171',borderRadius:'8px',padding:'1rem',marginBottom:'1rem'}}>
                    <h4 style={{color:'#f87171',margin:'0 0 0.5rem'}}>⚠️ Cảnh báo tồn kho thấp ({lowStockItems.length} sản phẩm)</h4>
                    {lowStockItems.map((item:any) => (
                      <p key={item.maSanPham+item.maChiNhanh} style={{margin:'2px 0',fontSize:'0.85rem',color:'#fca5a5'}}>
                        {item.tenSanPham} ({item.tenChiNhanh}) - Còn: <strong>{item.soLuong}</strong> / Tối thiểu: {item.soLuongToiThieu}
                      </p>
                    ))}
                  </div>
                )}
                <table className="data-table">
                  <thead><tr><th>Mã SP</th><th>Tên</th><th>Thương hiệu</th><th>Chi nhánh</th><th>Giá nhập</th><th>Giá bán</th><th>SL</th><th>Thao tác</th></tr></thead>
                  <tbody>
                    {products.map((p:any) => (
                      <tr key={p.maSanPham+(p.maChiNhanh||'')} style={p.soLuong<=p.soLuongToiThieu?{background:'#7f1d1d20'}:{}}>
                        <td>{p.maSanPham}</td>
                        <td>{p.tenSanPham}</td>
                        <td>{p.thuongHieu}</td>
                        <td>{p.tenChiNhanh||p.maChiNhanh}</td>
                        <td>{(p.giaNhap||0).toLocaleString()}đ</td>
                        <td>{(p.giaBan||0).toLocaleString()}đ</td>
                        <td style={p.soLuong<=p.soLuongToiThieu?{color:'#f87171',fontWeight:700}:{}}>{p.soLuong}{p.soLuong<=p.soLuongToiThieu?' ⚠️':''}</td>
                        <td>
                          <button className="btn-action" onClick={() => openModal('edit','product',p)}>Sửa</button>
                          <button className="btn-action danger" onClick={async () => { if(confirm('Xóa?')){ await sanPhamApi.delete(p.maSanPham,p.maChiNhanh); loadData(); }}}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reports' && (
              <div style={{display:'grid',gap:'1.5rem'}}>
                {/* Đánh giá trung bình */}
                {avgRatings && (
                  <div style={{background:'#242426',padding:'1.5rem',borderRadius:'8px',border:'1px solid #3f3f46'}}>
                    <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>⭐ Đánh giá trung bình ({avgRatings.tongDanhGia} đánh giá)</h3>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
                      <div style={{textAlign:'center'}}><p style={{fontSize:'2rem',fontWeight:700,color:'#fbbf24'}}>{(avgRatings.saoDichVuTB||0).toFixed(1)}</p><p style={{color:'#a1a1aa',fontSize:'0.85rem'}}>Dịch vụ</p></div>
                      <div style={{textAlign:'center'}}><p style={{fontSize:'2rem',fontWeight:700,color:'#60a5fa'}}>{(avgRatings.saoNhanVienTB||0).toFixed(1)}</p><p style={{color:'#a1a1aa',fontSize:'0.85rem'}}>Nhân viên</p></div>
                      <div style={{textAlign:'center'}}><p style={{fontSize:'2rem',fontWeight:700,color:'#22c55e'}}>{(avgRatings.saoCuaHangTB||0).toFixed(1)}</p><p style={{color:'#a1a1aa',fontSize:'0.85rem'}}>Cửa hàng</p></div>
                    </div>
                  </div>
                )}
                {/* NV phục vụ nhiều nhất */}
                <div style={{background:'#242426',padding:'1.5rem',borderRadius:'8px',border:'1px solid #3f3f46'}}>
                  <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>🏆 Nhân viên phục vụ nhiều nhất</h3>
                  <table className="data-table"><thead><tr><th>Mã NV</th><th>Họ tên</th><th>Chức vụ</th><th>Số lượt</th><th>Doanh thu</th></tr></thead>
                    <tbody>{topStaff.map((s:any) => (<tr key={s.maNhanVien}><td>{s.maNhanVien}</td><td>{s.hoTen}</td><td>{s.chucVu}</td><td style={{color:'#D4AF37',fontWeight:600}}>{s.soLuotPhucVu}</td><td style={{color:'#22c55e',fontWeight:600}}>{(s.tongDoanhThu||0).toLocaleString()}đ</td></tr>))}</tbody>
                  </table>
                </div>
                {/* KH theo hạng TV */}
                <div style={{background:'#242426',padding:'1.5rem',borderRadius:'8px',border:'1px solid #3f3f46'}}>
                  <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>👥 Khách hàng theo hạng thành viên</h3>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
                    {customerTiers.map((t:any) => (
                      <div key={t.hangThanhVien} style={{textAlign:'center',background:'#18181b',padding:'1rem',borderRadius:'8px'}}>
                        <p style={{fontSize:'1.8rem',fontWeight:700,color:'#D4AF37'}}>{t.soLuong}</p>
                        <p style={{color:'#a1a1aa',fontSize:'0.85rem'}}>{t.tenHang}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Doanh thu theo chi nhánh */}
                <div style={{background:'#242426',padding:'1.5rem',borderRadius:'8px',border:'1px solid #3f3f46'}}>
                  <h3 style={{color:'#D4AF37',marginBottom:'1rem'}}>🏢 Doanh thu theo chi nhánh</h3>
                  <table className="data-table"><thead><tr><th>Chi nhánh</th><th>Số đơn</th><th>Doanh thu</th></tr></thead>
                    <tbody>{revByBranch.map((b:any) => (<tr key={b.maChiNhanh}><td>{b.tenChiNhanh}</td><td>{b.soDon}</td><td style={{color:'#22c55e',fontWeight:600}}>{(b.doanhThu||0).toLocaleString()}đ</td></tr>))}</tbody>
                  </table>
                </div>
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
                currentEntity === 'customer' ? 'Khách hàng' :
                currentEntity === 'branch' ? 'Chi nhánh' :
                currentEntity === 'promotion' ? 'Khuyến mãi' : ''
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

              {currentEntity === 'customer' && (
                <>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input type="tel" name="soDienThoai" value={formData.soDienThoai || ''} onChange={handleInputChange} required disabled={modalType === 'edit'} />
                  </div>
                  <div className="form-group">
                    <label>Họ tên *</label>
                    <input type="text" name="hoTen" value={formData.hoTen || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giới tính</label>
                      <select name="gioiTinh" value={formData.gioiTinh || 'Nam'} onChange={handleInputChange}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  {modalType === 'add' && (
                    <div className="form-group">
                      <label>Mật khẩu *</label>
                      <input type="password" name="matKhau" value={formData.matKhau || ''} onChange={handleInputChange} required />
                    </div>
                  )}
                </>
              )}

              {currentEntity === 'promotion' && (
                <>
                  {modalType === 'add' && (
                    <div className="form-group">
                      <label>Mã Code *</label>
                      <input type="text" name="maCode" value={formData.maCode || ''} onChange={handleInputChange} placeholder="VD: SALE10, SUMMER2025" required />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Tên khuyến mãi *</label>
                    <input type="text" name="tenKhuyenMai" value={formData.tenKhuyenMai || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Loại giảm *</label>
                      <select name="loaiGiam" value={formData.loaiGiam || 'PhanTram'} onChange={handleInputChange} required>
                        <option value="PhanTram">Phần trăm (%)</option>
                        <option value="SoTien">Số tiền (VNĐ)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Giá trị giảm *</label>
                      <input type="number" name="giaTriGiam" value={formData.giaTriGiam || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giá trị tối đa (VNĐ)</label>
                      <input type="number" name="giaTriToiDa" value={formData.giaTriToiDa || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Đơn hàng tối thiểu (VNĐ)</label>
                      <input type="number" name="donHangToiThieu" value={formData.donHangToiThieu || ''} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Số lần tối đa</label>
                      <input type="number" name="soLanToiDa" value={formData.soLanToiDa || 100} onChange={handleInputChange} />
                    </div>
                    {modalType === 'edit' && (
                      <div className="form-group">
                        <label>Trạng thái</label>
                        <select name="trangThai" value={String(formData.trangThai ?? true)} onChange={handleInputChange}>
                          <option value="true">Hoạt động</option>
                          <option value="false">Hết hạn</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ngày bắt đầu *</label>
                      <input type="date" name="ngayBatDau" value={formData.ngayBatDau || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Ngày kết thúc *</label>
                      <input type="date" name="ngayKetThuc" value={formData.ngayKetThuc || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                </>
              )}

              {currentEntity === 'product' && (
                <>
                  <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input type="text" name="tenSanPham" value={formData.tenSanPham || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Thương hiệu</label>
                      <input type="text" name="thuongHieu" value={formData.thuongHieu || ''} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>Danh mục</label>
                      <input type="text" name="danhMuc" value={formData.danhMuc || ''} onChange={handleInputChange} placeholder="VD: Sáp, Dầu gội..." />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Chi nhánh *</label>
                    <select name="maChiNhanh" value={formData.maChiNhanh || ''} onChange={handleInputChange} required disabled={modalType === 'edit'}>
                      <option value="">-- Chọn chi nhánh --</option>
                      {branches.map(b => <option key={b.maChiNhanh} value={b.maChiNhanh}>{b.tenChiNhanh}</option>)}
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Giá nhập (VNĐ) *</label>
                      <input type="number" name="giaNhap" value={formData.giaNhap || ''} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label>Giá bán (VNĐ) *</label>
                      <input type="number" name="giaBan" value={formData.giaBan || ''} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Số lượng</label>
                      <input type="number" name="soLuong" value={formData.soLuong || 0} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>SL tối thiểu (cảnh báo)</label>
                      <input type="number" name="soLuongToiThieu" value={formData.soLuongToiThieu || 5} onChange={handleInputChange} />
                    </div>
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
