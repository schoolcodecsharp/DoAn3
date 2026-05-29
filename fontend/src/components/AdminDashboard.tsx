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

function AdminDashboard({ dashStats, topServices, bookings, services, staff, customers, branches, promotions }: DashboardProps) {
  const totalRevenue = dashStats?.totalRevenue || 45800000;
  const totalOrders = dashStats?.totalOrders || bookings.length;
  
  // Booking status data
  const bookingStatusData = [
    { name: 'Chờ xác nhận', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'ChoXacNhan').length || 15, color: '#fbbf24' },
    { name: 'Đã xác nhận', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DaXacNhan').length || 45, color: '#60a5fa' },
    { name: 'Đang phục vụ', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DangPhucVu').length || 12, color: '#a78bfa' },
    { name: 'Hoàn thành', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'HoanThanh').length || 78, color: '#22c55e' },
    { name: 'Đã hủy', value: bookings.filter(b => (b.trangThai || b.TrangThai) === 'DaHuy').length || 6, color: '#f87171' },
  ];

  // Monthly revenue data
  const monthlyRevenueData = [
    { month: 'T1', revenue: 35000000 },
    { month: 'T2', revenue: 38000000 },
    { month: 'T3', revenue: 42000000 },
    { month: 'T4', revenue: 39000000 },
    { month: 'T5', revenue: 44000000 },
    { month: 'T6', revenue: 45800000 },
  ];

  return (
    <div className="dashboard-section">
      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Tổng Đơn Hàng</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{totalOrders}</h2>
              <span style={{color: '#22c55e', fontSize: '0.85rem'}}>↗ +12% tháng trước</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>📦</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Doanh Thu Tháng</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{(totalRevenue / 1000000).toFixed(1)}M</h2>
              <span style={{color: '#22c55e', fontSize: '0.85rem'}}>↗ +8.5% tháng trước</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>💰</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Khách Hàng</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{customers.length}</h2>
              <span style={{color: '#22c55e', fontSize: '0.85rem'}}>↗ +15% tháng trước</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>👥</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Nhân Viên</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{staff.length}</h2>
              <span style={{color: '#999', fontSize: '0.85rem'}}>Đang làm việc</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>👨‍💼</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Revenue Line Chart */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>📈 Doanh Thu 6 Tháng Gần Đây</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
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

        {/* Booking Status Pie Chart */}
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>📊 Trạng Thái Đặt Lịch</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px' }}
                formatter={(value: any, name: any) => [`${value} đơn`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{marginTop: '1rem'}}>
            {bookingStatusData.map((item, idx) => (
              <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{width: '12px', height: '12px', borderRadius: '3px', background: item.color}}></div>
                  <span style={{color: '#999', fontSize: '0.85rem'}}>{item.name}</span>
                </div>
                <span style={{color: '#fff', fontWeight: 600, fontSize: '0.9rem'}}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Services Bar Chart */}
      <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>🏆 Top 5 Dịch Vụ Phổ Biến</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topServices.length > 0 ? topServices.slice(0, 5) : [
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

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✂️</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{services.length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Dịch Vụ</p>
        </div>
        
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{branches.length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Chi Nhánh</p>
        </div>
        
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>{promotions.filter(p => p.trangThai).length}</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Khuyến Mãi</p>
        </div>
        
        <div style={{ background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
          <h4 style={{ color: '#D4AF37', fontSize: '1.8rem', margin: '0.5rem 0' }}>4.8</h4>
          <p style={{ color: '#999', fontSize: '0.9rem' }}>Đánh Giá TB</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
