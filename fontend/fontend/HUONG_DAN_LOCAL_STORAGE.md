# Hướng Dẫn Sử Dụng Local Storage

## Tổng Quan
Hệ thống đã được tích hợp localStorage để lưu trữ dữ liệu demo trên trình duyệt. Tất cả các chức năng CRUD (Create, Read, Update, Delete) đều hoạt động với localStorage.

## Cấu Trúc Dữ Liệu

### 1. localStorage.ts
File chứa tất cả các interface và service functions:
- **Interfaces**: ChiNhanh, QuanLy, NhanVien, KhachHang, DichVu, SanPhamTonKho, KhuyenMai, DatLich, ChiTietDatLich, HoaDon, ChiTietHoaDon, DanhGia
- **Services**: Mỗi bảng có service riêng với các hàm getAll(), getById(), add(), update(), delete()
- **Helper Functions**: generateCode() để tạo mã tự động, authService để quản lý đăng nhập

### 2. initData.ts
File khởi tạo dữ liệu mẫu khi app chạy lần đầu:
- 3 chi nhánh
- 3 nhân viên
- 2 khách hàng
- 5 dịch vụ
- 2 khuyến mãi
- 3 đặt lịch
- 2 hóa đơn
- 1 đánh giá

## Tích Hợp Vào Components

### Admin.tsx
- **Quản lý Dịch Vụ**: Thêm, sửa, xóa dịch vụ từ localStorage
- **Quản lý Nhân Viên**: CRUD nhân viên với auto-generate mã NV
- **Quản lý Chi Nhánh**: CRUD chi nhánh với auto-generate mã CN
- **Quản lý Khách Hàng**: Xem danh sách khách hàng
- **Dashboard**: Hiển thị thống kê động từ localStorage

### User.tsx
- **Đặt Lịch**: Tạo lịch hẹn mới, lưu vào localStorage
- **Lịch Sử Đặt Lịch**: Xem tất cả lịch hẹn của khách hàng
- **Hóa Đơn**: Xem lịch sử hóa đơn
- **Thông Tin Cá Nhân**: Hiển thị thông tin khách hàng, điểm tích lũy, hạng thành viên

### Staff.tsx
- **Lịch Hẹn Hôm Nay**: Xem lịch hẹn được phân công
- **Cập Nhật Trạng Thái**: Chuyển trạng thái lịch hẹn (ChoXacNhan → DaXacNhan → DangPhucVu → HoanThanh)
- **Lịch Sử Phục Vụ**: Xem các hóa đơn đã hoàn thành
- **Đánh Giá**: Xem đánh giá từ khách hàng
- **Thống Kê**: Hiển thị thống kê tháng

## Cách Sử Dụng

### 1. Khởi Động App
```bash
npm run dev
```

Dữ liệu mẫu sẽ tự động được khởi tạo lần đầu tiên.

### 2. Xem Dữ Liệu trong Browser
Mở DevTools → Application → Local Storage → http://localhost:5173
Các key:
- `doAn3_chiNhanh`
- `doAn3_nhanVien`
- `doAn3_khachHang`
- `doAn3_dichVu`
- `doAn3_datLich`
- `doAn3_hoaDon`
- v.v.

### 3. Reset Dữ Liệu
Để reset về dữ liệu mẫu ban đầu:
1. Mở DevTools → Application → Local Storage
2. Xóa tất cả các key `doAn3_*`
3. Refresh trang

## Tài Khoản Demo

### Khách Hàng
- SĐT: `0912345678`
- Tên: Nguyễn Văn An
- Hạng: Bạc
- Điểm: 150

### Nhân Viên
- Mã: `NV001`
- Tên: Nguyễn Văn Hùng
- Chức vụ: Stylist
- Chi nhánh: CN001

## Lưu Ý
- Dữ liệu chỉ lưu trên trình duyệt (localStorage)
- Xóa cache/cookies sẽ mất dữ liệu
- Mỗi trình duyệt có dữ liệu riêng
- Không có backend API thật

## Mở Rộng
Để thêm chức năng mới:
1. Thêm interface vào `localStorage.ts`
2. Tạo service functions
3. Thêm dữ liệu mẫu vào `initData.ts`
4. Sử dụng service trong component

## Ví Dụ Sử Dụng Service

```typescript
import { dichVuService, generateCode } from '../utils/localStorage';

// Lấy tất cả dịch vụ
const services = dichVuService.getAll();

// Lấy 1 dịch vụ
const service = dichVuService.getById('DV001');

// Thêm dịch vụ mới
const newService = {
  maDichVu: generateCode('DV', dichVuService.getAll(), 'maDichVu'),
  tenDichVu: 'Cắt tóc VIP',
  danhMuc: 'Cắt & Tạo kiểu',
  moTa: 'Dịch vụ cao cấp',
  gia: 200000,
  thoiGianPhut: 60,
  diemThuong: 20,
  trangThai: true,
  ngayTao: new Date().toISOString()
};
dichVuService.add(newService);

// Cập nhật
dichVuService.update('DV001', updatedService);

// Xóa
dichVuService.delete('DV001');
```

## Kết Luận
Hệ thống localStorage đã được tích hợp hoàn chỉnh vào tất cả các trang chính (Admin, User, Staff). Tất cả chức năng CRUD hoạt động bình thường và dữ liệu được lưu trữ persistent trên trình duyệt.
