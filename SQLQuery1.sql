-- ============================================================
--  QUẢN LÝ TÀI CHÍNH
--  Database: SQL Server (T-SQL)
-- ============================================================



-- ============================================================
--  PHẦN 1: BẢNG DỮ LIỆU (TABLES)
-- ============================================================


-- Bảng 1: Người dùng
-- ----------------------------------------------------------
CREATE TABLE NguoiDung (
    Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Email       NVARCHAR(255)    NOT NULL UNIQUE,
    MatKhau     NVARCHAR(255)    NOT NULL,
    HoTen       NVARCHAR(100)    NOT NULL,
    VaiTro      NVARCHAR(20)     NOT NULL DEFAULT N'ca_nhan',
                                 -- 'ca_nhan' | 'quan_tri' | 'thanh_vien'
    TrangThai   BIT              NOT NULL DEFAULT 1,     -- 1 = hoạt động, 0 = khóa
    NgayTao     DATETIME2        NOT NULL DEFAULT GETDATE()
);
GO


-- Bảng 2: Danh mục thu / chi
-- ----------------------------------------------------------
CREATE TABLE DanhMuc (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NguoiDungId     UNIQUEIDENTIFIER NULL REFERENCES NguoiDung(Id) ON DELETE CASCADE,
                                     -- NULL = danh mục hệ thống dùng chung
    Ten             NVARCHAR(80)     NOT NULL,
    Loai            NVARCHAR(10)     NOT NULL,
                                     -- 'thu' | 'chi' | 'chuyen'
    BieuTuong       NVARCHAR(50)     NULL,
    MauSac          CHAR(7)          NULL,               -- mã màu hex, vd: '#FF5733'
    HeThong         BIT              NOT NULL DEFAULT 0  -- 1 = danh mục mặc định, không xóa
);
GO

-- Ràng buộc giá trị cột Loai
ALTER TABLE DanhMuc
    ADD CONSTRAINT CK_DanhMuc_Loai CHECK (Loai IN (N'thu', N'chi', N'chuyen'));
GO

-- Dữ liệu danh mục mặc định
INSERT INTO DanhMuc (Ten, Loai, BieuTuong, MauSac, HeThong) VALUES
    (N'Lương',          N'thu',    N'briefcase',    '#1D9E75', 1),
    (N'Thưởng',         N'thu',    N'gift',         '#5DCAA5', 1),
    (N'Thu nhập khác',  N'thu',    N'plus-circle',  '#85B7EB', 1),
    (N'Ăn uống',        N'chi',    N'utensils',     '#D85A30', 1),
    (N'Di chuyển',      N'chi',    N'car',          '#BA7517', 1),
    (N'Mua sắm',        N'chi',    N'shopping-bag', '#D4537E', 1),
    (N'Nhà ở',          N'chi',    N'home',         '#7F77DD', 1),
    (N'Y tế',           N'chi',    N'heart',        '#E24B4A', 1),
    (N'Giáo dục',       N'chi',    N'book',         '#639922', 1),
    (N'Giải trí',       N'chi',    N'smile',        '#EF9F27', 1),
    (N'Hóa đơn',        N'chi',    N'file-text',    '#888780', 1),
    (N'Chi phí khác',   N'chi',    N'more',         '#B4B2A9', 1),
    (N'Chuyển khoản',   N'chuyen', N'repeat',       '#3C3489', 1);
GO


-- Bảng 3: Tài khoản / Ví
-- ----------------------------------------------------------
CREATE TABLE TaiKhoan (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NguoiDungId     UNIQUEIDENTIFIER NOT NULL REFERENCES NguoiDung(Id) ON DELETE CASCADE,
    Ten             NVARCHAR(100)    NOT NULL,
    Loai            NVARCHAR(20)     NOT NULL DEFAULT N'tien_mat',
                                     -- 'tien_mat' | 'ngan_hang' | 'the_tin_dung' | 'vi_dien_tu' | 'khac'
    SoDuBanDau      DECIMAL(18,2)    NOT NULL DEFAULT 0,
    SoDuHienTai     DECIMAL(18,2)    NOT NULL DEFAULT 0,  -- tự động cập nhật qua trigger
    TenNganHang     NVARCHAR(100)    NULL,
    MauSac          CHAR(7)          NULL,
    BieuTuong       NVARCHAR(50)     NULL,
    TinhVaoTong     BIT              NOT NULL DEFAULT 1,  -- 1 = tính vào tổng tài sản
    NgayTao         DATETIME2        NOT NULL DEFAULT GETDATE(),
    DaXoa           BIT              NOT NULL DEFAULT 0
);
GO

ALTER TABLE TaiKhoan
    ADD CONSTRAINT CK_TaiKhoan_Loai
    CHECK (Loai IN (N'tien_mat', N'ngan_hang', N'the_tin_dung', N'vi_dien_tu', N'khac'));
GO


-- Bảng 4: Giao dịch
-- ----------------------------------------------------------
CREATE TABLE GiaoDich (
    Id                  UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NguoiDungId         UNIQUEIDENTIFIER NOT NULL REFERENCES NguoiDung(Id),
    TaiKhoanId          UNIQUEIDENTIFIER NOT NULL REFERENCES TaiKhoan(Id),
    DanhMucId           UNIQUEIDENTIFIER NULL     REFERENCES DanhMuc(Id),
    Loai                NVARCHAR(10)     NOT NULL,
                                         -- 'thu' | 'chi' | 'chuyen'
    SoTien              DECIMAL(18,2)    NOT NULL,
    GhiChu              NVARCHAR(MAX)    NULL,
    NgayGiaoDich        DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    TaiKhoanNhanId      UNIQUEIDENTIFIER NULL REFERENCES TaiKhoan(Id),
    PhiChuyenKhoan      DECIMAL(18,2)    NULL DEFAULT 0,
    NgayTao             DATETIME2        NOT NULL DEFAULT GETDATE(),
    DaXoa               BIT              NOT NULL DEFAULT 0  -- KHÔNG xóa thật, chỉ đánh dấu
);
GO

ALTER TABLE GiaoDich
    ADD CONSTRAINT CK_GiaoDich_Loai
    CHECK (Loai IN (N'thu', N'chi', N'chuyen'));

ALTER TABLE GiaoDich
    ADD CONSTRAINT CK_GiaoDich_SoTien
    CHECK (SoTien > 0);

ALTER TABLE GiaoDich
    ADD CONSTRAINT CK_GiaoDich_Chuyen
    CHECK (
        (Loai = N'chuyen' AND TaiKhoanNhanId IS NOT NULL)
        OR
        (Loai <> N'chuyen' AND TaiKhoanNhanId IS NULL)
    );
GO


-- Bảng 5: Ngân sách theo tháng
-- ----------------------------------------------------------
CREATE TABLE NganSach (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NguoiDungId     UNIQUEIDENTIFIER NOT NULL REFERENCES NguoiDung(Id) ON DELETE CASCADE,
    DanhMucId       UNIQUEIDENTIFIER NOT NULL REFERENCES DanhMuc(Id),
    Nam             SMALLINT         NOT NULL,
    Thang           SMALLINT         NOT NULL,
    HanMuc          DECIMAL(18,2)    NOT NULL,
    CanhBao80       BIT              NOT NULL DEFAULT 1,  -- 1 = gửi thông báo khi đạt 80%
    GhiChu          NVARCHAR(MAX)    NULL,
    NgayTao         DATETIME2        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_NganSach UNIQUE (NguoiDungId, DanhMucId, Nam, Thang)
);
GO

ALTER TABLE NganSach
    ADD CONSTRAINT CK_NganSach_Thang  CHECK (Thang BETWEEN 1 AND 12);

ALTER TABLE NganSach
    ADD CONSTRAINT CK_NganSach_HanMuc CHECK (HanMuc > 0);
GO


-- Bảng 6: Thông báo
-- ----------------------------------------------------------
CREATE TABLE ThongBao (
    Id              UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    NguoiDungId     UNIQUEIDENTIFIER NOT NULL REFERENCES NguoiDung(Id) ON DELETE CASCADE,
    Loai            NVARCHAR(30)     NOT NULL,
                                     -- 'ngan_sach_80' | 'ngan_sach_100' | 'he_thong'
    TieuDe          NVARCHAR(200)    NOT NULL,
    NoiDung         NVARCHAR(MAX)    NULL,
    DaDoc           BIT              NOT NULL DEFAULT 0,
    NgayTao         DATETIME2        NOT NULL DEFAULT GETDATE()
);
GO


-- ============================================================
--  PHẦN 2: CHỈ MỤC (INDEXES)
-- ============================================================

CREATE INDEX IDX_GiaoDich_NguoiDung
    ON GiaoDich(NguoiDungId, NgayGiaoDich DESC)
    WHERE DaXoa = 0;

CREATE INDEX IDX_GiaoDich_TaiKhoan
    ON GiaoDich(TaiKhoanId)
    WHERE DaXoa = 0;

CREATE INDEX IDX_GiaoDich_DanhMuc
    ON GiaoDich(DanhMucId)
    WHERE DaXoa = 0;

CREATE INDEX IDX_NganSach_NguoiDung
    ON NganSach(NguoiDungId, Nam, Thang);

CREATE INDEX IDX_ThongBao_NguoiDung
    ON ThongBao(NguoiDungId, DaDoc, NgayTao DESC);
GO


-- ============================================================
--  PHẦN 3: HÀM (FUNCTIONS)
-- ============================================================


-- Hàm 1: Tính tổng tài sản của một người dùng
-- ----------------------------------------------------------
CREATE FUNCTION fn_TongTaiSan (@NguoiDungId UNIQUEIDENTIFIER)
RETURNS DECIMAL(18,2)
AS
BEGIN
    DECLARE @TongTaiSan DECIMAL(18,2);

    SELECT @TongTaiSan = ISNULL(SUM(SoDuHienTai), 0)
    FROM TaiKhoan
    WHERE NguoiDungId = @NguoiDungId
      AND TinhVaoTong = 1
      AND DaXoa       = 0;

    RETURN @TongTaiSan;
END;
GO


-- Hàm 2: Tính % đã dùng của một ngân sách
-- ----------------------------------------------------------
CREATE FUNCTION fn_PhanTramNganSach (
    @NguoiDungId UNIQUEIDENTIFIER,
    @DanhMucId   UNIQUEIDENTIFIER,
    @Nam         INT,
    @Thang       INT
)
RETURNS DECIMAL(5,1)
AS
BEGIN
    DECLARE @HanMuc  DECIMAL(18,2);
    DECLARE @DaChi   DECIMAL(18,2);

    SELECT @HanMuc = HanMuc
    FROM NganSach
    WHERE NguoiDungId = @NguoiDungId
      AND DanhMucId   = @DanhMucId
      AND Nam         = @Nam
      AND Thang       = @Thang;

    IF @HanMuc IS NULL OR @HanMuc = 0
        RETURN 0;

    SELECT @DaChi = ISNULL(SUM(SoTien), 0)
    FROM GiaoDich
    WHERE NguoiDungId = @NguoiDungId
      AND DanhMucId   = @DanhMucId
      AND Loai        = N'chi'
      AND DaXoa       = 0
      AND YEAR(NgayGiaoDich)  = @Nam
      AND MONTH(NgayGiaoDich) = @Thang;

    RETURN ROUND(@DaChi / @HanMuc * 100, 1);
END;
GO


-- Hàm 3: Lấy tổng thu/chi trong khoảng ngày
-- ----------------------------------------------------------
CREATE FUNCTION fn_TongThuChi (
    @NguoiDungId UNIQUEIDENTIFIER,
    @TuNgay      DATE,
    @DenNgay     DATE
)
RETURNS TABLE
AS
RETURN (
    SELECT
        ISNULL(SUM(CASE WHEN Loai = N'thu' THEN SoTien ELSE 0 END), 0) AS TongThu,
        ISNULL(SUM(CASE WHEN Loai = N'chi' THEN SoTien ELSE 0 END), 0) AS TongChi,
        ISNULL(SUM(CASE WHEN Loai = N'thu' THEN  SoTien
                        WHEN Loai = N'chi' THEN -SoTien
                        ELSE 0 END), 0)                                 AS TietKiem
    FROM GiaoDich
    WHERE NguoiDungId    = @NguoiDungId
      AND DaXoa          = 0
      AND NgayGiaoDich   BETWEEN @TuNgay AND @DenNgay
);
GO


-- ============================================================
--  PHẦN 4: TRIGGER
-- ============================================================


-- Trigger: Tự động cập nhật số dư khi thêm / xóa mềm giao dịch
-- ----------------------------------------------------------
CREATE TRIGGER trg_CapNhatSoDu
ON GiaoDich
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- ── THÊM giao dịch mới ──────────────────────────────────
    IF EXISTS (SELECT 1 FROM inserted i
               LEFT JOIN deleted d ON d.Id = i.Id
               WHERE d.Id IS NULL AND i.DaXoa = 0)
    BEGIN
        -- Thu: cộng vào tài khoản nguồn
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai + i.SoTien
        FROM TaiKhoan tk
        JOIN inserted  i ON i.TaiKhoanId = tk.Id
        LEFT JOIN deleted d ON d.Id = i.Id
        WHERE i.Loai = N'thu' AND i.DaXoa = 0 AND d.Id IS NULL;

        -- Chi: trừ khỏi tài khoản nguồn
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai - i.SoTien
        FROM TaiKhoan tk
        JOIN inserted  i ON i.TaiKhoanId = tk.Id
        LEFT JOIN deleted d ON d.Id = i.Id
        WHERE i.Loai = N'chi' AND i.DaXoa = 0 AND d.Id IS NULL;

        -- Chuyển khoản: trừ tài khoản nguồn
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai - i.SoTien - ISNULL(i.PhiChuyenKhoan, 0)
        FROM TaiKhoan tk
        JOIN inserted  i ON i.TaiKhoanId = tk.Id
        LEFT JOIN deleted d ON d.Id = i.Id
        WHERE i.Loai = N'chuyen' AND i.DaXoa = 0 AND d.Id IS NULL;

        -- Chuyển khoản: cộng tài khoản nhận
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai + i.SoTien
        FROM TaiKhoan tk
        JOIN inserted  i ON i.TaiKhoanNhanId = tk.Id
        LEFT JOIN deleted d ON d.Id = i.Id
        WHERE i.Loai = N'chuyen' AND i.DaXoa = 0 AND d.Id IS NULL;
    END;

    -- ── XÓA MỀM giao dịch (DaXoa: 0 → 1) → HOÀN TÁC số dư ─
    IF EXISTS (SELECT 1 FROM inserted i
               JOIN deleted d ON d.Id = i.Id
               WHERE d.DaXoa = 0 AND i.DaXoa = 1)
    BEGIN
        -- Hoàn tác Thu
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai - d.SoTien
        FROM TaiKhoan tk
        JOIN deleted   d ON d.TaiKhoanId = tk.Id
        JOIN inserted  i ON i.Id = d.Id
        WHERE d.Loai = N'thu' AND d.DaXoa = 0 AND i.DaXoa = 1;

        -- Hoàn tác Chi
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai + d.SoTien
        FROM TaiKhoan tk
        JOIN deleted   d ON d.TaiKhoanId = tk.Id
        JOIN inserted  i ON i.Id = d.Id
        WHERE d.Loai = N'chi' AND d.DaXoa = 0 AND i.DaXoa = 1;

        -- Hoàn tác Chuyển khoản: cộng lại tài khoản nguồn
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai + d.SoTien + ISNULL(d.PhiChuyenKhoan, 0)
        FROM TaiKhoan tk
        JOIN deleted   d ON d.TaiKhoanId = tk.Id
        JOIN inserted  i ON i.Id = d.Id
        WHERE d.Loai = N'chuyen' AND d.DaXoa = 0 AND i.DaXoa = 1;

        -- Hoàn tác Chuyển khoản: trừ lại tài khoản nhận
        UPDATE TaiKhoan
        SET SoDuHienTai = SoDuHienTai - d.SoTien
        FROM TaiKhoan tk
        JOIN deleted   d ON d.TaiKhoanNhanId = tk.Id
        JOIN inserted  i ON i.Id = d.Id
        WHERE d.Loai = N'chuyen' AND d.DaXoa = 0 AND i.DaXoa = 1;
    END;
END;
GO


-- ============================================================
--  PHẦN 5: VIEW
-- ============================================================


-- View 1: Tổng hợp thu / chi / tiết kiệm theo tháng
-- ----------------------------------------------------------
CREATE VIEW v_ThongKeThang AS
SELECT
    NguoiDungId,
    YEAR(NgayGiaoDich)                                              AS Nam,
    MONTH(NgayGiaoDich)                                             AS Thang,
    SUM(CASE WHEN Loai = N'thu' THEN SoTien ELSE 0 END)            AS TongThu,
    SUM(CASE WHEN Loai = N'chi' THEN SoTien ELSE 0 END)            AS TongChi,
    SUM(CASE WHEN Loai = N'thu' THEN  SoTien
             WHEN Loai = N'chi' THEN -SoTien
             ELSE 0 END)                                            AS TietKiem
FROM GiaoDich
WHERE DaXoa = 0
GROUP BY NguoiDungId, YEAR(NgayGiaoDich), MONTH(NgayGiaoDich);
GO


-- View 2: Chi tiêu theo danh mục trong tháng
-- ----------------------------------------------------------
CREATE VIEW v_ChiTieuDanhMuc AS
SELECT
    gd.NguoiDungId,
    dm.Id                                                           AS DanhMucId,
    dm.Ten                                                          AS TenDanhMuc,
    dm.MauSac,
    dm.BieuTuong,
    YEAR(gd.NgayGiaoDich)                                           AS Nam,
    MONTH(gd.NgayGiaoDich)                                          AS Thang,
    SUM(gd.SoTien)                                                  AS TongChi,
    COUNT(*)                                                        AS SoGiaoDich
FROM GiaoDich gd
JOIN DanhMuc  dm ON dm.Id = gd.DanhMucId
WHERE gd.Loai = N'chi' AND gd.DaXoa = 0
GROUP BY
    gd.NguoiDungId,
    dm.Id, dm.Ten, dm.MauSac, dm.BieuTuong,
    YEAR(gd.NgayGiaoDich), MONTH(gd.NgayGiaoDich);
GO


-- View 3: Tiến độ ngân sách tháng
-- ----------------------------------------------------------
CREATE VIEW v_TienDoNganSach AS
SELECT
    ns.NguoiDungId,
    ns.DanhMucId,
    dm.Ten                                                          AS TenDanhMuc,
    dm.MauSac,
    dm.BieuTuong,
    ns.Nam,
    ns.Thang,
    ns.HanMuc,
    ISNULL(chi.TongChi, 0)                                         AS DaChi,
    ns.HanMuc - ISNULL(chi.TongChi, 0)                             AS ConLai,
    ROUND(ISNULL(chi.TongChi, 0) / ns.HanMuc * 100, 1)             AS PhanTram
FROM NganSach ns
JOIN DanhMuc  dm ON dm.Id = ns.DanhMucId
LEFT JOIN (
    SELECT
        NguoiDungId,
        DanhMucId,
        YEAR(NgayGiaoDich)  AS Nam,
        MONTH(NgayGiaoDich) AS Thang,
        SUM(SoTien)         AS TongChi
    FROM GiaoDich
    WHERE Loai = N'chi' AND DaXoa = 0
    GROUP BY NguoiDungId, DanhMucId, YEAR(NgayGiaoDich), MONTH(NgayGiaoDich)
) chi
    ON  chi.DanhMucId   = ns.DanhMucId
    AND chi.NguoiDungId = ns.NguoiDungId
    AND chi.Nam         = ns.Nam
    AND chi.Thang       = ns.Thang;
GO


-- View 4: Số dư tất cả tài khoản của người dùng
-- ----------------------------------------------------------
CREATE VIEW v_SoDuTaiKhoan AS
SELECT
    tk.NguoiDungId,
    tk.Id                                                           AS TaiKhoanId,
    tk.Ten                                                          AS TenTaiKhoan,
    tk.Loai,
    tk.TenNganHang,
    tk.SoDuHienTai,
    tk.MauSac,
    tk.BieuTuong,
    tk.TinhVaoTong
FROM TaiKhoan tk
WHERE tk.DaXoa = 0;
GO


-- ============================================================
--  PHẦN 6: DỮ LIỆU MẪU ĐỂ TEST
-- ============================================================

-- Tạo người dùng mẫu
DECLARE @NguoiDungId UNIQUEIDENTIFIER = '11111111-1111-1111-1111-111111111111';

INSERT INTO NguoiDung (Id, Email, MatKhau, HoTen)
VALUES (@NguoiDungId, N'nguyen@example.com', N'$2b$10$hash...', N'Nguyễn Văn An');

-- Tạo tài khoản mẫu
INSERT INTO TaiKhoan (NguoiDungId, Ten, Loai, SoDuBanDau, SoDuHienTai, MauSac) VALUES
    (@NguoiDungId, N'Tiền mặt',    N'tien_mat',   500000,   500000,   '#1D9E75'),
    (@NguoiDungId, N'Vietcombank', N'ngan_hang',  10000000, 10000000, '#378ADD'),
    (@NguoiDungId, N'MoMo',        N'vi_dien_tu', 200000,   200000,   '#D4537E');

-- Tạo ngân sách tháng hiện tại
INSERT INTO NganSach (NguoiDungId, DanhMucId, Nam, Thang, HanMuc)
SELECT
    @NguoiDungId,
    Id,
    YEAR(GETDATE()),
    MONTH(GETDATE()),
    CASE Ten
        WHEN N'Ăn uống'   THEN 3000000
        WHEN N'Di chuyển' THEN 1000000
        WHEN N'Mua sắm'   THEN 2000000
        WHEN N'Giải trí'  THEN 500000
        ELSE 1000000
    END
FROM DanhMuc
WHERE Loai = N'chi' AND HeThong = 1;

-- Tạo vài giao dịch mẫu
DECLARE @TkTienMat  UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM TaiKhoan WHERE NguoiDungId = @NguoiDungId AND Ten = N'Tiền mặt');
DECLARE @TkVcb      UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM TaiKhoan WHERE NguoiDungId = @NguoiDungId AND Ten = N'Vietcombank');
DECLARE @DmLuong    UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DanhMuc WHERE Ten = N'Lương');
DECLARE @DmAnUong   UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DanhMuc WHERE Ten = N'Ăn uống');
DECLARE @DmDiChuyen UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM DanhMuc WHERE Ten = N'Di chuyển');

INSERT INTO GiaoDich (NguoiDungId, TaiKhoanId, DanhMucId, Loai, SoTien, GhiChu, NgayGiaoDich) VALUES
    (@NguoiDungId, @TkVcb,     @DmLuong,    N'thu', 15000000, N'Lương tháng 3',      DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)),
    (@NguoiDungId, @TkTienMat, @DmAnUong,   N'chi', 85000,    N'Cơm trưa văn phòng', GETDATE()),
    (@NguoiDungId, @TkTienMat, @DmDiChuyen, N'chi', 50000,    N'Xăng xe',            GETDATE());
GO


-- ============================================================
--  VÍ DỤ TRUY VẤN SỬ DỤNG
-- ============================================================

-- Xem tổng tài sản
-- SELECT dbo.fn_TongTaiSan('11111111-1111-1111-1111-111111111111');

-- Xem % ngân sách ăn uống tháng này
-- SELECT dbo.fn_PhanTramNganSach(
--     '11111111-1111-1111-1111-111111111111',
--     (SELECT Id FROM DanhMuc WHERE Ten = N'Ăn uống'),
--     YEAR(GETDATE()), MONTH(GETDATE())
-- );

-- Xem tiến độ ngân sách tháng này
-- SELECT * FROM v_TienDoNganSach
-- WHERE NguoiDungId = '11111111-1111-1111-1111-111111111111'
--   AND Nam = YEAR(GETDATE()) AND Thang = MONTH(GETDATE());

-- Xem thống kê thu/chi 3 tháng gần nhất
-- SELECT * FROM v_ThongKeThang
-- WHERE NguoiDungId = '11111111-1111-1111-1111-111111111111'
-- ORDER BY Nam DESC, Thang DESC;

-- ============================================================
--  END
-- ============================================================