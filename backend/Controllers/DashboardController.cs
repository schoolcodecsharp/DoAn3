using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    
    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _service.GetDashboardStats();
        return Ok(new { success = true, data = stats });
    }

    [HttpGet("revenue-chart")]
    public async Task<IActionResult> GetRevenueChart([FromQuery] int months = 6)
    {
        var data = await _service.GetRevenueChart(months);
        return Ok(new { success = true, data });
    }

    [HttpGet("top-services")]
    public async Task<IActionResult> GetTopServices([FromQuery] int top = 5)
    {
        var data = await _service.GetTopServices(top);
        return Ok(new { success = true, data });
    }

    [HttpGet("recent-bookings")]
    public async Task<IActionResult> GetRecentBookings([FromQuery] int limit = 10)
    {
        var data = await _service.GetRecentBookings(limit);
        return Ok(new { success = true, data });
    }
}
