using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class DatLichService : IDatLichService
{
    private readonly IDatLichRepository _repo;
    private readonly IHoaDonRepository _hoaDonRepo;
    private readonly IKhachHangRepository _khachHangRepo;
    private readonly IDichVuRepository _dichVuRepo;
    
    public DatLichService(
        IDatLichRepository repo, 
        IHoaDonRepository hoaDonRepo, 
        IKhachHangRepository khachHangRepo,
        IDichVuRepository dichVuRepo)
    {
        _repo = repo;
        _hoaDonRepo = hoaDonRepo;
        _khachHangRepo = khachHangRepo;
        _dichVuRepo = dichVuRepo;
    }

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? trangThai, string? chiNhanh, string? nhanVien, string? khachHang) =>
        _repo.GetAll(search, trangThai, chiNhanh, nhanVien, khachHang);

    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public async Task<int> Create(DatLichDto dto)
    {
        // 1. Insert DatLich
        var result = await _repo.Create(new
        {
            dto.MaDatLich,
            dto.SoDienThoai,
            dto.MaChiNhanh,
            dto.MaNhanVien,
            dto.ThoiGianHen,
            dto.ThoiGianKetThuc,
            TrangThai = "DaXacNhan",
            NguonDatLich = dto.NguonDatLich ?? "Website",
            dto.GhiChu
        });

        if (result <= 0) return result;

        // 2. Insert ChiTietDatLich cho từng dịch vụ
        if (dto.DichVuList != null && dto.DichVuList.Count > 0)
        {
            foreach (var dv in dto.DichVuList)
            {
                await _repo.AddChiTiet(dto.MaDatLich, dv.MaDichVu, dv.SoLuong ?? 1);
            }

            // 3. Tự động tạo HoaDon
            await AutoCreateInvoiceFromBooking(dto);
        }

        return result;
    }

    /// <summary>
    /// Tạo hóa đơn tự động ngay khi đặt lịch (trạng thái chờ thanh toán)
    /// </summary>
    private async Task AutoCreateInvoiceFromBooking(DatLichDto dto)
    {
        try
        {
            decimal tongTien = 0;
            var dichVuDetails = new List<(string MaDichVu, int SoLuong, decimal DonGia, decimal ThanhTien)>();

            // Tính tổng tiền từ danh sách dịch vụ
            foreach (var dv in dto.DichVuList!)
            {
                var dichVu = await _dichVuRepo.GetById(dv.MaDichVu);
                if (dichVu == null) continue;

                int soLuong = dv.SoLuong ?? 1;
                decimal gia = (decimal)(dichVu.GiaSauGiam ?? dichVu.Gia ?? 0);
                decimal thanhTienDV = gia * soLuong;
                tongTien += thanhTienDV;

                dichVuDetails.Add((dv.MaDichVu, soLuong, gia, thanhTienDV));
            }

            if (tongTien == 0) return;

            // Tính điểm thưởng
            int diemCong = (int)(tongTien / 10000);

            // Tạo mã hóa đơn
            string maHD = "HD" + DateTime.Now.ToString("yyMMddHHmmss") + dto.MaDatLich.Substring(Math.Max(0, dto.MaDatLich.Length - 4));

            // Insert HoaDon
            await _hoaDonRepo.Create(new
            {
                MaHoaDon = maHD,
                SoDienThoai = dto.SoDienThoai,
                MaDatLich = dto.MaDatLich,
                MaChiNhanh = dto.MaChiNhanh,
                MaCode = (string?)null,
                TongTien = tongTien,
                GiamGia = 0m,
                ThanhTien = tongTien,
                DiemDuocCong = diemCong,
                DiemDaDung = 0,
                PhuongThucTT = "ChuaThanhToan",
                GhiChu = "Chờ thanh toán"
            });

            // Insert ChiTietHoaDon cho từng dịch vụ
            foreach (var (maDichVu, soLuong, donGia, thanhTienDV) in dichVuDetails)
            {
                await _hoaDonRepo.CreateChiTiet(maHD, maDichVu, dto.MaNhanVien, soLuong, donGia, thanhTienDV);
            }

            // Cộng điểm tích lũy
            if (diemCong > 0)
            {
                await _khachHangRepo.UpdatePoints(dto.SoDienThoai, diemCong, 0);
                await _khachHangRepo.UpdateMembership(dto.SoDienThoai);
            }

            Console.WriteLine($"Auto-created invoice {maHD} for booking {dto.MaDatLich}, total: {tongTien}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Auto-create invoice error: {ex.Message}");
        }
    }

    public Task<int> Update(string id, DatLichDto dto) =>
        _repo.Update(id, new { id, dto.MaNhanVien, dto.ThoiGianHen, dto.ThoiGianKetThuc, TrangThai = dto.TrangThai ?? "ChoXacNhan", dto.GhiChu });

    public async Task<int> UpdateStatus(string id, string trangThai)
    {
        var result = await _repo.UpdateStatus(id, trangThai);

        // Khi hoàn thành → tự động tạo hóa đơn nếu chưa có (fallback)
        if (result > 0 && trangThai == "HoanThanh")
        {
            await AutoCreateInvoiceFallback(id);
        }

        return result;
    }

    /// <summary>
    /// Fallback: tạo hóa đơn khi chuyển trạng thái HoanThanh (nếu chưa có hóa đơn)
    /// </summary>
    private async Task AutoCreateInvoiceFallback(string maDatLich)
    {
        try
        {
            var datLich = await _repo.GetById(maDatLich);
            if (datLich == null) return;

            string sdt = datLich.SoDienThoai;
            string chiNhanh = datLich.MaChiNhanh;

            // Kiểm tra đã có hóa đơn cho đặt lịch này chưa
            var existingInvoices = await _hoaDonRepo.GetAll(null, null);
            foreach (var inv in existingInvoices)
            {
                if (inv.MaDatLich == maDatLich) return; // Đã có hóa đơn rồi
            }

            // Lấy chi tiết dịch vụ đã đặt
            var chiTietList = await _repo.GetChiTiet(maDatLich);
            decimal tongTien = 0;
            foreach (var ct in chiTietList)
            {
                tongTien += (decimal)(ct.Gia ?? 0) * (int)(ct.SoLuong ?? 1);
            }

            if (tongTien == 0) tongTien = 80000;

            int diemCong = (int)(tongTien / 10000);
            string maHD = "HD" + DateTime.Now.ToString("yyMMddHHmmss") + maDatLich.Substring(Math.Max(0, maDatLich.Length - 4));

            await _hoaDonRepo.Create(new
            {
                MaHoaDon = maHD,
                SoDienThoai = sdt,
                MaDatLich = maDatLich,
                MaChiNhanh = chiNhanh,
                MaCode = (string?)null,
                TongTien = tongTien,
                GiamGia = 0m,
                ThanhTien = tongTien,
                DiemDuocCong = diemCong,
                DiemDaDung = 0,
                PhuongThucTT = "TienMat",
                GhiChu = "Tự động tạo khi hoàn thành dịch vụ"
            });

            if (diemCong > 0)
            {
                await _khachHangRepo.UpdatePoints(sdt, diemCong, 0);
                await _khachHangRepo.UpdateMembership(sdt);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Auto-create invoice fallback error: {ex.Message}");
        }
    }

    public Task<IEnumerable<dynamic>> GetChiTiet(string id) => _repo.GetChiTiet(id);
    public Task<int> AddChiTiet(string id, ChiTietDatLichDto dto) => _repo.AddChiTiet(id, dto.MaDichVu, dto.SoLuong ?? 1);
}
