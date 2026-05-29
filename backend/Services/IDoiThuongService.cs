using backend.Models.DTOs;

namespace backend.Services;

public interface IDoiThuongService
{
    Task<IEnumerable<dynamic>> GetLichSu(string soDienThoai);
    Task<DoiThuongResponse> DoiDiem(DoiThuongRequest request);
}
