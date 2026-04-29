-- ===============================
-- 1. INSERT VAI TRÒ (CHỈ 2 ROLE)
-- ===============================
INSERT INTO VaiTro (TenVaiTro) VALUES ('Admin');
INSERT INTO VaiTro (TenVaiTro) VALUES ('User');


-- ===============================
-- 2. INSERT NGƯỜI DÙNG (5 DÒNG)
-- ===============================
INSERT INTO NguoiDung (HoTen, Email, MatKhau, SoDienThoai, VaiTroId)
VALUES 
(N'Nguyễn Văn A', 'a@gmail.com', '123456', '0900000001', 2),
(N'Trần Thị B', 'b@gmail.com', '123456', '0900000002', 2),
(N'Lê Văn C', 'c@gmail.com', '123456', '0900000003', 2),
(N'Phạm Thị D', 'd@gmail.com', '123456', '0900000004', 2),
(N'Admin Hệ Thống', 'admin@gmail.com', '123456', '0900000005', 1);


-- ===============================
-- 3. INSERT VÍ TIỀN (5 DÒNG)
-- ===============================
INSERT INTO ViTien (NguoiDungId, TenVi, SoDu, MoTa)
VALUES
(1, N'Ví tiền mặt', 5000000, N'Ví cá nhân'),
(2, N'Tài khoản ngân hàng', 12000000, N'Ngân hàng Vietcombank'),
(3, N'Ví Momo', 2000000, N'Ví điện tử'),
(4, N'Ví ZaloPay', 1500000, N'Ví điện tử'),
(5, N'Ví quản trị', 10000000, N'Ví admin');


-- ===============================
-- 4. INSERT DANH MỤC (5 DÒNG)
-- ===============================
INSERT INTO DanhMuc (NguoiDungId, TenDanhMuc, Loai, LaMacDinh)
VALUES
(NULL, N'Ăn uống', 'Chi', 1),
(NULL, N'Đi lại', 'Chi', 1),
(NULL, N'Lương', 'Thu', 1),
(1, N'Học tập', 'Chi', 0),
(2, N'Đầu tư', 'Thu', 0);


-- ===============================
-- 5. INSERT GIAO DỊCH (5 DÒNG)
-- ===============================
INSERT INTO GiaoDich (NguoiDungId, ViTienId, DanhMucId, SoTien, Loai, GhiChu, NgayGiaoDich)
VALUES
(1, 1, 1, 200000, 'Chi', N'Ăn trưa', '2025-03-01'),
(2, 2, 3, 10000000, 'Thu', N'Nhận lương', '2025-03-02'),
(3, 3, 2, 50000, 'Chi', N'Gửi xe', '2025-03-02'),
(4, 4, 1, 150000, 'Chi', N'Ăn tối', '2025-03-03'),
(5, 5, 3, 20000000, 'Thu', N'Lợi nhuận hệ thống', '2025-03-03');


-- ===============================
-- 6. INSERT NGÂN SÁCH (5 DÒNG)
-- ===============================
INSERT INTO NganSach (NguoiDungId, DanhMucId, SoTien, Thang, Nam)
VALUES
(1, 1, 3000000, 3, 2025),
(2, 1, 4000000, 3, 2025),
(3, 2, 1000000, 3, 2025),
(4, 1, 3500000, 3, 2025),
(5, 3, 20000000, 3, 2025);