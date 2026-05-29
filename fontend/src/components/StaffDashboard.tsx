import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StaffDashboardProps {
  monthlyStats: {
    soKhach: number;
    doanhThu: string;
    danhGiaTB: number;
    soGioLam: number;
    tongKhach: number;
    tongDoanhThu: string;
  };
  completedServices: any[];
  reviews: any[];
  appointments: any[];
}

function StaffDashboard({ monthlyStats, completedServices, reviews, appointments }: StaffDashboardProps) {
  // Monthly performance data (6 months)
  const monthlyPerformanceData = [
    { month: 'T1', khach: 28 },
    { month: 'T2', khach: 32 },
    { month: 'T3', khach: 35 },
    { month: 'T4', khach: 30 },
    { month: 'T5', khach: 38 },
    { month: 'T6', khach: monthlyStats.soKhach },
  ];

  // Service distribution
  const serviceDistribution = [
    { name: 'Cắt tóc', value: Math.floor(completedServices.length * 0.45) || 15, color: '#D4AF37' },
    { name: 'Gội đầu', value: Math.floor(completedServices.length * 0.25) || 8, color: '#60a5fa' },
    { name: 'Nhuộm', value: Math.floor(completedServices.length * 0.15) || 5, color: '#a78bfa' },
    { name: 'Tạo kiểu', value: Math.floor(completedServices.length * 0.10) || 3, color: '#22c55e' },
    { name: 'Khác', value: Math.floor(completedServices.length * 0.05) || 2, color: '#f87171' },
  ];

  // Rating breakdown
  const ratingBreakdown = [
    { stars: '5 sao', count: reviews.filter(r => r.sao === 5).length || 12 },
    { stars: '4 sao', count: reviews.filter(r => r.sao === 4).length || 5 },
    { stars: '3 sao', count: reviews.filter(r => r.sao === 3).length || 2 },
    { stars: '2 sao', count: reviews.filter(r => r.sao === 2).length || 1 },
    { stars: '1 sao', count: reviews.filter(r => r.sao === 1).length || 0 },
  ];

  return (
    <div style={{padding: '1rem'}}>
      {/* Stats Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Khách Tháng Này</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{monthlyStats.soKhach}</h2>
              <span style={{color: '#22c55e', fontSize: '0.85rem'}}>↗ +15% tháng trước</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>👥</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Doanh Thu</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{monthlyStats.doanhThu}</h2>
              <span style={{color: '#22c55e', fontSize: '0.85rem'}}>↗ +12% tháng trước</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>💰</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Đánh Giá TB</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{monthlyStats.danhGiaTB}/5</h2>
              <span style={{color: '#999', fontSize: '0.85rem'}}>{reviews.length} đánh giá</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>⭐</div>
          </div>
        </div>

        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <p style={{color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem'}}>Tổng Khách</p>
              <h2 style={{color: '#D4AF37', fontSize: '2.2rem', fontWeight: 700, margin: '0.5rem 0'}}>{monthlyStats.tongKhach}</h2>
              <span style={{color: '#999', fontSize: '0.85rem'}}>Tất cả thời gian</span>
            </div>
            <div style={{fontSize: '2.5rem', opacity: 0.5}}>📊</div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
        {/* Performance Line Chart */}
        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700}}>📈 Số Khách 6 Tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px'}}
                formatter={(value: any) => [`${value} khách`, 'Số lượng']}
              />
              <Line type="monotone" dataKey="khach" stroke="#D4AF37" strokeWidth={3} dot={{fill: '#D4AF37', r: 5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution Pie */}
        <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
          <h3 style={{color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700}}>✂️ Phân Bố Dịch Vụ</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px'}}
                formatter={(value: any) => [`${value} lượt`, 'Số lần']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{marginTop: '1rem'}}>
            {serviceDistribution.map((item, idx) => (
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

      {/* Rating Breakdown Bar Chart */}
      <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333', marginBottom: '1.5rem'}}>
        <h3 style={{color: '#D4AF37', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700}}>⭐ Phân Tích Đánh Giá</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingBreakdown} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#999" />
            <YAxis dataKey="stars" type="category" stroke="#999" width={80} />
            <Tooltip 
              contentStyle={{background: '#242426', border: '1px solid #D4AF37', borderRadius: '8px'}}
              formatter={(value: any) => [`${value} đánh giá`, 'Số lượng']}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {ratingBreakdown.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={['#22c55e', '#60a5fa', '#fbbf24', '#f97316', '#f87171'][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div style={{background: '#1A1A1B', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333'}}>
        <h3 style={{color: '#D4AF37', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700}}>📊 Tổng Quan Tích Lũy</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div style={{textAlign: 'center', padding: '1rem', background: '#242426', borderRadius: '10px'}}>
            <p style={{color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Tổng Doanh Thu</p>
            <p style={{color: '#D4AF37', fontSize: '1.8rem', fontWeight: 700}}>{monthlyStats.tongDoanhThu}</p>
          </div>
          <div style={{textAlign: 'center', padding: '1rem', background: '#242426', borderRadius: '10px'}}>
            <p style={{color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Lịch Sử Phục Vụ</p>
            <p style={{color: '#60a5fa', fontSize: '1.8rem', fontWeight: 700}}>{completedServices.length}</p>
          </div>
          <div style={{textAlign: 'center', padding: '1rem', background: '#242426', borderRadius: '10px'}}>
            <p style={{color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Giờ Làm Ước Tính</p>
            <p style={{color: '#a78bfa', fontSize: '1.8rem', fontWeight: 700}}>{monthlyStats.soGioLam}h</p>
          </div>
          <div style={{textAlign: 'center', padding: '1rem', background: '#242426', borderRadius: '10px'}}>
            <p style={{color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem'}}>Lịch Hẹn Hôm Nay</p>
            <p style={{color: '#22c55e', fontSize: '1.8rem', fontWeight: 700}}>{appointments.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
