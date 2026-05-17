using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;
    public DashboardController(IDashboardService service) => _service = service;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats() => Ok(await _service.GetDashboardStats());

    [HttpGet("revenue-chart")]
    public async Task<IActionResult> GetRevenueChart([FromQuery] int months = 6)
        => Ok(await _service.GetRevenueChart(months));

    [HttpGet("top-services")]
    public async Task<IActionResult> GetTopServices([FromQuery] int top = 5)
        => Ok(await _service.GetTopServices(top));

    [HttpGet("recent-bookings")]
    public async Task<IActionResult> GetRecentBookings([FromQuery] int limit = 10)
        => Ok(await _service.GetRecentBookings(limit));

    [HttpGet("top-staff")]
    public async Task<IActionResult> GetTopStaff([FromQuery] int top = 5)
        => Ok(await _service.GetTopStaff(top));

    [HttpGet("average-ratings")]
    public async Task<IActionResult> GetAverageRatings()
        => Ok(await _service.GetAverageRatings());

    [HttpGet("customers-by-tier")]
    public async Task<IActionResult> GetCustomersByTier()
        => Ok(await _service.GetCustomersByTier());

    [HttpGet("revenue-by-branch")]
    public async Task<IActionResult> GetRevenueByBranch()
        => Ok(await _service.GetRevenueByBranch());
}
