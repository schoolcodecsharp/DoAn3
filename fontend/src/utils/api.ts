// ============================================================
// API SERVICE - Kết nối Backend API thay cho localStorage
// ============================================================

const API_BASE = 'http://localhost:5000/api';

// Generic fetch wrapper
const fetchApi = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi server');
    return data;
  } catch (err: any) {
    console.error('API Error:', err.message);
    throw err;
  }
};

// ============================================================
// AUTH API
// ============================================================
export const authApi = {
  login: (phone: string, password: string) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  register: (data: any) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================================
// CHI NHANH API
// ============================================================
export const chiNhanhApi = {
  getAll: (search?: string) =>
    fetchApi(`/chinhanh${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id: string) => fetchApi(`/chinhanh/${id}`),
  create: (data: any) =>
    fetchApi('/chinhanh', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi(`/chinhanh/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchApi(`/chinhanh/${id}`, { method: 'DELETE' }),
};

// ============================================================
// NHAN VIEN API
// ============================================================
export const nhanVienApi = {
  getAll: (search?: string) =>
    fetchApi(`/nhanvien${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id: string) => fetchApi(`/nhanvien/${id}`),
  create: (data: any) =>
    fetchApi('/nhanvien', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi(`/nhanvien/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchApi(`/nhanvien/${id}`, { method: 'DELETE' }),
};

// ============================================================
// KHACH HANG API
// ============================================================
export const khachHangApi = {
  getAll: (search?: string) =>
    fetchApi(`/khachhang${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (sdt: string) => fetchApi(`/khachhang/${sdt}`),
  create: (data: any) =>
    fetchApi('/khachhang', { method: 'POST', body: JSON.stringify(data) }),
  update: (sdt: string, data: any) =>
    fetchApi(`/khachhang/${sdt}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (sdt: string) =>
    fetchApi(`/khachhang/${sdt}`, { method: 'DELETE' }),
};

// ============================================================
// DICH VU API
// ============================================================
export const dichVuApi = {
  getAll: (search?: string) =>
    fetchApi(`/dichvu${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id: string) => fetchApi(`/dichvu/${id}`),
  create: (data: any) =>
    fetchApi('/dichvu', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi(`/dichvu/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchApi(`/dichvu/${id}`, { method: 'DELETE' }),
};

// ============================================================
// DAT LICH API
// ============================================================
export const datLichApi = {
  getAll: (params?: { search?: string; trangThai?: string; nhanVien?: string; khachHang?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.trangThai) query.set('trangThai', params.trangThai);
    if (params?.nhanVien) query.set('nhanVien', params.nhanVien);
    if (params?.khachHang) query.set('khachHang', params.khachHang);
    const qs = query.toString();
    return fetchApi(`/datlich${qs ? `?${qs}` : ''}`);
  },
  getById: (id: string) => fetchApi(`/datlich/${id}`),
  create: (data: any) =>
    fetchApi('/datlich', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi(`/datlich/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id: string, trangThai: string) =>
    fetchApi(`/datlich/${id}/trangthai`, { method: 'PATCH', body: JSON.stringify({ trangThai }) }),
  getChiTiet: (id: string) => fetchApi(`/datlich/${id}/chitiet`),
  addChiTiet: (id: string, data: any) =>
    fetchApi(`/datlich/${id}/chitiet`, { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================================
// HOA DON API
// ============================================================
export const hoaDonApi = {
  getAll: (params?: { search?: string; khachHang?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.khachHang) query.set('khachHang', params.khachHang);
    const qs = query.toString();
    return fetchApi(`/hoadon${qs ? `?${qs}` : ''}`);
  },
  getById: (id: string) => fetchApi(`/hoadon/${id}`),
  create: (data: any) =>
    fetchApi('/hoadon', { method: 'POST', body: JSON.stringify(data) }),
  getChiTiet: (id: string) => fetchApi(`/hoadon/${id}/chitiet`),
};

// ============================================================
// KHUYEN MAI API
// ============================================================
export const khuyenMaiApi = {
  getAll: (search?: string) =>
    fetchApi(`/khuyenmai${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  create: (data: any) =>
    fetchApi('/khuyenmai', { method: 'POST', body: JSON.stringify(data) }),
  update: (code: string, data: any) =>
    fetchApi(`/khuyenmai/${code}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (code: string) =>
    fetchApi(`/khuyenmai/${code}`, { method: 'DELETE' }),
};

// ============================================================
// SAN PHAM API
// ============================================================
export const sanPhamApi = {
  getAll: (search?: string) =>
    fetchApi(`/sanpham${search ? `?search=${encodeURIComponent(search)}` : ''}`),
};

// ============================================================
// DANH GIA API
// ============================================================
export const danhGiaApi = {
  getAll: (params?: { search?: string; nhanVien?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.nhanVien) query.set('nhanVien', params.nhanVien);
    const qs = query.toString();
    return fetchApi(`/danhgia${qs ? `?${qs}` : ''}`);
  },
  create: (data: any) =>
    fetchApi('/danhgia', { method: 'POST', body: JSON.stringify(data) }),
};
