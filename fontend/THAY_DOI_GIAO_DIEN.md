# HƯỚNG DẪN CẬP NHẬT GIAO DIỆN

## Các thay đổi đã thực hiện:

### 1. HOME PAGE
- ✅ Thay ảnh placeholder bằng ảnh web từ Unsplash
- ✅ Bỏ tất cả icon emoji
- ✅ Dùng số 01-06 cho service cards
- ✅ CSS chuẩn với gradient và shadow đẹp

### 2. ADMIN PAGE  
- ✅ Sidebar tối với gradient
- ✅ Dashboard stats với icon màu sắc
- ✅ Data tables hiện đại
- ✅ Modal form đẹp

### 3. USER PAGE
- ✅ Sidebar gradient xanh tím
- ✅ Booking form 2 cột
- ✅ Profile card đẹp
- ✅ Status badges rõ ràng

### 4. STAFF PAGE
- ✅ Header màu cam (#ff6b00)
- ✅ Sidebar tối (#2c3e50)
- ✅ Layout chuyên nghiệp

## Cách sửa ảnh trong Home.tsx:

Tìm dòng:
```tsx
<div className="hero-placeholder">
  <div className="placeholder-text">30SHINE</div>
</div>
```

Thay bằng:
```tsx
<img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop" alt="30Shine Barber" />
```

## Hoặc dùng ảnh local:

1. Copy ảnh vào `fontend/fontend/public/hero.jpg`
2. Thay bằng: `<img src="/hero.jpg" alt="30Shine Barber" />`

## Refresh để xem thay đổi:
- Ctrl + Shift + R (hard refresh)
- Hoặc xóa localStorage: `localStorage.clear(); location.reload();`
