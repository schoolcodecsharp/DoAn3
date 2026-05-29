-- ============================================================
-- CẬP NHẬT CỘT HÌNH ẢNH SANG NVARCHAR(MAX) ĐỂ LƯU BASE64
-- Chạy script này trên SQL Server
-- ============================================================

USE DoAn3;
GO

-- Đổi kiểu cột HinhAnh sang NVARCHAR(MAX) cho 3 bảng
ALTER TABLE ChiNhanh ALTER COLUMN HinhAnh NVARCHAR(MAX);
GO

ALTER TABLE DichVu ALTER COLUMN HinhAnh NVARCHAR(MAX);
GO

ALTER TABLE NhanVien ALTER COLUMN HinhAnh NVARCHAR(MAX);
GO

PRINT N'=== Đã cập nhật cột HinhAnh sang NVARCHAR(MAX) cho 3 bảng ===';
GO
