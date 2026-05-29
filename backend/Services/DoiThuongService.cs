using backend.Data;
using backend.Models.DTOs;
using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Services;

public class DoiThuongService : IDoiThuongService
{
    private readonly IDoiThuongRepository _repo;
    private readonly IKhachHangRepository _khRepo;
    private readonly IKhuyenMaiRepository _kmRepo;
    private readonly string _conn;

    public DoiThuongService(
        IDoiThuongRepository repo, 
        IKhachHangRepository khRepo,
        IKhuyenMaiRepository kmRepo,
        IConfiguration config)
    {
        _repo = repo;
        _khRepo = khRepo;
        _kmRepo = kmRepo;
        _conn = config.GetConnectionString("DefaultConnection")!;
    }

    public Task<IEnumerable<dynamic>> GetLichSu(string soDienThoai) => _repo.GetBySoDienThoai(soDienThoai);

    public async Task<DoiThuongResponse> DoiDiem(DoiThuongRequest request)
    {
        // Kiểm tra khách hàng
        var khachHang = await _khRepo.GetById(request.SoDienThoai);
        if (khachHang == null)
        {
            return new DoiThuongResponse 
            { 
                Success = false, 
                Message = "Không tìm thấy khách hàng!" 
            };
        }

        // Kiểm tra điểm hiện có
        int diemHienCo = khachHang.DiemTichLuy ?? 0;
        if (diemHienCo < request.DiemDoi)
        {
            return new DoiThuongResponse 
            { 
                Success = false, 
                Message = $"Không đủ điểm! Bạn có {diemHienCo} điểm, cần {request.DiemDoi} điểm." 
            };
        }

        // Quy tắc đổi thưởng theo loại
        string tenKhuyenMai;
        string loaiGiam;
        decimal giaTriGiam;
        decimal? giaTriToiDa;
        int diemCanThiet;

        switch (request.LoaiDoiThuong)
        {
            case "giam10":
                diemCanThiet = 50;
                tenKhuyenMai = "Giảm 10% hóa đơn (đổi điểm)";
                loaiGiam = "PhanTram";
                giaTriGiam = 10;
                giaTriToiDa = 50000;
                break;
            case "giam20":
                diemCanThiet = 100;
                tenKhuyenMai = "Giảm 20% hóa đơn (đổi điểm)";
                loaiGiam = "PhanTram";
                giaTriGiam = 20;
                giaTriToiDa = 100000;
                break;
            case "goiDau":
                diemCanThiet = 30;
                tenKhuyenMai = "Miễn phí gội đầu (đổi điểm)";
                loaiGiam = "SoTien";
                giaTriGiam = 50000;
                giaTriToiDa = null;
                break;
            case "catToc":
                diemCanThiet = 200;
                tenKhuyenMai = "Miễn phí cắt tóc (đổi điểm)";
                loaiGiam = "SoTien";
                giaTriGiam = 150000;
                giaTriToiDa = null;
                break;
            case "comboVIP":
                diemCanThiet = 500;
                tenKhuyenMai = "Combo VIP - Cắt + Gội + Massage (đổi điểm)";
                loaiGiam = "SoTien";
                giaTriGiam = 350000;
                giaTriToiDa = null;
                break;
            case "voucher100k":
                diemCanThiet = 150;
                tenKhuyenMai = "Voucher giảm 100.000đ (đổi điểm)";
                loaiGiam = "SoTien";
                giaTriGiam = 100000;
                giaTriToiDa = null;
                break;
            default:
                return new DoiThuongResponse
                {
                    Success = false,
                    Message = "Loại đổi thưởng không hợp lệ!"
                };
        }

        // Kiểm tra điểm tối thiểu
        if (request.DiemDoi < diemCanThiet)
        {
            return new DoiThuongResponse 
            { 
                Success = false, 
                Message = $"Cần tối thiểu {diemCanThiet} điểm để đổi phần thưởng này!" 
            };
        }

        // Tạo mã giảm giá mới (unique)
        var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(100, 999);
        var maCode = "REWARD" + timestamp + random;
        var maDoiThuong = "DT" + timestamp + random;
        var ngayHetHan = DateTime.Now.AddMonths(3); // Mã có hiệu lực 3 tháng

        using var db = new SqlConnection(_conn);
        await db.OpenAsync();
        using var transaction = db.BeginTransaction();

        try
        {
            // 1. Tạo mã khuyến mãi mới
            await db.ExecuteAsync(@"
                INSERT INTO KhuyenMai (MaCode, TenKhuyenMai, LoaiGiam, GiaTriGiam, GiaTriToiDa, DonHangToiThieu, SoLanDung, SoLanToiDa, NgayBatDau, NgayKetThuc, TrangThai)
                VALUES (@MaCode, @TenKhuyenMai, @LoaiGiam, @GiaTriGiam, @GiaTriToiDa, 0, 0, 1, @NgayBatDau, @NgayKetThuc, 1)",
                new 
                { 
                    MaCode = maCode,
                    TenKhuyenMai = tenKhuyenMai,
                    LoaiGiam = loaiGiam,
                    GiaTriGiam = giaTriGiam,
                    GiaTriToiDa = giaTriToiDa,
                    NgayBatDau = DateTime.Now.Date,
                    NgayKetThuc = ngayHetHan.Date
                },
                transaction);

            // 2. Tạo lịch sử đổi thưởng
            await db.ExecuteAsync(@"
                INSERT INTO LichSuDoiThuong (MaDoiThuong, SoDienThoai, DiemDaDoi, MaCode, TrangThai, NgayDoiThuong, NgayHetHan)
                VALUES (@MaDoiThuong, @SoDienThoai, @DiemDaDoi, @MaCode, N'ChuaSuDung', @NgayDoiThuong, @NgayHetHan)",
                new 
                { 
                    MaDoiThuong = maDoiThuong,
                    SoDienThoai = request.SoDienThoai,
                    DiemDaDoi = diemCanThiet,
                    MaCode = maCode,
                    NgayDoiThuong = DateTime.Now,
                    NgayHetHan = ngayHetHan
                },
                transaction);

            // 3. Trừ điểm khách hàng
            await db.ExecuteAsync(@"
                UPDATE KhachHang 
                SET DiemTichLuy = DiemTichLuy - @DiemDoi 
                WHERE SoDienThoai = @SoDienThoai",
                new { DiemDoi = diemCanThiet, SoDienThoai = request.SoDienThoai },
                transaction);

            transaction.Commit();

            int diemConLai = diemHienCo - diemCanThiet;

            return new DoiThuongResponse
            {
                Success = true,
                Message = $"Đổi thành công! Bạn nhận được: {tenKhuyenMai}",
                MaCode = maCode,
                MaDoiThuong = maDoiThuong,
                NgayHetHan = ngayHetHan,
                DiemConLai = diemConLai,
                GiaTriGiam = giaTriGiam,
                LoaiGiam = loaiGiam,
                TenKhuyenMai = tenKhuyenMai
            };
        }
        catch (Exception ex)
        {
            transaction.Rollback();
            return new DoiThuongResponse
            {
                Success = false,
                Message = "Lỗi khi đổi thưởng: " + ex.Message
            };
        }
    }
}
