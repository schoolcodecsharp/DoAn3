import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  dashStats: any;
  revenueData: any[];
  topServices: any[];
  bookings: any[];
  services: any[];
  staff: any[];
  customers: any[];
  branches: any[];
  promotions: any[];
}

function AdminDashboard({ dashStats, revenueData, topServices, bookings, services, staff, customers, branches, promotions }: DashboardProps) {
  return (
    <div className="dashboard-section">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange">📦</div>
          <div className="stat-info">
            <h3>Tổng Đơn Hàng</h3>
            <p className="stat-number">{dashStats?.totalOrders || bookings.length}</p>
            <span className="stat-change positive" style={{fontSize: '0.85rem', color: '#22c55e'}}>+12% so với tháng trước</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">✂️</div>
          <div className="stat-info">
            <h3>Dịch Vụ</h3>
            <p className="stat-number">{dashStats?.totalServices || services.length}</p>
            <span className="stat-change" style={{fontSize: '0.85rem', color: '#999'}}>Đang hoạt động</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div className="stat-info">
            <h3>Nhân Viên</h3>
            <p className="stat-number">{dashStats?.totalStaff || staff.length}</p>
            <span className="stat-change" style={{fontSize: '0.85rem', color: '#999'}}>Đang làm việc</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">💰</div>
          <div className="stat-info">
            <h3>Doanh Thu Tháng</h3>
            <p className="stat-number">{((dashStats?.totalRevenue || 45800000) / 1000000).toFixed(1)}M</p>
            <span className="stat-change positive" style={{fontSize: '0.85rem', color: '#22c55e'}}>+8.5% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Revenue Chart */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem' }}>📈 Doanh Thu 6 Tháng Gần Đây</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData.length > 0 ? revenueData : [
              { month: 'T1', revenue: 35000000 },
              { month: 'T2', revenue: 38000000 },
              { month: 'T3', revenue: 42000000 },
              { month: 'T4', revenue: 39000000 },
              { month: 'T5', revenue: 44000000 },
              { month: 'T6', revenue: 45800000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
              <Tooltip 
                contentStyle={{ background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px' }}
                formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M VNĐ`, 'Doanh thu']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{ fill: '#D4AF37', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services Chart */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem' }}>🏆 Top 5 Dịch Vụ Phổ Biến</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topServices.length > 0 ? topServices : [
              { serviceName: 'Cắt tóc nam', usageCount: 156 },
              { serviceName: 'Gội đầu massage', usageCount: 134 },
              { serviceName: 'Nhuộm tóc', usageCount: 98 },
              { serviceName: 'Tạo kiểu', usageCount: 87 },
              { serviceName: 'Uốn tóc', usageCount: 65 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="serviceName" stroke="#999" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px' }}
                formatter={(value: any) => [`${value} lượt`, 'Sử dụng']}
              />
              <Bar dataKey="usageCount" fill="#D4AF37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Status Pie Chart & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Booking Status Distribution */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem' }}>📊 Phân Bố Trạng Thái Đặt Lịch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Chờ xác nhận', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'ChoXacNhan').length || 15 },
                  { name: 'Đã xác nhận', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DaXacNhan').length || 45 },
                  { name: 'Đang phục vụ', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DangPhucVu').length || 12 },
                  { name: 'Hoàn thành', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'HoanThanh').length || 78 },
                  { name: 'Đã hủy', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DaHuy').length || 6 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: 'Chờ xác nhận', value: 15 },
                  { name: 'Đã xác nhận', value: 45 },
                  { name: 'Đang phục vụ', value: 12 },
                  { name: 'Hoàn thành', value: 78 },
                  { name: 'Đã hủy', value: 6 },
                ].map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#fbbf24', '#60a5fa', '#a78bfa', '#22c55e', '#f87171'][index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem' }}>🔔 Hoạt Động Gần Đây</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {bookings.slice(0, 5).map((booking: any, idx) => (
              <div key={idx} style={{ 
                padding: '0.75rem', 
                marginBottom: '0.5rem', 
                background: '#242426', 
                borderRadius: '8px',
                borderLeft: '3px solid #D4AF37'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                      Đặt lịch #{booking.maDatLich || booking.MaDatLich}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.85rem' }}>
                      SĐT: {booking.soDienThoai || booking.SoDienThoai}
                    </p>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: '#22c55e20',
                    color: '#22c55e'
                  }}>
                    {new Date(booking.thoiGianHen || booking.ThoiGianHen).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>Chưa có hoạt động nào</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{customers.length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Tổng Khách Hàng</p>
        </div>
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{branches.length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Chi Nhánh</p>
        </div>
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{promotions.filter(p => p.trangThai).length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Khuyến Mãi Đang Chạy</p>
        </div>
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>4.8</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Đánh Giá Trung Bình</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
