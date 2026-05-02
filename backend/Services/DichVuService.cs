using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class DichVuService : IDichVuService
{
    private readonly IDichVuRepository _repo;
    public DichVuService(IDichVuRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? danhMuc) => _repo.GetAll(search, danhMuc);
    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public Task<int> Create(DichVuDto dto) =>
        _repo.Create(new { dto.MaDichVu, dto.TenDichVu, dto.DanhMuc, dto.MoTa, dto.Gia, dto.GiaSauGiam, ThoiGianPhut = dto.ThoiGianPhut ?? 30, DiemThuong = dto.DiemThuong ?? 0 });

    public Task<int> Update(string id, DichVuDto dto) =>
        _repo.Update(id, new { id, dto.TenDichVu, dto.DanhMuc, dto.MoTa, dto.Gia, dto.GiaSauGiam, ThoiGianPhut = dto.ThoiGianPhut ?? 30, DiemThuong = dto.DiemThuong ?? 0, TrangThai = dto.TrangThai ?? true });

    public Task<int> Delete(string id) => _repo.Delete(id);
}
