# HƯỚNG DẪN THÊM ẢNH VÀO HOME PAGE

## Cách 1: Sửa trực tiếp trong VS Code

1. Mở file `src/pages/Home.tsx`
2. Tìm dòng 43-46:
```tsx
<div className="hero-placeholder">
  <div className="placeholder-text">30SHINE</div>
</div>
```

3. Xóa 3 dòng trên và thay bằng:
```tsx
<img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop" alt="30Shine Barber" />
```

4. Save file (Ctrl + S)

## Cách 2: Dùng ảnh local

1. Tải ảnh về và đặt vào `fontend/fontend/public/hero.jpg`
2. Thay bằng:
```tsx
<img src="/hero.jpg" alt="30Shine Barber" />
```

## Kết quả mong đợi:

File `Home.tsx` dòng 43-44 sẽ là:
```tsx
<div className="hero-image">
  <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop" alt="30Shine Barber" />
  <div className="hero-badge">
```

## Các ảnh đẹp khác có thể dùng:

1. Barber shop: `https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800`
2. Hair cutting: `https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800`
3. Modern salon: `https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800`

Chỉ cần thay URL trong src="..." là xong!
