# 🎯 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ CỬA HÀNG CẮT TÓC 30SHINE

## 📋 Tổng quan

Hệ thống gồm 5 trang chính:
1. **Trang chủ** - Giới thiệu dịch vụ và chi nhánh
2. **Đăng ký** - Tạo tài khoản mới
3. **Đăng nhập** - Đăng nhập vào hệ thống
4. **Trang User** - Dành cho khách hàng
5. **Trang Admin** - Dành cho quản trị viên

## 🚀 Truy cập hệ thống

**URL:** http://localhost:5173/

## 👤 Tài khoản demo

### Admin
- Tài khoản: `admin`
- Mật khẩu: `admin`
- Truy cập: http://localhost:5173/login

### User (Khách hàng)
- Tài khoản: bất kỳ (ví dụ: `0912345678`)
- Mật khẩu: bất kỳ
- Truy cập: http://localhost:5173/login

## 📱 Chức năng theo trang

### 1️⃣ TRANG CHỦ (/)
**Đường dẫn:** http://localhost:5173/

**Nội dung:**
- Header với menu điều hướng
- Hero section giới thiệu
- 6 dịch vụ chính:
  - Cắt & Tạo kiểu (80k - 180k)
  - Gội đầu & Massage (80k - 120k)
  - Nhuộm tóc (200k - 350k)
  - Uốn & Duỗi (450k - 500k)
  - Chăm sóc tóc (150k)
  - Combo đặc biệt (480k - 680k)
- 4 chi nhánh:
  - 30Shine Cầu Giấy (Hà Nội)
  - 30Shine Hoàng Mai (Hà Nội)
  - 30Shine Bình Thạnh (TP.HCM)
  - 30Shine Quận 7 (TP.HCM)
- Thống kê: 100+ chi nhánh, 500+ stylist, 1M+ khách hàng
- Footer với thông tin liên hệ

### 2️⃣ TRANG ĐĂNG KÝ (/register)
**Đường dẫn:** http://localhost:5173/register

**Form đăng ký gồm:**
- Họ và tên *
- Giới tính (Nam/Nữ)
- Số điện thoại *
- Ngày sinh
- Email
- Mật khẩu * (tối thiểu 6 ký tự)
- Xác nhận mật khẩu *
- Checkbox đồng ý điều khoản
- Nút đăng ký qua Facebook/Google

### 3️⃣ TRANG ĐĂNG NHẬP (/login)
**Đường dẫn:** http://localhost:5173/login

**Form đăng nhập gồm:**
- Số điện thoại
- Mật khẩu
- Checkbox ghi nhớ đăng nhập
- Link quên mật khẩu
- Nút đăng nhập qua Facebook/Google

**Demo:**
- Nhập `admin/admin` → Vào trang Admin
- Nhập bất kỳ → Vào trang User

### 4️⃣ TRANG USER (/user)
**Đường dẫn:** http://localhost:5173/user

**Header:**
- Hiển thị tên khách hàng: "Nguyễn Văn An"
- Hạng thành viên: Bạc
- Điểm tích lũy: 150 điểm

**Menu sidebar:**

#### 📅 Đặt lịch
- Chọn chi nhánh (4 chi nhánh)
- Chọn nhiều dịch vụ (10 dịch vụ)
- Chọn stylist (4 stylist hoặc để hệ thống chọn)
- Chọn ngày hẹn
- Chọn giờ hẹn (8:00 - 20:00)
- Ghi chú yêu cầu đặc biệt

#### 📋 Lịch sử đặt lịch
- Hiển thị các lịch đã đặt
- Trạng thái: Hoàn thành / Đã xác nhận / Chờ xác nhận
- Thông tin: Mã đặt lịch, dịch vụ, stylist, chi nhánh, thời gian
- Nút: Đặt lại, Đánh giá, Hủy lịch

#### 🧾 Hóa đơn
- Danh sách hóa đơn
- Thông tin: Mã HD, dịch vụ, chi nhánh
- Chi tiết: Tổng tiền, giảm giá, thanh toán, điểm được cộng
- Nút xem chi tiết

#### ⭐ Đánh giá
- Form đánh giá mới:
  - Chất lượng dịch vụ (1-5 sao)
  - Stylist (1-5 sao)
  - Cửa hàng (1-5 sao)
  - Nhận xét
- Danh sách đánh giá đã gửi
- Phản hồi từ shop

#### 👤 Thông tin cá nhân
- Card hạng thành viên:
  - Hạng hiện tại: BẠC
  - Điểm tích lũy: 150 điểm
  - Tổng điểm đã tích: 250 điểm
  - Progress bar lên hạng VÀNG
- Form cập nhật:
  - Họ tên, giới tính
  - Số điện thoại (không đổi được)
  - Ngày sinh, email
  - Đổi mật khẩu

### 5️⃣ TRANG ADMIN (/admin)
**Đường dẫn:** http://localhost:5173/admin

**Menu sidebar (9 chức năng):**

#### 📊 Dashboard
- 4 thẻ thống kê:
  - Đặt lịch hôm nay: 24
  - Doanh thu tháng: 45.000.000đ
  - Khách hàng mới: 12
  - Tổng nhân viên: 8

#### 📅 Quản lý đặt lịch
- Bảng danh sách đặt lịch
- Cột: Mã, Khách hàng, Dịch vụ, Nhân viên, Thời gian, Trạng thái
- Trạng thái: Chờ xác nhận / Đã xác nhận
- Thao tác: Xác nhận, Hủy, Hoàn thành

#### ✂️ Quản lý dịch vụ
- Nút thêm dịch vụ mới
- Bảng danh sách dịch vụ
- Cột: Mã, Tên, Danh mục, Giá, Thời gian, Điểm thưởng
- Thao tác: Sửa, Xóa

#### 👥 Quản lý nhân viên
- Nút thêm nhân viên
- Bảng danh sách nhân viên
- Cột: Mã, Họ tên, Chức vụ, Chi nhánh, SĐT, Lương, Trạng thái
- Chức vụ: Stylist, Senior Stylist, Trainee, Lễ tân
- Thao tác: Sửa, Xóa

#### 👤 Quản lý khách hàng
- Bảng danh sách khách hàng
- Cột: SĐT, Họ tên, Email, Hạng TV, Điểm, Số lần đến
- Hạng thành viên: Thường / Bạc / Vàng / Kim cương
- Thao tác: Xem chi tiết

#### 🧾 Quản lý hóa đơn
- Bảng danh sách hóa đơn
- Cột: Mã HD, Khách hàng, Chi nhánh, Tổng tiền, Giảm giá, Thanh toán, PT Thanh toán, Thời gian
- Phương thức: Tiền mặt, Chuyển khoản, Momo, VNPay

#### 🏢 Quản lý chi nhánh
- Nút thêm chi nhánh
- Bảng danh sách chi nhánh
- Cột: Mã, Tên, Địa chỉ, SĐT, Giờ mở-đóng, Trạng thái
- Thao tác: Sửa

#### 📦 Quản lý sản phẩm & Tồn kho
- Nút thêm sản phẩm
- Bảng danh sách sản phẩm
- Cột: Mã SP, Tên, Thương hiệu, Danh mục, Chi nhánh, Giá bán, Tồn kho
- Cảnh báo tồn kho thấp (màu đỏ)
- Thao tác: Nhập thêm, Sửa, Xóa

#### 🎁 Khuyến mãi
- Nút tạo mã khuyến mãi
- Bảng danh sách khuyến mãi
- Cột: Mã Code, Tên KM, Loại giảm, Giá trị, Đơn tối thiểu, Số lần dùng, Thời gian
- Loại giảm: Phần trăm / Số tiền
- Thao tác: Sửa, Xóa

## 🎨 Thiết kế

**Màu sắc chủ đạo:**
- Vàng gold: #d4af37
- Đen: #1a1a1a
- Xám đậm: #2c2c2c
- Trắng: #ffffff

**Font chữ:** System default (Arial, sans-serif)

**Responsive:** Tự động điều chỉnh theo màn hình

## 🔄 Điều hướng

```
Trang chủ (/)
├── Đăng nhập (/login)
│   ├── Admin (/admin) - nếu nhập admin/admin
│   └── User (/user) - nếu nhập tài khoản khác
└── Đăng ký (/register)
```

## 📝 Lưu ý

1. Đây là giao diện demo, chưa kết nối backend
2. Dữ liệu hiển thị là dữ liệu mẫu
3. Các form chưa có validation đầy đủ
4. Chức năng đăng nhập chỉ là demo (admin/admin → Admin, còn lại → User)

## 🛠️ Phát triển tiếp

Để kết nối với backend:
1. Tạo API endpoints theo CSDL đã thiết kế
2. Sử dụng axios hoặc fetch để gọi API
3. Thêm state management (Redux/Context API)
4. Thêm validation form
5. Thêm authentication thực sự
6. Thêm loading states và error handling

## 📞 Hỗ trợ

Nếu có vấn đề, kiểm tra:
1. Dev server có đang chạy không: `npm run dev`
2. Console browser có lỗi không (F12)
3. Port 5173 có bị chiếm không

---
**Phiên bản:** 1.0.0  
**Ngày cập nhật:** 16/04/2026
