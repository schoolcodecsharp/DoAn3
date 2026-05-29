-- ============================================================
-- BẢNG: LỊCH SỬ ĐỔI THƯỞNG
-- Lưu lại các lần khách hàng đổi điểm lấy mã giảm giá
-- ============================================================

USE DoAn3;
GO

CREATE TABLE LichSuDoiThuong (
    MaDoiThuong     VARCHAR(20)    PRIMARY KEY,        -- VD: DT20250001
    SoDienThoai     VARCHAR(15)    NOT NULL,           -- FK -> KhachHang
    DiemDaDoi       INT            NOT NULL,           -- Số điểm đã dùng để đổi
    MaCode          VARCHAR(30)    NOT NULL,           -- Mã giảm giá nhận được
    TrangThai       NVARCHAR(20)   DEFAULT N'ChuaSuDung', -- ChuaSuDung | DaSuDung | HetHan
    NgayDoiThuong   DATETIME       DEFAULT GETDATE(),
    NgayHetHan      DATETIME       NOT NULL,           -- Mã có hiệu lực đến ngày này
    NgaySuDung      DATETIME,                          -- Ngày khách dùng mã

    CONSTRAINT FK_DoiThuong_KhachHang FOREIGN KEY (SoDienThoai)
        REFERENCES KhachHang(SoDienThoai),
    CONSTRAINT FK_DoiThuong_KhuyenMai FOREIGN KEY (MaCode)
        REFERENCES KhuyenMai(MaCode)
);
GO

PRINT N'=== Đã tạo bảng LichSuDoiThuong ===';
GO
