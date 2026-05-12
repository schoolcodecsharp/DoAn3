@echo off
git add backend/Data/IAuthRepository.cs
git commit -m "feat: add separate methods for finding users by email and account type"

git add backend/Data/AuthRepository.cs
git commit -m "feat: implement email-based authentication with account type validation"

git add backend/Services/IAuthService.cs
git commit -m "feat: update auth service interface to support email login"

git add backend/Services/AuthService.cs
git commit -m "feat: implement LoginWithEmail method for account type routing"

git add backend/Controllers/AuthController.cs
git commit -m "feat: update login endpoint to accept email and account type"

git add backend/Models/DTOs/DichVuDto.cs
git commit -m "feat: add HinhAnh property to DichVuDto for service images"

git add backend/Models/DTOs/NhanVienDto.cs
git commit -m "feat: add HinhAnh property to NhanVienDto for staff photos"

git add backend/Models/DTOs/ChiNhanhDto.cs
git commit -m "feat: add HinhAnh property to ChiNhanhDto for branch images"

git add backend/Services/IDashboardService.cs
git commit -m "feat: create dashboard service interface with statistics models"

git add backend/Services/DashboardService.cs
git commit -m "feat: implement dashboard service with revenue and booking analytics"

git add backend/Controllers/DashboardController.cs
git commit -m "feat: create dashboard API endpoints for admin statistics"

git add backend/Controllers/KhuyenMaiController.cs
git commit -m "feat: implement promotion CRUD API endpoints"

git add backend/Controllers/DanhGiaController.cs backend/Controllers/DatLichController.cs backend/Controllers/HoaDonController.cs backend/Controllers/SanPhamController.cs
git commit -m "feat: add remaining controller endpoints for complete API coverage"

git add backend/Program.cs
git commit -m "refactor: register new services and configure CORS for frontend"

git add fontend/src/utils/api.ts
git commit -m "feat: update API client to support account type in login"

git add fontend/src/pages/Login.tsx
git commit -m "feat: add account type selector to login form"

git add fontend/src/pages/User.tsx
git commit -m "feat: replace service icons with actual images from API"

git add fontend/src/components/AdminDashboard.tsx
git commit -m "feat: create comprehensive admin dashboard with charts"

git add fontend/src/pages/Admin.tsx
git commit -m "refactor: integrate dashboard component into admin page"

git add fontend/src/pages/Home.tsx
git commit -m "style: improve home page layout and styling"

git add fontend/src/pages/Register.tsx
git commit -m "style: update register page styling for consistency"

git add fontend/src/styles/Auth.css
git commit -m "style: enhance authentication pages with dark theme"

git add fontend/src/styles/Home.css
git commit -m "style: refine home page CSS with modern design"

git add fontend/package.json fontend/package-lock.json
git commit -m "chore: add recharts library for data visualization"

git add fontend/src/assets/
git commit -m "assets: add hero images and branding assets"

echo All commits completed!
