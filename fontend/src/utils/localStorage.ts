// ============================================================
// LOCAL STORAGE MANAGER - Quản lý dữ liệu local theo schema DoAn3 v2.0
// ============================================================

// Interfaces theo đúng database schema
export interface ChiNhanh {
  maChiNhanh: string;
  tenChiNhanh: string;
  diaChi: string;
  tinhThanh: string;
  soDienThoai: string;
  email: string;
  gioMoCua: string;
  gioDongCua: string;
  trangThai: boolean;
  ngayTao: string;
}

export interface QuanLy {
  maQuanLy: string;
  maChiNhanh: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  luongCoBan: number;
  trangThai: boolean;
  ngayVaoLam: string;
  matKhau: string;
}

export interface NhanVien {
  maNhanVien: string;
  maChiNhanh: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  chucVu: string; // Trainee | Stylist | Senior Stylist | Le tan
  luongCoBan: number;
  trangThai: boolean;
  ngayVaoLam: string;
  matKhau: string;
  ngayTao: string;
}

export interface KhachHang {
  soDienThoai: string; // Primary key
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  email: string;
  hangThanhVien: number; // 0=Thường | 1=Bạc | 2=Vàng | 3=Kim cương
  diemTichLuy: number;
  tongDiemTich: number;
  trangThai: boolean;
  matKhau: string;
  ngayDangKy: string;
}

export interface DichVu {
  maDichVu: string;
  tenDichVu: string;
  danhMuc: string;
  moTa: string;
  gia: number;
  giaSauGiam?: number;
  thoiGianPhut: number;
  diemThuong: number;
  trangThai: boolean;
  ngayTao: string;
}

export interface SanPhamTonKho {
  maSanPham: string;
  maChiNhanh: string;
  tenSanPham: string;
  thuongHieu: string;
  danhMuc: string;
  giaNhap: number;
  giaBan: number;
  soLuong: number;
  soLuongToiThieu: number;
  trangThai: boolean;
  ngayCapNhat: string;
}

export interface KhuyenMai {
  maCode: string; // Primary key
  tenKhuyenMai: string;
  loaiGiam: string; // PhanTram | SoTien
  giaTriGiam: number;
  giaTriToiDa?: number;
  donHangToiThieu: number;
  soLanDung: number;
  soLanToiDa: number;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: boolean;
}

export interface DatLich {
  maDatLich: string;
  soDienThoai: string;
  maChiNhanh: string;
  maNhanVien?: string;
  thoiGianHen: string;
  thoiGianKetThuc?: string;
  trangThai: string; // ChoXacNhan | DaXacNhan | DangPhucVu | HoanThanh | DaHuy
  nguonDatLich: string; // Website | App | TaiQuay | Hotline
  ghiChu?: string;
  ngayTao: string;
}

export interface ChiTietDatLich {
  maDatLich: string;
  maDichVu: string;
  soLuong: number;
}

export interface HoaDon {
  maHoaDon: string;
  soDienThoai: string;
  maDatLich?: string;
  maChiNhanh: string;
  maCode?: string;
  tongTien: number;
  giamGia: number;
  thanhTien: number;
  diemDuocCong: number;
  diemDaDung: number;
  phuongThucTT: string; // TienMat | ChuyenKhoan | Momo | VNPay
  thoiGianTT: string;
  ghiChu?: string;
}

export interface ChiTietHoaDon {
  maHoaDon: string;
  maDichVu: string;
  maNhanVien?: string;
  soLuong: number;
  donGia: number;
  thanhTien: number;
}

export interface DanhGia {
  maHoaDon: string; // Primary key
  soDienThoai: string;
  maNhanVien?: string;
  saoDichVu: number;
  saoNhanVien: number;
  saoCuaHang: number;
  nhanXet: string;
  phanHoiShop?: string;
  ngayDanhGia: string;
}

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================
const KEYS = {
  CHI_NHANH: 'doAn3_chiNhanh',
  QUAN_LY: 'doAn3_quanLy',
  NHAN_VIEN: 'doAn3_nhanVien',
  KHACH_HANG: 'doAn3_khachHang',
  DICH_VU: 'doAn3_dichVu',
  SAN_PHAM: 'doAn3_sanPham',
  KHUYEN_MAI: 'doAn3_khuyenMai',
  DAT_LICH: 'doAn3_datLich',
  CHI_TIET_DAT_LICH: 'doAn3_chiTietDatLich',
  HOA_DON: 'doAn3_hoaDon',
  CHI_TIET_HOA_DON: 'doAn3_chiTietHoaDon',
  DANH_GIA: 'doAn3_danhGia',
  CURRENT_USER: 'doAn3_currentUser',
};

// ============================================================
// GENERIC CRUD FUNCTIONS
// ============================================================

export const getAll = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const getById = <T>(key: string, id: string, idField: string = 'id'): T | undefined => {
  const items = getAll<any>(key);
  return items.find((item: any) => item[idField] === id);
};

export const add = <T>(key: string, item: T): void => {
  const items = getAll<T>(key);
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
};

export const update = <T>(key: string, id: string, updatedItem: T, idField: string = 'id'): boolean => {
  const items = getAll<any>(key);
  const index = items.findIndex((item: any) => item[idField] === id);
  if (index !== -1) {
    items[index] = updatedItem;
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  }
  return false;
};

export const remove = (key: string, id: string, idField: string = 'id'): boolean => {
  const items = getAll<any>(key);
  const filtered = items.filter((item: any) => item[idField] !== id);
  if (filtered.length < items.length) {
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  }
  return false;
};

// ============================================================
// SPECIFIC FUNCTIONS FOR EACH TABLE
// ============================================================

// Chi nhánh
export const chiNhanhService = {
  getAll: () => getAll<ChiNhanh>(KEYS.CHI_NHANH),
  getById: (id: string) => getById<ChiNhanh>(KEYS.CHI_NHANH, id, 'maChiNhanh'),
  add: (item: ChiNhanh) => add(KEYS.CHI_NHANH, item),
  update: (id: string, item: ChiNhanh) => update(KEYS.CHI_NHANH, id, item, 'maChiNhanh'),
  delete: (id: string) => remove(KEYS.CHI_NHANH, id, 'maChiNhanh'),
};

// Quản lý
export const quanLyService = {
  getAll: () => getAll<QuanLy>(KEYS.QUAN_LY),
  getById: (id: string) => getById<QuanLy>(KEYS.QUAN_LY, id, 'maQuanLy'),
  add: (item: QuanLy) => add(KEYS.QUAN_LY, item),
  update: (id: string, item: QuanLy) => update(KEYS.QUAN_LY, id, item, 'maQuanLy'),
  delete: (id: string) => remove(KEYS.QUAN_LY, id, 'maQuanLy'),
};

// Nhân viên
export const nhanVienService = {
  getAll: () => getAll<NhanVien>(KEYS.NHAN_VIEN),
  getById: (id: string) => getById<NhanVien>(KEYS.NHAN_VIEN, id, 'maNhanVien'),
  getByChiNhanh: (maChiNhanh: string) => getAll<NhanVien>(KEYS.NHAN_VIEN).filter(nv => nv.maChiNhanh === maChiNhanh),
  add: (item: NhanVien) => add(KEYS.NHAN_VIEN, item),
  update: (id: string, item: NhanVien) => update(KEYS.NHAN_VIEN, id, item, 'maNhanVien'),
  delete: (id: string) => remove(KEYS.NHAN_VIEN, id, 'maNhanVien'),
};

// Khách hàng
export const khachHangService = {
  getAll: () => getAll<KhachHang>(KEYS.KHACH_HANG),
  getById: (sdt: string) => getById<KhachHang>(KEYS.KHACH_HANG, sdt, 'soDienThoai'),
  add: (item: KhachHang) => add(KEYS.KHACH_HANG, item),
  update: (sdt: string, item: KhachHang) => update(KEYS.KHACH_HANG, sdt, item, 'soDienThoai'),
  delete: (sdt: string) => remove(KEYS.KHACH_HANG, sdt, 'soDienThoai'),
  updateDiem: (sdt: string, diemCong: number, diemTru: number) => {
    const kh = khachHangService.getById(sdt);
    if (kh) {
      kh.diemTichLuy = kh.diemTichLuy + diemCong - diemTru;
      kh.tongDiemTich = kh.tongDiemTich + diemCong;
      khachHangService.update(sdt, kh);
    }
  }
};

// Dịch vụ
export const dichVuService = {
  getAll: () => getAll<DichVu>(KEYS.DICH_VU),
  getById: (id: string) => getById<DichVu>(KEYS.DICH_VU, id, 'maDichVu'),
  getByDanhMuc: (danhMuc: string) => getAll<DichVu>(KEYS.DICH_VU).filter(dv => dv.danhMuc === danhMuc),
  add: (item: DichVu) => add(KEYS.DICH_VU, item),
  update: (id: string, item: DichVu) => update(KEYS.DICH_VU, id, item, 'maDichVu'),
  delete: (id: string) => remove(KEYS.DICH_VU, id, 'maDichVu'),
};

// Sản phẩm tồn kho
export const sanPhamService = {
  getAll: () => getAll<SanPhamTonKho>(KEYS.SAN_PHAM),
  getByChiNhanh: (maChiNhanh: string) => getAll<SanPhamTonKho>(KEYS.SAN_PHAM).filter(sp => sp.maChiNhanh === maChiNhanh),
  add: (item: SanPhamTonKho) => add(KEYS.SAN_PHAM, item),
  update: (maSP: string, maCN: string, item: SanPhamTonKho) => {
    const items = getAll<SanPhamTonKho>(KEYS.SAN_PHAM);
    const index = items.findIndex(sp => sp.maSanPham === maSP && sp.maChiNhanh === maCN);
    if (index !== -1) {
      items[index] = item;
      localStorage.setItem(KEYS.SAN_PHAM, JSON.stringify(items));
      return true;
    }
    return false;
  },
  delete: (maSP: string, maCN: string) => {
    const items = getAll<SanPhamTonKho>(KEYS.SAN_PHAM);
    const filtered = items.filter(sp => !(sp.maSanPham === maSP && sp.maChiNhanh === maCN));
    localStorage.setItem(KEYS.SAN_PHAM, JSON.stringify(filtered));
    return filtered.length < items.length;
  }
};

// Khuyến mãi
export const khuyenMaiService = {
  getAll: () => getAll<KhuyenMai>(KEYS.KHUYEN_MAI),
  getById: (code: string) => getById<KhuyenMai>(KEYS.KHUYEN_MAI, code, 'maCode'),
  getActive: () => {
    const now = new Date().toISOString().split('T')[0];
    return getAll<KhuyenMai>(KEYS.KHUYEN_MAI).filter(km => 
      km.trangThai && km.ngayBatDau <= now && km.ngayKetThuc >= now && km.soLanDung < km.soLanToiDa
    );
  },
  add: (item: KhuyenMai) => add(KEYS.KHUYEN_MAI, item),
  update: (code: string, item: KhuyenMai) => update(KEYS.KHUYEN_MAI, code, item, 'maCode'),
  delete: (code: string) => remove(KEYS.KHUYEN_MAI, code, 'maCode'),
  useCoupon: (code: string) => {
    const km = khuyenMaiService.getById(code);
    if (km) {
      km.soLanDung++;
      khuyenMaiService.update(code, km);
    }
  }
};

// Đặt lịch
export const datLichService = {
  getAll: () => getAll<DatLich>(KEYS.DAT_LICH),
  getById: (id: string) => getById<DatLich>(KEYS.DAT_LICH, id, 'maDatLich'),
  getByKhachHang: (sdt: string) => getAll<DatLich>(KEYS.DAT_LICH).filter(dl => dl.soDienThoai === sdt),
  getByNhanVien: (maNV: string) => getAll<DatLich>(KEYS.DAT_LICH).filter(dl => dl.maNhanVien === maNV),
  getByChiNhanh: (maCN: string) => getAll<DatLich>(KEYS.DAT_LICH).filter(dl => dl.maChiNhanh === maCN),
  getByDate: (date: string) => getAll<DatLich>(KEYS.DAT_LICH).filter(dl => dl.thoiGianHen.startsWith(date)),
  add: (item: DatLich) => add(KEYS.DAT_LICH, item),
  update: (id: string, item: DatLich) => update(KEYS.DAT_LICH, id, item, 'maDatLich'),
  delete: (id: string) => remove(KEYS.DAT_LICH, id, 'maDatLich'),
  updateStatus: (id: string, status: string) => {
    const dl = datLichService.getById(id);
    if (dl) {
      dl.trangThai = status;
      datLichService.update(id, dl);
    }
  }
};

// Chi tiết đặt lịch
export const chiTietDatLichService = {
  getAll: () => getAll<ChiTietDatLich>(KEYS.CHI_TIET_DAT_LICH),
  getByDatLich: (maDL: string) => getAll<ChiTietDatLich>(KEYS.CHI_TIET_DAT_LICH).filter(ct => ct.maDatLich === maDL),
  add: (item: ChiTietDatLich) => add(KEYS.CHI_TIET_DAT_LICH, item),
  deleteByDatLich: (maDL: string) => {
    const items = getAll<ChiTietDatLich>(KEYS.CHI_TIET_DAT_LICH);
    const filtered = items.filter(ct => ct.maDatLich !== maDL);
    localStorage.setItem(KEYS.CHI_TIET_DAT_LICH, JSON.stringify(filtered));
  }
};

// Hóa đơn
export const hoaDonService = {
  getAll: () => getAll<HoaDon>(KEYS.HOA_DON),
  getById: (id: string) => getById<HoaDon>(KEYS.HOA_DON, id, 'maHoaDon'),
  getByKhachHang: (sdt: string) => getAll<HoaDon>(KEYS.HOA_DON).filter(hd => hd.soDienThoai === sdt),
  getByChiNhanh: (maCN: string) => getAll<HoaDon>(KEYS.HOA_DON).filter(hd => hd.maChiNhanh === maCN),
  add: (item: HoaDon) => add(KEYS.HOA_DON, item),
  update: (id: string, item: HoaDon) => update(KEYS.HOA_DON, id, item, 'maHoaDon'),
  delete: (id: string) => remove(KEYS.HOA_DON, id, 'maHoaDon'),
};

// Chi tiết hóa đơn
export const chiTietHoaDonService = {
  getAll: () => getAll<ChiTietHoaDon>(KEYS.CHI_TIET_HOA_DON),
  getByHoaDon: (maHD: string) => getAll<ChiTietHoaDon>(KEYS.CHI_TIET_HOA_DON).filter(ct => ct.maHoaDon === maHD),
  add: (item: ChiTietHoaDon) => add(KEYS.CHI_TIET_HOA_DON, item),
};

// Đánh giá
export const danhGiaService = {
  getAll: () => getAll<DanhGia>(KEYS.DANH_GIA),
  getById: (maHD: string) => getById<DanhGia>(KEYS.DANH_GIA, maHD, 'maHoaDon'),
  getByNhanVien: (maNV: string) => getAll<DanhGia>(KEYS.DANH_GIA).filter(dg => dg.maNhanVien === maNV),
  add: (item: DanhGia) => add(KEYS.DANH_GIA, item),
  update: (maHD: string, item: DanhGia) => update(KEYS.DANH_GIA, maHD, item, 'maHoaDon'),
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Generate mã tự động
export const generateCode = (prefix: string, currentList: any[], codeField: string): string => {
  if (currentList.length === 0) return `${prefix}001`;
  
  const numbers = currentList
    .map((item: any) => {
      const code = item[codeField];
      const num = parseInt(code.replace(prefix, ''));
      return isNaN(num) ? 0 : num;
    })
    .filter((num: number) => num > 0);
  
  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
};

// Current user management
export const authService = {
  login: (user: any) => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },
  getCurrentUser: () => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  isLoggedIn: () => {
    return localStorage.getItem(KEYS.CURRENT_USER) !== null;
  }
};

// Clear all data
export const clearAllData = () => {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export default {
  chiNhanhService,
  quanLyService,
  nhanVienService,
  khachHangService,
  dichVuService,
  sanPhamService,
  khuyenMaiService,
  datLichService,
  chiTietDatLichService,
  hoaDonService,
  chiTietHoaDonService,
  danhGiaService,
  authService,
  generateCode,
  clearAllData,
};
