-- ============================================================
-- HỆ THỐNG QUẢN LÝ CỬA HÀNG CẮT TÓC
-- Database: DoAn3  |  Phiên bản: 2.0
-- Thay đổi:
--   - Dùng mã tự đặt làm khóa chính (bỏ cột *ID thừa)
--   - Tách Quản lý và Nhân viên thành 2 bảng riêng
-- ============================================================


USE DoAn3;
GO

-- ============================================================
-- BẢNG 1: CHI NHÁNH
-- Khóa chính: MaChiNhanh (VD: CN001)
-- ============================================================
CREATE TABLE ChiNhanh (
    MaChiNhanh      VARCHAR(10)    PRIMARY KEY,        -- VD: CN001
    TenChiNhanh     NVARCHAR(100)  NOT NULL,
    DiaChi          NVARCHAR(255)  NOT NULL,
    TinhThanh       NVARCHAR(50)   NOT NULL,
    SoDienThoai     VARCHAR(15),
    Email           VARCHAR(100),
    GioMoCua        TIME           DEFAULT '08:00:00',
    GioDongCua      TIME           DEFAULT '21:00:00',
    TrangThai       BIT            DEFAULT 1,          -- 1: Hoạt động | 0: Đóng
    NgayTao         DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- BẢNG 2: QUẢN LÝ
-- Tách riêng khỏi NhanVien, chịu trách nhiệm 1 chi nhánh
-- Khóa chính: MaQuanLy (VD: QL001)
-- ============================================================
CREATE TABLE QuanLy (
    MaQuanLy        VARCHAR(10)    PRIMARY KEY,        -- VD: QL001
    MaChiNhanh      VARCHAR(10)    NOT NULL,
    HoTen           NVARCHAR(100)  NOT NULL,
    GioiTinh        NVARCHAR(10),
    NgaySinh        DATE,
    SoDienThoai     VARCHAR(15)    UNIQUE NOT NULL,
    Email           VARCHAR(100)   UNIQUE,
    LuongCoBan      DECIMAL(12,2)  DEFAULT 0,
    TrangThai       BIT            DEFAULT 1,
    NgayVaoLam      DATE           DEFAULT CAST(GETDATE() AS DATE),
    MatKhau         VARCHAR(255),
    NgayTao         DATETIME       DEFAULT GETDATE(),

    CONSTRAINT FK_QuanLy_ChiNhanh FOREIGN KEY (MaChiNhanh)
        REFERENCES ChiNhanh(MaChiNhanh)
);
GO

-- ============================================================
-- BẢNG 3: NHÂN VIÊN
-- Chỉ bao gồm thợ kỹ thuật (Trainee / Stylist / Senior Stylist / Lễ tân)
-- Khóa chính: MaNhanVien (VD: NV001)
-- ============================================================
CREATE TABLE NhanVien (
    MaNhanVien      VARCHAR(10)    PRIMARY KEY,        -- VD: NV001
    MaChiNhanh      VARCHAR(10)    NOT NULL,
    HoTen           NVARCHAR(100)  NOT NULL,
    GioiTinh        NVARCHAR(10),
    NgaySinh        DATE,
    SoDienThoai     VARCHAR(15)    UNIQUE NOT NULL,
    Email           VARCHAR(100)   UNIQUE,
    -- ChucVu: Trainee | Stylist | Senior Stylist | Le tan
    ChucVu          NVARCHAR(30)   NOT NULL DEFAULT N'Stylist',
    LuongCoBan      DECIMAL(12,2)  DEFAULT 0,
    TrangThai       BIT            DEFAULT 1,
    NgayVaoLam      DATE           DEFAULT CAST(GETDATE() AS DATE),
    MatKhau         VARCHAR(255),
    NgayTao         DATETIME       DEFAULT GETDATE(),

    CONSTRAINT FK_NhanVien_ChiNhanh FOREIGN KEY (MaChiNhanh)
        REFERENCES ChiNhanh(MaChiNhanh)
);
GO

-- ============================================================
-- BẢNG 4: KHÁCH HÀNG
-- Khóa chính: SoDienThoai (duy nhất, dùng để định danh)
-- ============================================================
CREATE TABLE KhachHang (
    SoDienThoai     VARCHAR(15)    PRIMARY KEY,        -- VD: 0901234567
    HoTen           NVARCHAR(100)  NOT NULL,
    GioiTinh        NVARCHAR(10),
    NgaySinh        DATE,
    Email           VARCHAR(100)   UNIQUE,
    -- HangThanhVien: 0=Thường | 1=Bạc | 2=Vàng | 3=Kim cương
    HangThanhVien   INT            DEFAULT 0,
    DiemTichLuy     INT            DEFAULT 0,          -- Điểm hiện có
    TongDiemTich    INT            DEFAULT 0,          -- Tổng điểm lịch sử
    TrangThai       BIT            DEFAULT 1,
    MatKhau         VARCHAR(255),
    NgayDangKy      DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- BẢNG 5: DỊCH VỤ
-- Khóa chính: MaDichVu (VD: DV001)
-- ============================================================
CREATE TABLE DichVu (
    MaDichVu        VARCHAR(10)    PRIMARY KEY,        -- VD: DV001
    TenDichVu       NVARCHAR(150)  NOT NULL,
    -- DanhMuc: Cat & Tao kieu | Goi dau & Massage | Nhuom | Uon & Duoi | Cham soc | Combo
    DanhMuc         NVARCHAR(50)   NOT NULL,
    MoTa            NVARCHAR(500),
    Gia             DECIMAL(12,2)  NOT NULL,
    GiaSauGiam      DECIMAL(12,2),                     -- NULL = không giảm
    ThoiGianPhut    INT            DEFAULT 30,
    DiemThuong      INT            DEFAULT 0,
    TrangThai       BIT            DEFAULT 1,
    NgayTao         DATETIME       DEFAULT GETDATE()
);
GO

-- ============================================================
-- BẢNG 6: SẢN PHẨM & TỒN KHO
-- Khóa chính: MaSanPham (VD: SP001)
-- Quản lý tồn kho theo từng chi nhánh
-- ============================================================
CREATE TABLE SanPhamTonKho (
    MaSanPham       VARCHAR(10)    NOT NULL,           -- VD: SP001
    MaChiNhanh      VARCHAR(10)    NOT NULL,
    TenSanPham      NVARCHAR(150)  NOT NULL,
    ThuongHieu      NVARCHAR(100),
    -- DanhMuc: Dau goi | Dau xa | Wax | Serum | Thuoc nhuom
    DanhMuc         NVARCHAR(50),
    GiaNhap         DECIMAL(12,2)  DEFAULT 0,
    GiaBan          DECIMAL(12,2)  NOT NULL,
    SoLuong         INT            DEFAULT 0,
    SoLuongToiThieu INT            DEFAULT 5,
    TrangThai       BIT            DEFAULT 1,
    NgayCapNhat     DATETIME       DEFAULT GETDATE(),

    CONSTRAINT PK_SanPhamTonKho PRIMARY KEY (MaSanPham, MaChiNhanh),
    CONSTRAINT FK_SanPham_ChiNhanh FOREIGN KEY (MaChiNhanh)
        REFERENCES ChiNhanh(MaChiNhanh)
);
GO

-- ============================================================
-- BẢNG 7: KHUYẾN MÃI
-- Khóa chính: MaCode (mã voucher, VD: SALE10)
-- ============================================================
CREATE TABLE KhuyenMai (
    MaCode              VARCHAR(30)    PRIMARY KEY,    -- VD: SALE10, SUMMER2025
    TenKhuyenMai        NVARCHAR(150)  NOT NULL,
    -- LoaiGiam: PhanTram | SoTien
    LoaiGiam            NVARCHAR(20)   DEFAULT N'PhanTram',
    GiaTriGiam          DECIMAL(12,2)  NOT NULL,
    GiaTriToiDa         DECIMAL(12,2),                -- Chỉ áp dụng khi LoaiGiam = PhanTram
    DonHangToiThieu     DECIMAL(12,2)  DEFAULT 0,
    SoLanDung           INT            DEFAULT 0,
    SoLanToiDa          INT            DEFAULT 100,
    NgayBatDau          DATE           NOT NULL,
    NgayKetThuc         DATE           NOT NULL,
    TrangThai           BIT            DEFAULT 1
);
GO

-- ============================================================
-- BẢNG 8: ĐẶT LỊCH
-- Khóa chính: MaDatLich (VD: DL20250001)
-- ============================================================
CREATE TABLE DatLich (
    MaDatLich       VARCHAR(20)    PRIMARY KEY,        -- VD: DL20250001
    SoDienThoai     VARCHAR(15)    NOT NULL,           -- FK -> KhachHang
    MaChiNhanh      VARCHAR(10)    NOT NULL,
    MaNhanVien      VARCHAR(10),                       -- NULL = chưa chỉ định thợ
    ThoiGianHen     DATETIME       NOT NULL,
    ThoiGianKetThuc DATETIME,
    -- TrangThai: ChoXacNhan | DaXacNhan | DangPhucVu | HoanThanh | DaHuy
    TrangThai       NVARCHAR(20)   DEFAULT N'ChoXacNhan',
    -- NguonDatLich: Website | App | TaiQuay | Hotline
    NguonDatLich    NVARCHAR(20)   DEFAULT N'Website',
    GhiChu          NVARCHAR(500),
    NgayTao         DATETIME       DEFAULT GETDATE(),

    CONSTRAINT FK_DatLich_KhachHang FOREIGN KEY (SoDienThoai)
        REFERENCES KhachHang(SoDienThoai),
    CONSTRAINT FK_DatLich_ChiNhanh  FOREIGN KEY (MaChiNhanh)
        REFERENCES ChiNhanh(MaChiNhanh),
    CONSTRAINT FK_DatLich_NhanVien  FOREIGN KEY (MaNhanVien)
        REFERENCES NhanVien(MaNhanVien)
);
GO

-- ============================================================
-- BẢNG 9: CHI TIẾT ĐẶT LỊCH
-- Dịch vụ được chọn trong 1 lịch hẹn
-- ============================================================
CREATE TABLE ChiTietDatLich (
    MaDatLich       VARCHAR(20)    NOT NULL,
    MaDichVu        VARCHAR(10)    NOT NULL,
    SoLuong         INT            DEFAULT 1,

    CONSTRAINT PK_ChiTietDatLich PRIMARY KEY (MaDatLich, MaDichVu),
    CONSTRAINT FK_CTDL_DatLich FOREIGN KEY (MaDatLich)
        REFERENCES DatLich(MaDatLich),
    CONSTRAINT FK_CTDL_DichVu  FOREIGN KEY (MaDichVu)
        REFERENCES DichVu(MaDichVu)
);
GO

-- ============================================================
-- BẢNG 10: HÓA ĐƠN
-- Khóa chính: MaHoaDon (VD: HD20250001)
-- ============================================================
CREATE TABLE HoaDon (
    MaHoaDon            VARCHAR(20)    PRIMARY KEY,    -- VD: HD20250001
    SoDienThoai         VARCHAR(15)    NOT NULL,       -- FK -> KhachHang
    MaDatLich           VARCHAR(20),
    MaChiNhanh          VARCHAR(10)    NOT NULL,
    MaCode              VARCHAR(30),                   -- FK -> KhuyenMai
    TongTien            DECIMAL(12,2)  DEFAULT 0,      -- Trước giảm giá
    GiamGia             DECIMAL(12,2)  DEFAULT 0,
    ThanhTien           DECIMAL(12,2)  NOT NULL,       -- Thực thu
    DiemDuocCong        INT            DEFAULT 0,
    DiemDaDung          INT            DEFAULT 0,
    -- PhuongThucTT: TienMat | ChuyenKhoan | Momo | VNPay
    PhuongThucTT        NVARCHAR(20)   DEFAULT N'TienMat',
    ThoiGianTT          DATETIME       DEFAULT GETDATE(),
    GhiChu              NVARCHAR(500),

    CONSTRAINT FK_HoaDon_KhachHang FOREIGN KEY (SoDienThoai)
        REFERENCES KhachHang(SoDienThoai),
    CONSTRAINT FK_HoaDon_DatLich   FOREIGN KEY (MaDatLich)
        REFERENCES DatLich(MaDatLich),
    CONSTRAINT FK_HoaDon_ChiNhanh  FOREIGN KEY (MaChiNhanh)
        REFERENCES ChiNhanh(MaChiNhanh),
    CONSTRAINT FK_HoaDon_KhuyenMai FOREIGN KEY (MaCode)
        REFERENCES KhuyenMai(MaCode)
);
GO

-- ============================================================
-- BẢNG 11: CHI TIẾT HÓA ĐƠN
-- Dịch vụ đã thực hiện + nhân viên thực hiện
-- ============================================================
CREATE TABLE ChiTietHoaDon (
    MaHoaDon            VARCHAR(20)    NOT NULL,
    MaDichVu            VARCHAR(10)    NOT NULL,
    MaNhanVien          VARCHAR(10),                   -- Thợ đã thực hiện dịch vụ này
    SoLuong             INT            DEFAULT 1,
    DonGia              DECIMAL(12,2)  NOT NULL,
    ThanhTien           DECIMAL(12,2)  NOT NULL,

    CONSTRAINT PK_ChiTietHoaDon PRIMARY KEY (MaHoaDon, MaDichVu),
    CONSTRAINT FK_CTHD_HoaDon   FOREIGN KEY (MaHoaDon)
        REFERENCES HoaDon(MaHoaDon),
    CONSTRAINT FK_CTHD_DichVu   FOREIGN KEY (MaDichVu)
        REFERENCES DichVu(MaDichVu),
    CONSTRAINT FK_CTHD_NhanVien FOREIGN KEY (MaNhanVien)
        REFERENCES NhanVien(MaNhanVien)
);
GO

-- ============================================================
-- BẢNG 12: ĐÁNH GIÁ
-- Mỗi hóa đơn chỉ đánh giá 1 lần
-- ============================================================
CREATE TABLE DanhGia (
    MaHoaDon        VARCHAR(20)    PRIMARY KEY,        -- 1 hóa đơn = 1 đánh giá
    SoDienThoai     VARCHAR(15)    NOT NULL,           -- FK -> KhachHang
    MaNhanVien      VARCHAR(10),
    SaoDichVu       INT            CHECK (SaoDichVu   BETWEEN 1 AND 5),
    SaoNhanVien     INT            CHECK (SaoNhanVien BETWEEN 1 AND 5),
    SaoCuaHang      INT            CHECK (SaoCuaHang  BETWEEN 1 AND 5),
    NhanXet         NVARCHAR(1000),
    PhanHoiShop     NVARCHAR(1000),
    NgayDanhGia     DATETIME       DEFAULT GETDATE(),

    CONSTRAINT FK_DanhGia_HoaDon    FOREIGN KEY (MaHoaDon)
        REFERENCES HoaDon(MaHoaDon),
    CONSTRAINT FK_DanhGia_KhachHang FOREIGN KEY (SoDienThoai)
        REFERENCES KhachHang(SoDienThoai),
    CONSTRAINT FK_DanhGia_NhanVien  FOREIGN KEY (MaNhanVien)
        REFERENCES NhanVien(MaNhanVien)
);
GO

PRINT N'=== HOÀN THÀNH: Database DoAn3 v2.0 với 12 bảng ===';
PRINT N'Thay đổi so với v1.0:';
PRINT N'  + Tất cả bảng dùng mã tự đặt làm khóa chính (bỏ cột *ID thừa)';
PRINT N'  + Tách QuanLy thành bảng riêng (trước gộp trong NhanVien)';
PRINT N'  + KhachHang dùng SoDienThoai làm khóa chính';
PRINT N'  + Bảng phụ thuộc nhiều-nhiều dùng khóa chính kép (bỏ cột ID thừa)';
PRINT N'  + KhuyenMai dùng MaCode trực tiếp làm khóa chính';
GO