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

  // 1. CHI NHÁNH - Thêm nhiều chi nhánh hơn
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
    },
    {
      maChiNhanh: 'CN004',
      tenChiNhanh: '30Shine Đống Đa',
      diaChi: '45 Thái Hà, Trung Liệt',
      tinhThanh: 'Hà Nội',
      soDienThoai: '02466889996',
      email: 'dongda@30shine.com',
      gioMoCua: '08:00',
      gioDongCua: '21:00',
      trangThai: true,
      ngayTao: '2024-02-10T00:00:00'
    },
    {
      maChiNhanh: 'CN005',
      tenChiNhanh: '30Shine Quận 7',
      diaChi: '12 Nguyễn Thị Thập, Tân Phú',
      tinhThanh: 'TP.HCM',
      soDienThoai: '02866889995',
      email: 'quan7@30shine.com',
      gioMoCua: '08:00',
      gioDongCua: '21:00',
      trangThai: true,
      ngayTao: '2024-02-20T00:00:00'
    }
  ];
  chiNhanhs.forEach(cn => chiNhanhService.add(cn));

  // 2. NHÂN VIÊN - Thêm nhiều nhân viên hơn
  const nhanViens: NhanVien[] = [
    {
      maNhanVien: 'NV001',
      maChiNhanh: 'CN001',
      hoTen: 'Nguyễn Văn Hùng',
      gioiTinh: 'Nam',
      ngaySinh: '1995-03-15',
      soDienThoai: '0901111111',
      email: 'hung.nv@30shine.com',
      chucVu: 'Senior Stylist',
      luongCoBan: 8500000,
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
      chucVu: 'Stylist',
      luongCoBan: 6500000,
      trangThai: true,
      ngayVaoLam: '2024-01-10',
      matKhau: '123456',
      ngayTao: '2024-01-10T00:00:00'
    },
    {
      maNhanVien: 'NV003',
      maChiNhanh: 'CN001',
      hoTen: 'Phạm Minh Tuấn',
      gioiTinh: 'Nam',
      ngaySinh: '1998-05-10',
      soDienThoai: '0901111113',
      email: 'tuan.pm@30shine.com',
      chucVu: 'Trainee',
      luongCoBan: 4500000,
      trangThai: true,
      ngayVaoLam: '2024-02-01',
      matKhau: '123456',
      ngayTao: '2024-02-01T00:00:00'
    },
    {
      maNhanVien: 'NV004',
      maChiNhanh: 'CN002',
      hoTen: 'Lê Minh Tuấn',
      gioiTinh: 'Nam',
      ngaySinh: '1994-08-25',
      soDienThoai: '0901111114',
      email: 'tuan.lm@30shine.com',
      chucVu: 'Senior Stylist',
      luongCoBan: 9000000,
      trangThai: true,
      ngayVaoLam: '2024-01-15',
      matKhau: '123456',
      ngayTao: '2024-01-15T00:00:00'
    },
    {
      maNhanVien: 'NV005',
      maChiNhanh: 'CN002',
      hoTen: 'Hoàng Văn Nam',
      gioiTinh: 'Nam',
      ngaySinh: '1996-11-30',
      soDienThoai: '0901111115',
      email: 'nam.hv@30shine.com',
      chucVu: 'Stylist',
      luongCoBan: 6000000,
      trangThai: true,
      ngayVaoLam: '2024-01-20',
      matKhau: '123456',
      ngayTao: '2024-01-20T00:00:00'
    },
    {
      maNhanVien: 'NV006',
      maChiNhanh: 'CN003',
      hoTen: 'Vũ Đức Anh',
      gioiTinh: 'Nam',
      ngaySinh: '1993-04-18',
      soDienThoai: '0901111116',
      email: 'anh.vd@30shine.com',
      chucVu: 'Senior Stylist',
      luongCoBan: 8800000,
      trangThai: true,
      ngayVaoLam: '2024-02-05',
      matKhau: '123456',
      ngayTao: '2024-02-05T00:00:00'
    },
    {
      maNhanVien: 'NV007',
      maChiNhanh: 'CN003',
      hoTen: 'Đặng Quốc Huy',
      gioiTinh: 'Nam',
      ngaySinh: '1997-09-12',
      soDienThoai: '0901111117',
      email: 'huy.dq@30shine.com',
      chucVu: 'Stylist',
      luongCoBan: 6200000,
      trangThai: true,
      ngayVaoLam: '2024-02-10',
      matKhau: '123456',
      ngayTao: '2024-02-10T00:00:00'
    },
    {
      maNhanVien: 'NV008',
      maChiNhanh: 'CN004',
      hoTen: 'Bùi Văn Long',
      gioiTinh: 'Nam',
      ngaySinh: '1995-06-22',
      soDienThoai: '0901111118',
      email: 'long.bv@30shine.com',
      chucVu: 'Stylist',
      luongCoBan: 6800000,
      trangThai: true,
      ngayVaoLam: '2024-02-15',
      matKhau: '123456',
      ngayTao: '2024-02-15T00:00:00'
    }
  ];
  nhanViens.forEach(nv => nhanVienService.add(nv));

  // 3. KHÁCH HÀNG - Thêm nhiều khách hàng hơn
  const khachHangs: KhachHang[] = [
    {
      soDienThoai: '0912345678',
      hoTen: 'Nguyễn Văn An',
      gioiTinh: 'Nam',
      ngaySinh: '1995-03-15',
      email: 'van.an@email.com',
      hangThanhVien: 2,
      diemTichLuy: 250,
      tongDiemTich: 450,
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
      hangThanhVien: 1,
      diemTichLuy: 120,
      tongDiemTich: 180,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2024-03-01T00:00:00'
    },
    {
      soDienThoai: '0934567890',
      hoTen: 'Lê Hoàng Nam',
      gioiTinh: 'Nam',
      ngaySinh: '1992-05-10',
      email: 'hoang.nam@email.com',
      hangThanhVien: 0,
      diemTichLuy: 45,
      tongDiemTich: 45,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2024-04-01T00:00:00'
    },
    {
      soDienThoai: '0945678901',
      hoTen: 'Phạm Quốc Anh',
      gioiTinh: 'Nam',
      ngaySinh: '1990-12-25',
      email: 'quoc.anh@email.com',
      hangThanhVien: 3,
      diemTichLuy: 580,
      tongDiemTich: 1200,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2023-06-15T00:00:00'
    },
    {
      soDienThoai: '0956789012',
      hoTen: 'Vũ Đức Thắng',
      gioiTinh: 'Nam',
      ngaySinh: '1996-07-18',
      email: 'duc.thang@email.com',
      hangThanhVien: 1,
      diemTichLuy: 95,
      tongDiemTich: 150,
      trangThai: true,
      matKhau: '123456',
      ngayDangKy: '2024-02-20T00:00:00'
    }
  ];
  khachHangs.forEach(kh => khachHangService.add(kh));

  // 4. DỊCH VỤ - Thêm nhiều dịch vụ hơn
  const dichVus: DichVu[] = [
    {
      maDichVu: 'DV001',
      tenDichVu: 'Cắt tóc Nam cơ bản',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Cắt tóc nam theo xu hướng hiện đại',
      gia: 94000,
      thoiGianPhut: 30,
      diemThuong: 9,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV002',
      tenDichVu: 'Cắt tóc + Gội đầu',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Combo cắt tóc và gội đầu thư giãn',
      gia: 139000,
      thoiGianPhut: 45,
      diemThuong: 14,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV003',
      tenDichVu: 'Cắt tóc + Gội + Massage',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Combo trọn gói cắt tóc, gội đầu và massage thư giãn',
      gia: 189000,
      thoiGianPhut: 60,
      diemThuong: 19,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV004',
      tenDichVu: 'Nhuộm màu thời trang',
      danhMuc: 'Nhuộm tóc',
      moTa: 'Nhuộm tóc màu thời trang theo yêu cầu',
      gia: 199000,
      thoiGianPhut: 90,
      diemThuong: 20,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV005',
      tenDichVu: 'Nhuộm phủ bạc',
      danhMuc: 'Nhuộm tóc',
      moTa: 'Nhuộm phủ tóc bạc tự nhiên',
      gia: 149000,
      thoiGianPhut: 60,
      diemThuong: 15,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV006',
      tenDichVu: 'Nhuộm Highlight',
      danhMuc: 'Nhuộm tóc',
      moTa: 'Nhuộm highlight tạo điểm nhấn',
      gia: 299000,
      thoiGianPhut: 120,
      diemThuong: 30,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV007',
      tenDichVu: 'Gội đầu thư giãn',
      danhMuc: 'Gội đầu & Massage',
      moTa: 'Gội đầu massage thư giãn',
      gia: 59000,
      thoiGianPhut: 30,
      diemThuong: 6,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV008',
      tenDichVu: 'Gội đầu dưỡng sinh',
      danhMuc: 'Gội đầu & Massage',
      moTa: 'Gội đầu dưỡng sinh cao cấp',
      gia: 89000,
      thoiGianPhut: 45,
      diemThuong: 9,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV009',
      tenDichVu: 'Uốn Hàn Quốc',
      danhMuc: 'Uốn & Duỗi',
      moTa: 'Uốn tóc theo phong cách Hàn Quốc',
      gia: 386000,
      thoiGianPhut: 120,
      diemThuong: 39,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV010',
      tenDichVu: 'Uốn xoăn tự nhiên',
      danhMuc: 'Uốn & Duỗi',
      moTa: 'Uốn xoăn tự nhiên bồng bềnh',
      gia: 450000,
      thoiGianPhut: 150,
      diemThuong: 45,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV011',
      tenDichVu: 'Duỗi thẳng tự nhiên',
      danhMuc: 'Uốn & Duỗi',
      moTa: 'Duỗi tóc thẳng tự nhiên không gây hại',
      gia: 399000,
      thoiGianPhut: 120,
      diemThuong: 40,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV012',
      tenDichVu: 'Chăm sóc da mặt',
      danhMuc: 'Chăm sóc tóc',
      moTa: 'Chăm sóc da mặt chuyên sâu',
      gia: 150000,
      thoiGianPhut: 60,
      diemThuong: 15,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV013',
      tenDichVu: 'Lấy ráy tai',
      danhMuc: 'Chăm sóc tóc',
      moTa: 'Lấy ráy tai an toàn vệ sinh',
      gia: 70000,
      thoiGianPhut: 20,
      diemThuong: 7,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV014',
      tenDichVu: 'Hấp dầu phục hồi',
      danhMuc: 'Chăm sóc tóc',
      moTa: 'Hấp dầu phục hồi tóc hư tổn',
      gia: 120000,
      thoiGianPhut: 45,
      diemThuong: 12,
      trangThai: true,
      ngayTao: '2024-01-01T00:00:00'
    },
    {
      maDichVu: 'DV015',
      tenDichVu: 'Tạo kiểu tóc sự kiện',
      danhMuc: 'Cắt & Tạo kiểu',
      moTa: 'Tạo kiểu tóc cho sự kiện đặc biệt',
      gia: 250000,
      thoiGianPhut: 60,
      diemThuong: 25,
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
