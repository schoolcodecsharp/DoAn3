// ============================================================
// KHỞI TẠO DỮ LIỆU MẪU CHO LOCAL STORAGE
// ============================================================

import {
  chiNhanhService,
  nhanVienService,
  khachHangService,
  dichVuService,
  datLichService,
  chiTietDatLichService,
  hoaDonService,
  chiTietHoaDonService,
  danhGiaService,
  khuyenMaiService,
  type ChiNhanh,
  type NhanVien,
  type KhachHang,
  type DichVu,
  type DatLich,
  type ChiTietDatLich,
  type HoaDon,
  type ChiTietHoaDon,
  type DanhGia,
  type KhuyenMai,
} from './localStorage';

export const initializeSampleData = () => {
  // Kiểm tra đã khởi tạo chưa
  if (chiNhanhService.getAll().length > 0) {
    console.log('Dữ liệu đã được khởi tạo trước đó');
    return;
  }

  console.log('Đang khởi tạo dữ liệu mẫu...');

  // 1. CHI NHÁNH
  const chiNhanhs: ChiNhanh[] = [
    {
      maChiNhanh: 'CN001',
      tenChiNhanh: '30Shine Cầu Giấy',
      diaChi: '72 Cầu Giấy, Dịch Vọng Hậu',
      tinhThanh: 'Hà Nội',
      soDienThoai: '02466889999',
      email: 'caugiay@30shine.com',
      gioMoCua: '08:00',
      gioDongCua: '21:00',
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maChiNhanh: 'CN002',
      tenChiNhanh: '30Shine Hoàng Mai',
      diaChi: '121 Nguyễn Đức Cảnh, Tương Mai',
      tinhThanh: 'Hà Nội',
      soDienThoai: '02466889998',
      email: 'hoangmai@30shine.com',
      gioMoCua: '08:00',
      gioDongCua: '21:00',
      trangThai: true,
      ngayTao: '2024-01-15T00:00:00'
    },
    {
      maChiNhanh: 'CN003',
      tenChiNhanh: '30Shine Bình Thạnh',
      diaChi: '203 Xô Viết Nghệ Tĩnh, P.17',
      tinhThanh: 'TP.HCM',
      soDienThoai: '02866889997',
      email: 'binhthanh@30shine.com',
      gioMoCua: '08:00',
      gioDongCua: '21:00',
      trangThai: true,
      ngayTao: '2024-02-01T00:00:00'
    }
  ];
  chiNhanhs.forEach(cn => chiNhanhService.add(cn));

  // 2. NHÂN VIÊN
  const nhanViens: NhanVien[] = [
    {
      maNhanVien: 'NV001',
      maChiNhanh: 'CN001',
      hoTen: 'Nguyễn Văn Hùng',
      gioiTinh: 'Nam',
      ngaySinh: '1995-03-15',
      soDienThoai: '0901111111',
      email: 'hung.nv@30shine.com',
      chucVu: 'Stylist',
      luongCoBan: 5500000,
      trangThai: true,
      ngayVaoLam: '2024-01-10',
      matKhau: '123456',
      ngayTao: '2024-01-10T00:00:00'
    },
    {
      maNhanVien: 'NV002',
      maChiNhanh: 'CN001',
      hoTen: 'Trần Đình Khoa',
      gioiTinh: 'Nam',
      ngaySinh: '1992-07-20',
      soDienThoai: '0901111112',
      email: 'khoa.td@30shine.com',
      chucVu: 'Senior Stylist',
      luongCoBan: 8500000,
      trangThai: true,
      ngayVaoLam: '2024-01-10',
      matKhau: '123456',
      ngayTao: '2024-01-10T00:00:00'
    },
    {
      maNhanVien: 'NV003',
      maChiNhanh: 'CN002',
      hoTen: 'Lê Minh Tuấn',
      gioiTinh: 'Nam',
      ngaySinh: '1998-05-10',
      soDienThoai: '0901111113',
      email: 'tuan.lm@30shine.com',
      chucVu: 'Trainee',
      luongCoBan: 4000000,
      trangThai: true,
      ngayVaoLam: '2024-02-01',
      matKhau: '123456',
      ngayTao: '2024-02-01T00:00:00'
    }
  ];
  nhanViens.forEach(nv => nhanVienService.add(nv));

  // 3. KHÁCH HÀNG
  const khachHangs: KhachHang[] = [
    {
      soDienThoai: '0912345678',
      hoTen: 'Nguyễn Văn An',
      gioiTinh: 'Nam',
      ngaySinh: '1995-03-15',
      email: 'van.an@email.com',
      hangThanhVien: 1,
      diemTichLuy: 150,
      tongDiemTich: 250,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2024-01-15T00:00:00'
    },
    {
      soDienThoai: '0923456789',
      hoTen: 'Trần Minh Đức',
      gioiTinh: 'Nam',
      ngaySinh: '1998-08-20',
      email: 'minh.duc@email.com',
      hangThanhVien: 0,
      diemTichLuy: 30,
      tongDiemTich: 30,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2024-03-01T00:00:00'
    }
  ];
  khachHangs.forEach(kh => khachHangService.add(kh));

  // 4. DỊCH VỤ
  const dichVus: DichVu[] = [
    {
      maDichVu: 'DV001',
      tenDichVu: 'Cắt tóc Nam cơ bản',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Cắt tóc nam theo xu hướng hiện đại',
      gia: 80000,
      thoiGianPhut: 30,
      diemThuong: 8,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV002',
      tenDichVu: 'Cắt tóc + Gội đầu',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Combo cắt tóc và gội đầu thư giãn',
      gia: 120000,
      thoiGianPhut: 45,
      diemThuong: 12,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV003',
      tenDichVu: 'Nhuộm màu thời trang',
      danhMuc: 'Nhuộm tóc',
      moTa: 'Nhuộm tóc màu thời trang theo yêu cầu',
      gia: 350000,
      thoiGianPhut: 90,
      diemThuong: 35,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV004',
      tenDichVu: 'Gội đầu thư giãn',
      danhMuc: 'Gội đầu & Massage',
      moTa: 'Gội đầu massage thư giãn',
      gia: 80000,
      thoiGianPhut: 30,
      diemThuong: 8,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV005',
      tenDichVu: 'Uốn Hàn Quốc',
      danhMuc: 'Uốn & Duỗi',
      moTa: 'Uốn tóc theo phong cách Hàn Quốc',
      gia: 450000,
      thoiGianPhut: 120,
      diemThuong: 45,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    }
  ];
  dichVus.forEach(dv => dichVuService.add(dv));

  // 5. KHUYẾN MÃI
  const khuyenMais: KhuyenMai[] = [
    {
      maCode: 'WEEKEND10',
      tenKhuyenMai: 'Giảm 10% cuối tuần',
      loaiGiam: 'PhanTram',
      giaTriGiam: 10,
      giaTriToiDa: 50000,
      donHangToiThieu: 100000,
      soLanDung: 5,
      soLanToiDa: 100,
      ngayBatDau: '2026-04-01',
      ngayKetThuc: '2026-12-31',
      trangThai: true
    },
    {
      maCode: 'SUMMER50',
      tenKhuyenMai: 'Giảm 50K mùa hè',
      loaiGiam: 'SoTien',
      giaTriGiam: 50000,
      donHangToiThieu: 200000,
      soLanDung: 2,
      soLanToiDa: 50,
      ngayBatDau: '2026-04-01',
      ngayKetThuc: '2026-08-31',
      trangThai: true
    }
  ];
  khuyenMais.forEach(km => khuyenMaiService.add(km));

  // 6. ĐẶT LỊCH
  const datLichs: DatLich[] = [
    {
      maDatLich: 'DL20250001',
      soDienThoai: '0912345678',
      maChiNhanh: 'CN001',
      maNhanVien: 'NV001',
      thoiGianHen: '2026-04-15T10:00:00',
      thoiGianKetThuc: '2026-04-15T11:00:00',
      trangThai: 'HoanThanh',
      nguonDatLich: 'Website',
      ghiChu: '',
      ngayTao: '2026-04-14T00:00:00'
    },
    {
      maDatLich: 'DL20250015',
      soDienThoai: '0912345678',
      maChiNhanh: 'CN001',
      maNhanVien: 'NV002',
      thoiGianHen: '2026-04-20T15:00:00',
      trangThai: 'DaXacNhan',
      nguonDatLich: 'Website',
      ghiChu: '',
      ngayTao: '2026-04-19T00:00:00'
    },
    {
      maDatLich: 'DL20250020',
      soDienThoai: '0912345678',
      maChiNhanh: 'CN002',
      thoiGianHen: '2026-04-25T09:00:00',
      trangThai: 'ChoXacNhan',
      nguonDatLich: 'Website',
      ghiChu: '',
      ngayTao: '2026-04-24T00:00:00'
    }
  ];
  datLichs.forEach(dl => datLichService.add(dl));

  // 7. CHI TIẾT ĐẶT LỊCH
  const chiTietDatLichs: ChiTietDatLich[] = [
    { maDatLich: 'DL20250001', maDichVu: 'DV002', soLuong: 1 },
    { maDatLich: 'DL20250015', maDichVu: 'DV003', soLuong: 1 },
    { maDatLich: 'DL20250020', maDichVu: 'DV005', soLuong: 1 }
  ];
  chiTietDatLichs.forEach(ct => chiTietDatLichService.add(ct));

  // 8. HÓA ĐƠN
  const hoaDons: HoaDon[] = [
    {
      maHoaDon: 'HD20250001',
      soDienThoai: '0912345678',
      maDatLich: 'DL20250001',
      maChiNhanh: 'CN001',
      maCode: 'WEEKEND10',
      tongTien: 120000,
      giamGia: 12000,
      thanhTien: 108000,
      diemDuocCong: 10,
      diemDaDung: 0,
      phuongThucTT: 'TienMat',
      thoiGianTT: '2026-04-15T11:30:00',
      ghiChu: ''
    },
    {
      maHoaDon: 'HD20250008',
      soDienThoai: '0912345678',
      maDatLich: undefined,
      maChiNhanh: 'CN001',
      tongTien: 80000,
      giamGia: 0,
      thanhTien: 80000,
      diemDuocCong: 8,
      diemDaDung: 0,
      phuongThucTT: 'TienMat',
      thoiGianTT: '2026-04-10T16:00:00',
      ghiChu: ''
    }
  ];
  hoaDons.forEach(hd => hoaDonService.add(hd));

  // 9. CHI TIẾT HÓA ĐƠN
  const chiTietHoaDons: ChiTietHoaDon[] = [
    {
      maHoaDon: 'HD20250001',
      maDichVu: 'DV002',
      maNhanVien: 'NV001',
      soLuong: 1,
      donGia: 120000,
      thanhTien: 120000
    },
    {
      maHoaDon: 'HD20250008',
      maDichVu: 'DV001',
      maNhanVien: 'NV001',
      soLuong: 1,
      donGia: 80000,
      thanhTien: 80000
    }
  ];
  chiTietHoaDons.forEach(ct => chiTietHoaDonService.add(ct));

  // 10. ĐÁNH GIÁ
  const danhGias: DanhGia[] = [
    {
      maHoaDon: 'HD20250008',
      soDienThoai: '0912345678',
      maNhanVien: 'NV001',
      saoDichVu: 5,
      saoNhanVien: 5,
      saoCuaHang: 5,
      nhanXet: 'Dịch vụ tốt, stylist tay nghề cao, cắt đúng ý!',
      phanHoiShop: 'Cảm ơn bạn đã tin tưởng 30Shine!',
      ngayDanhGia: '2026-04-10T18:00:00'
    }
  ];
  danhGias.forEach(dg => danhGiaService.add(dg));

  console.log('✅ Khởi tạo dữ liệu mẫu thành công!');
};
