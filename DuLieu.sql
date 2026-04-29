-- ============================================================
-- FILE 2: INDEX, STORED PROCEDURE, VIEW, D? LI?U M?U
-- Chay file nay SAU KHI da chay xong file 01_Tables.sql
-- Database: DoAn3
-- ============================================================

USE DoAn3;
GO

-- ============================================================
-- PH?N A: INDEX
-- ============================================================
CREATE INDEX IX_NhanVien_ChiNhanh   ON NhanVien(ChiNhanhID);
CREATE INDEX IX_DatLich_KhachHang   ON DatLich(KhachHangID);
CREATE INDEX IX_DatLich_ThoiGianHen ON DatLich(ThoiGianHen);
CREATE INDEX IX_DatLich_TrangThai   ON DatLich(TrangThai);
CREATE INDEX IX_HoaDon_KhachHang    ON HoaDon(KhachHangID);
CREATE INDEX IX_HoaDon_ThoiGianTT   ON HoaDon(ThoiGianTT);
CREATE INDEX IX_KhachHang_SoDT      ON KhachHang(SoDienThoai);
GO

-- ============================================================
-- PH?N B: STORED PROCEDURES
-- ============================================================

-- ----------------------------------------------------------
-- SP 1: Tao dat lich moi
-- Truyen vao: @KhachHangID, @ChiNhanhID, @NhanVienID (co the NULL),
--             @ThoiGianHen, @DanhSachDichVu (JSON), @NguonDatLich, @GhiChu
-- Vi du goi: EXEC SP_TaoDatLich 1, 1, 1, '2025-06-15 09:00',
--            '[{"DichVuID":1,"SoLuong":1},{"DichVuID":4,"SoLuong":1}]', 'App', NULL
-- ----------------------------------------------------------
CREATE OR ALTER PROCEDURE SP_TaoDatLich
    @KhachHangID    INT,
    @ChiNhanhID     INT,
    @NhanVienID     INT           = NULL,
    @ThoiGianHen    DATETIME,
    @DanhSachDichVu NVARCHAR(MAX),
    @NguonDatLich   NVARCHAR(20)  = N'Website',
    @GhiChu         NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Tinh tong thoi gian thuc hien
        DECLARE @TongPhut INT;
        SELECT @TongPhut = SUM(dv.ThoiGianPhut * j.SoLuong)
        FROM OPENJSON(@DanhSachDichVu)
             WITH (DichVuID INT '$.DichVuID', SoLuong INT '$.SoLuong') j
        JOIN DichVu dv ON j.DichVuID = dv.DichVuID;

        IF @TongPhut IS NULL SET @TongPhut = 30;

        -- Sinh ma dat lich
        DECLARE @MaDatLich VARCHAR(20) =
            'DL' + FORMAT(GETDATE(), 'yyyyMMddHHmm') +
            RIGHT('00' + CAST(@@SPID AS VARCHAR), 2);

        INSERT INTO DatLich (MaDatLich, KhachHangID, ChiNhanhID, NhanVienID,
                             ThoiGianHen, ThoiGianKetThuc, NguonDatLich, GhiChu)
        VALUES (@MaDatLich, @KhachHangID, @ChiNhanhID, @NhanVienID,
                @ThoiGianHen, DATEADD(MINUTE, @TongPhut, @ThoiGianHen),
                @NguonDatLich, @GhiChu);

        DECLARE @NewID INT = SCOPE_IDENTITY();

        INSERT INTO ChiTietDatLich (DatLichID, DichVuID, SoLuong)
        SELECT @NewID, DichVuID, SoLuong
        FROM OPENJSON(@DanhSachDichVu)
             WITH (DichVuID INT '$.DichVuID', SoLuong INT '$.SoLuong');

        COMMIT;
        SELECT @NewID AS DatLichID, @MaDatLich AS MaDatLich,
               @ThoiGianHen AS ThoiGianHen,
               DATEADD(MINUTE, @TongPhut, @ThoiGianHen) AS ThoiGianKetThuc;
    END TRY
    BEGIN CATCH
        ROLLBACK; THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------
-- SP 2: Thanh toan - tao hoa don tu dat lich
-- Vi du goi: EXEC SP_ThanhToan 1, 1, NULL, 0, N'TienMat', NULL
-- ----------------------------------------------------------
CREATE OR ALTER PROCEDURE SP_ThanhToan
    @DatLichID      INT,
    @KhuyenMaiID    INT           = NULL,
    @DiemDaDung     INT           = 0,
    @PhuongThucTT   NVARCHAR(20)  = N'TienMat',
    @GhiChu         NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        DECLARE @KhachHangID INT, @ChiNhanhID INT;
        SELECT @KhachHangID = KhachHangID, @ChiNhanhID = ChiNhanhID
        FROM DatLich WHERE DatLichID = @DatLichID;

        -- Tinh tong tien dich vu
        DECLARE @TongTien DECIMAL(12,2);
        SELECT @TongTien = SUM(ISNULL(dv.GiaSauGiam, dv.Gia) * ct.SoLuong)
        FROM ChiTietDatLich ct
        JOIN DichVu dv ON ct.DichVuID = dv.DichVuID
        WHERE ct.DatLichID = @DatLichID;

        -- Tinh giam gia khuyen mai
        DECLARE @GiamGia DECIMAL(12,2) = 0;
        IF @KhuyenMaiID IS NOT NULL
        BEGIN
            DECLARE @LoaiGiam NVARCHAR(20), @GiaTriGiam DECIMAL(12,2), @GiaTriToiDa DECIMAL(12,2);
            SELECT @LoaiGiam = LoaiGiam, @GiaTriGiam = GiaTriGiam, @GiaTriToiDa = GiaTriToiDa
            FROM KhuyenMai WHERE KhuyenMaiID = @KhuyenMaiID;

            SET @GiamGia = CASE
                WHEN @LoaiGiam = N'PhanTram' THEN
                    CASE WHEN @GiaTriToiDa IS NOT NULL
                         THEN LEAST(@TongTien * @GiaTriGiam / 100, @GiaTriToiDa)
                         ELSE @TongTien * @GiaTriGiam / 100 END
                ELSE @GiaTriGiam
            END;

            UPDATE KhuyenMai SET SoLanDung = SoLanDung + 1
            WHERE KhuyenMaiID = @KhuyenMaiID;
        END

        -- Giam tu diem: 1 diem = 1.000d
        SET @GiamGia = @GiamGia + (@DiemDaDung * 1000);

        DECLARE @ThanhTien DECIMAL(12,2) = @TongTien - @GiamGia;
        IF @ThanhTien < 0 SET @ThanhTien = 0;

        -- Cong diem: cu 10.000d = 1 diem
        DECLARE @DiemDuocCong INT = CAST(@ThanhTien / 10000 AS INT);

        -- Sinh ma hoa don
        DECLARE @MaHD VARCHAR(20) =
            'HD' + FORMAT(GETDATE(), 'yyyyMMddHHmm') +
            RIGHT('00' + CAST(@@SPID AS VARCHAR), 2);

        INSERT INTO HoaDon (MaHoaDon, KhachHangID, DatLichID, ChiNhanhID,
                            KhuyenMaiID, TongTien, GiamGia, ThanhTien,
                            DiemDuocCong, DiemDaDung, PhuongThucTT, GhiChu)
        VALUES (@MaHD, @KhachHangID, @DatLichID, @ChiNhanhID,
                @KhuyenMaiID, @TongTien, @GiamGia, @ThanhTien,
                @DiemDuocCong, @DiemDaDung, @PhuongThucTT, @GhiChu);

        DECLARE @NewHDID INT = SCOPE_IDENTITY();

        -- Copy chi tiet dich vu sang hoa don
        INSERT INTO ChiTietHoaDon (HoaDonID, DichVuID, SoLuong, DonGia, ThanhTien)
        SELECT @NewHDID, ct.DichVuID, ct.SoLuong,
               ISNULL(dv.GiaSauGiam, dv.Gia),
               ISNULL(dv.GiaSauGiam, dv.Gia) * ct.SoLuong
        FROM ChiTietDatLich ct
        JOIN DichVu dv ON ct.DichVuID = dv.DichVuID
        WHERE ct.DatLichID = @DatLichID;

        -- Cap nhat diem khach hang
        UPDATE KhachHang
        SET DiemTichLuy  = DiemTichLuy + @DiemDuocCong - @DiemDaDung,
            TongDiemTich = TongDiemTich + @DiemDuocCong
        WHERE KhachHangID = @KhachHangID;

        -- Cap nhat trang thai dat lich
        UPDATE DatLich SET TrangThai = N'HoanThanh' WHERE DatLichID = @DatLichID;

        COMMIT;
        SELECT @NewHDID AS HoaDonID, @MaHD AS MaHoaDon,
               @ThanhTien AS ThanhTien, @DiemDuocCong AS DiemDuocCong;
    END TRY
    BEGIN CATCH
        ROLLBACK; THROW;
    END CATCH
END;
GO

-- ----------------------------------------------------------
-- SP 3: Xem lich trong ngay cua chi nhanh
-- Vi du goi: EXEC SP_XemLichNgay 1
--            EXEC SP_XemLichNgay 1, '2025-06-15'
-- ----------------------------------------------------------
CREATE OR ALTER PROCEDURE SP_XemLichNgay
    @ChiNhanhID INT,
    @Ngay       DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Ngay IS NULL SET @Ngay = CAST(GETDATE() AS DATE);

    SELECT
        dl.MaDatLich,
        kh.HoTen           AS TenKhachHang,
        kh.SoDienThoai,
        nv.HoTen           AS TenNhanVien,
        FORMAT(dl.ThoiGianHen,     'HH:mm') AS GioHen,
        FORMAT(dl.ThoiGianKetThuc, 'HH:mm') AS GioKetThuc,
        dl.TrangThai,
        dl.NguonDatLich,
        STRING_AGG(dv.TenDichVu, N', ') AS DanhSachDichVu
    FROM DatLich dl
    JOIN KhachHang kh    ON dl.KhachHangID = kh.KhachHangID
    LEFT JOIN NhanVien nv ON dl.NhanVienID  = nv.NhanVienID
    LEFT JOIN ChiTietDatLich ct ON dl.DatLichID = ct.DatLichID
    LEFT JOIN DichVu dv  ON ct.DichVuID = dv.DichVuID
    WHERE dl.ChiNhanhID = @ChiNhanhID
      AND CAST(dl.ThoiGianHen AS DATE) = @Ngay
    GROUP BY dl.DatLichID, dl.MaDatLich, kh.HoTen, kh.SoDienThoai,
             nv.HoTen, dl.ThoiGianHen, dl.ThoiGianKetThuc,
             dl.TrangThai, dl.NguonDatLich
    ORDER BY dl.ThoiGianHen;
END;
GO

-- ----------------------------------------------------------
-- SP 4: Bao cao doanh thu
-- Vi du goi: EXEC SP_BaoCaoDoanhThu NULL, '2025-01-01', '2025-12-31'
--            EXEC SP_BaoCaoDoanhThu 1,    '2025-06-01', '2025-06-30'
-- ----------------------------------------------------------
CREATE OR ALTER PROCEDURE SP_BaoCaoDoanhThu
    @ChiNhanhID INT  = NULL,
    @TuNgay     DATE,
    @DenNgay    DATE
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        cn.TenChiNhanh,
        COUNT(hd.HoaDonID)              AS SoHoaDon,
        SUM(hd.TongTien)                AS TongTruocGiam,
        SUM(hd.GiamGia)                 AS TongGiamGia,
        SUM(hd.ThanhTien)               AS TongDoanhThu,
        AVG(hd.ThanhTien)               AS TrungBinhHoaDon,
        COUNT(DISTINCT hd.KhachHangID)  AS SoLuotKhach
    FROM HoaDon hd
    JOIN ChiNhanh cn ON hd.ChiNhanhID = cn.ChiNhanhID
    WHERE CAST(hd.ThoiGianTT AS DATE) BETWEEN @TuNgay AND @DenNgay
      AND (@ChiNhanhID IS NULL OR hd.ChiNhanhID = @ChiNhanhID)
    GROUP BY cn.ChiNhanhID, cn.TenChiNhanh
    ORDER BY TongDoanhThu DESC;
END;
GO

-- ============================================================
-- PH?N C: VIEWS
-- ============================================================

-- View 1: Thong ke khach hang
CREATE VIEW V_ThongKeKhachHang AS
SELECT
    kh.KhachHangID,
    kh.HoTen,
    kh.SoDienThoai,
    kh.Email,
    CASE kh.HangThanhVien
        WHEN 0 THEN N'Thuong'
        WHEN 1 THEN N'Bac'
        WHEN 2 THEN N'Vang'
        WHEN 3 THEN N'Kim cuong'
    END                           AS HangThanhVien,
    kh.DiemTichLuy,
    COUNT(hd.HoaDonID)            AS SoLanDen,
    ISNULL(SUM(hd.ThanhTien), 0)  AS TongChiTieu,
    MAX(hd.ThoiGianTT)            AS LanCuoiDen
FROM KhachHang kh
LEFT JOIN HoaDon hd ON kh.KhachHangID = hd.KhachHangID
GROUP BY kh.KhachHangID, kh.HoTen, kh.SoDienThoai,
         kh.Email, kh.HangThanhVien, kh.DiemTichLuy;
GO

-- View 2: Dich vu pho bien
CREATE VIEW V_DichVuPhoBien AS
SELECT
    dv.DichVuID,
    dv.DanhMuc,
    dv.TenDichVu,
    dv.Gia,
    COUNT(ct.ID)                  AS SoLanSuDung,
    ISNULL(SUM(ct.ThanhTien), 0)  AS TongDoanhThu
FROM DichVu dv
LEFT JOIN ChiTietHoaDon ct ON dv.DichVuID = ct.DichVuID
LEFT JOIN HoaDon hd ON ct.HoaDonID = hd.HoaDonID
GROUP BY dv.DichVuID, dv.DanhMuc, dv.TenDichVu, dv.Gia;
GO

-- View 3: San pham ton kho thap (can nhap them)
CREATE VIEW V_TonKhoThap AS
SELECT
    cn.TenChiNhanh,
    sp.TenSanPham,
    sp.ThuongHieu,
    sp.SoLuong          AS TonHienTai,
    sp.SoLuongToiThieu  AS MucToiThieu,
    (sp.SoLuongToiThieu - sp.SoLuong) AS CanNhapThem
FROM SanPhamTonKho sp
JOIN ChiNhanh cn ON sp.ChiNhanhID = cn.ChiNhanhID
WHERE sp.SoLuong <= sp.SoLuongToiThieu;
GO

-- ============================================================
-- PH?N D: D? LI?U M?U
-- ============================================================

-- Chi nhanh
INSERT INTO ChiNhanh (TenChiNhanh, DiaChi, TinhThanh, SoDienThoai, Email) VALUES
(N'30Shine Cau Giay',   N'72 Cau Giay, Dich Vong Hau',      N'Ha Noi',  '02466889999', 'caugiay@30shine.com'),
(N'30Shine Hoang Mai',  N'121 Nguyen Duc Canh, Tuong Mai',   N'Ha Noi',  '02466889998', 'hoangmai@30shine.com'),
(N'30Shine Binh Thanh', N'203 Xo Viet Nghe Tinh, Phuong 17',N'TP.HCM',  '02862889999', 'binhthanh@30shine.com'),
(N'30Shine Quan 7',     N'12 Nguyen Thi Thap, Tan Phu',      N'TP.HCM',  '02862889998', 'quan7@30shine.com');
GO

-- Nhan vien
INSERT INTO NhanVien (ChiNhanhID, MaNhanVien, HoTen, GioiTinh, SoDienThoai, ChucVu, LuongCoBan) VALUES
(1, 'NV001', N'Nguyen Van Hung',  N'Nam', '0901111111', N'Stylist',        5500000),
(1, 'NV002', N'Tran Dinh Khoa',   N'Nam', '0901111112', N'Senior Stylist', 8500000),
(1, 'NV003', N'Le Thi Hoa',       N'Nu',  '0901111113', N'Le tan',         4500000),
(2, 'NV004', N'Pham Minh Tuan',   N'Nam', '0901111114', N'Senior Stylist', 8500000),
(2, 'NV005', N'Hoang Van Long',   N'Nam', '0901111115', N'Stylist',        5500000),
(3, 'NV006', N'Vu Thi Lan',       N'Nu',  '0901111116', N'Quan ly',        13000000),
(3, 'NV007', N'Dang Quoc Huy',    N'Nam', '0901111117', N'Trainee',        3500000);
GO

-- Khach hang
INSERT INTO KhachHang (HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, HangThanhVien, DiemTichLuy, TongDiemTich) VALUES
(N'Nguyen Van An',  N'Nam', '1995-03-15', '0912345678', 'van.an@email.com',    1, 150, 250),
(N'Tran Minh Duc',  N'Nam', '1998-07-22', '0923456789', 'minh.duc@email.com',  0,  30,  30),
(N'Le Thanh Tung',  N'Nam', '1990-11-10', '0934567890', 'thanh.tung@email.com',2, 520, 700),
(N'Pham Quoc Huy',  N'Nam', '2000-05-18', '0945678901', 'quoc.huy@email.com',  0,   0,   0),
(N'Hoang Thi Mai',  N'Nu',  '1993-09-25', '0956789012', 'thi.mai@email.com',   1,  80, 120),
(N'Vu Dinh Long',   N'Nam', '1997-12-03', '0967890123', 'dinh.long@email.com', 3, 980,1500),
(N'Dang Thi Ngoc',  N'Nu',  '2001-04-17', '0978901234', 'thi.ngoc@email.com',  0,  10,  10);
GO

-- Dich vu
INSERT INTO DichVu (TenDichVu, DanhMuc, Gia, ThoiGianPhut, DiemThuong) VALUES
(N'Cat toc Nam co ban',          N'Cat & Tao kieu',    80000,  30,  8),
(N'Cat toc + Goi dau',           N'Cat & Tao kieu',   120000,  45, 12),
(N'Cat + Goi + Say tao kieu',    N'Cat & Tao kieu',   180000,  60, 18),
(N'Goi dau thu gian',            N'Goi dau & Massage', 80000,  30,  8),
(N'Goi + Massage dau co vai',    N'Goi dau & Massage',120000,  45, 12),
(N'Nhuom mau thoi trang',        N'Nhuom toc',        350000,  90, 35),
(N'Nhuom phu bac',               N'Nhuom toc',        200000,  60, 20),
(N'Uon Han Quoc',                N'Uon & Duoi',       450000, 120, 45),
(N'Duoi phong Nhat Ban',         N'Uon & Duoi',       500000, 120, 50),
(N'U toc Protein',               N'Cham soc toc',     150000,  45, 15),
(N'Combo Cat + Goi + Nhuom',     N'Combo',            480000, 120, 48),
(N'Combo VIP Cat + Uon + U toc', N'Combo',            680000, 180, 68);
GO

-- San pham ton kho (chi nhanh 1)
INSERT INTO SanPhamTonKho (ChiNhanhID, TenSanPham, ThuongHieu, DanhMuc, GiaNhap, GiaBan, SoLuong, SoLuongToiThieu) VALUES
(1, N'Dau goi Karseell Collagen', N'Karseell',      N'Dau goi',  80000, 150000, 20, 5),
(1, N'Dau xa duong am Argan',     N'OGX',           N'Dau xa',  100000, 185000, 15, 5),
(1, N'Wax tao kieu American Crew',N'American Crew', N'Wax',     120000, 250000, 10, 3),
(1, N'Serum duong toc TRESemme',  N'TRESemme',      N'Serum',    90000, 170000,  4, 5),
(1, N'Clay giu nep Suavecito',    N'Suavecito',     N'Wax',     130000, 270000, 12, 3),
(2, N'Dau goi Karseell Collagen', N'Karseell',      N'Dau goi',  80000, 150000, 18, 5),
(2, N'Wax tao kieu American Crew',N'American Crew', N'Wax',     120000, 250000,  3, 5);
GO

-- Khuyen mai
INSERT INTO KhuyenMai (MaCode, TenKhuyenMai, LoaiGiam, GiaTriGiam, GiaTriToiDa, DonHangToiThieu, SoLanToiDa, NgayBatDau, NgayKetThuc) VALUES
('WEEKEND10', N'Giam 10% cuoi tuan',       N'PhanTram', 10,  50000, 100000, 500, '2025-01-01', '2025-12-31'),
('NEWBIE50',  N'Tang 50k khach moi',        N'SoTien',   50000, NULL,      0, 999, '2025-01-01', '2025-06-30'),
('BIRTHDAY20',N'Sinh nhat giam 20%',        N'PhanTram', 20, 100000,      0,1000, '2025-01-01', '2025-12-31'),
('VIP15',     N'Thanh vien Vang giam 15%', N'PhanTram', 15, 150000, 200000, 200, '2025-01-01', '2025-12-31');
GO

PRINT N'';
PRINT N'=== FILE 2 HOAN THANH ===';
PRINT N'- Da tao: 7 Index';
PRINT N'- Da tao: 4 Stored Procedures';
PRINT N'- Da tao: 3 Views';
PRINT N'- Da them du lieu mau day du';
PRINT N'';
PRINT N'Vi du goi stored procedure:';
PRINT N'  EXEC SP_XemLichNgay @ChiNhanhID = 1;';
PRINT N'  EXEC SP_BaoCaoDoanhThu @TuNgay = ''2025-01-01'', @DenNgay = ''2025-12-31'';';
PRINT N'  SELECT * FROM V_ThongKeKhachHang;';
PRINT N'  SELECT * FROM V_TonKhoThap;';
GO