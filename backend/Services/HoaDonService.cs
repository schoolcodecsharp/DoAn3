using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class HoaDonService : IHoaDonService
{
    private readonly IHoaDonRepository _repo;
    private readonly IDatLichRepository _datLichRepo;
    private readonly IKhachHangRepository _khachHangRepo;
    public HoaDonService(IHoaDonRepository repo, IDatLichRepository datLichRepo, IKhachHangRepository khachHangRepo)
    {
        _repo = repo;
        _datLichRepo = datLichRepo;
        _khachHangRepo = khachHangRepo;
    }

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang) => _repo.GetAll(search, khachHang);
    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public async Task<int> Create(HoaDonDto dto)
    {
        var result = await _repo.Create(new { dto.MaHoaDon, dto.SoDienThoai, dto.MaDatLich, dto.MaChiNhanh, dto.MaCode, dto.TongTien, GiamGia = dto.GiamGia ?? 0, dto.ThanhTien, DiemDuocCong = dto.DiemDuocCong ?? 0, DiemDaDung = dto.DiemDaDung ?? 0, PhuongThucTT = dto.PhuongThucTT ?? "TienMat", dto.GhiChu });

        if (result > 0)
        {
            // Khi thanh toán xong, tự động chuyển lịch hẹn sang HoanThanh
            if (!string.IsNullOrEmpty(dto.MaDatLich))
            {
                await _datLichRepo.UpdateStatus(dto.MaDatLich, "HoanThanh");
            }

            // Cộng điểm tích lũy cho khách hàng
            var diemCong = dto.DiemDuocCong ?? 0;
            var diemDung = dto.DiemDaDung ?? 0;
            if (diemCong > 0 || diemDung > 0)
            {
                await _khachHangRepo.UpdatePoints(dto.SoDienThoai, diemCong, diemDung);
            }

            // Cập nhật hạng thành viên dựa trên TongDiemTich
            await _khachHangRepo.UpdateMembership(dto.SoDienThoai);
        }

        return result;
    }

    public async Task<int> UpdatePayment(string id, HoaDonDto dto)
    {
        var result = await _repo.UpdatePayment(
            id,
            dto.MaCode,
            dto.GiamGia ?? 0,
            dto.ThanhTien,
            dto.PhuongThucTT ?? "TienMat",
            dto.GhiChu ?? "Đã thanh toán"
        );

        if (result > 0)
        {
            // Chuyển lịch hẹn sang HoanThanh
            if (!string.IsNullOrEmpty(dto.MaDatLich))
            {
                await _datLichRepo.UpdateStatus(dto.MaDatLich, "HoanThanh");
            }
        }

        return result;
    }

    public Task<IEnumerable<dynamic>> GetChiTiet(string id) => _repo.GetChiTiet(id);
}
