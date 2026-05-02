using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class ChiNhanhService : IChiNhanhService
{
    private readonly IChiNhanhRepository _repo;
    public ChiNhanhService(IChiNhanhRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search) => _repo.GetAll(search);
    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public Task<int> Create(ChiNhanhDto dto) => _repo.Create(dto);

    public Task<int> Update(string id, ChiNhanhDto dto) =>
        _repo.Update(id, new { id, dto.TenChiNhanh, dto.DiaChi, dto.TinhThanh, dto.SoDienThoai, dto.Email, GioMoCua = dto.GioMoCua ?? "08:00:00", GioDongCua = dto.GioDongCua ?? "21:00:00", TrangThai = dto.TrangThai ?? true });

    public Task<int> Delete(string id) => _repo.Delete(id);
}
