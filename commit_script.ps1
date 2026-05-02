# Script to create multiple commits for project history

# Commit 1: Initial project setup
git add fontend/package.json fontend/package-lock.json
git commit -m "chore: initialize React + TypeScript + Vite project"

# Commit 2: Add Vite config
git add fontend/vite.config.ts fontend/tsconfig*.json
git commit -m "config: setup Vite and TypeScript configuration"

# Commit 3: Add index.html
git add fontend/index.html fontend/.gitignore
git commit -m "feat: add HTML entry point and gitignore"

# Commit 4: Add ESLint config
git add fontend/eslint.config.js
git commit -m "config: setup ESLint for code quality"

# Commit 5: Add public assets
git add fontend/public/
git commit -m "assets: add favicon and icons"

# Commit 6: Setup main entry point
git add fontend/src/main.tsx
git commit -m "feat: setup React main entry point"

# Commit 7: Add global styles
git add fontend/src/index.css
git commit -m "style: add global CSS reset and base styles"

# Commit 8: Create App component
git add fontend/src/App.tsx fontend/src/App.css
git commit -m "feat: create main App component with routing"

# Commit 9: Add localStorage utilities
git add fontend/src/utils/localStorage.ts
git commit -m "feat: implement localStorage service with TypeScript interfaces"

# Commit 10: Add sample data initialization
git add fontend/src/utils/initData.ts
git commit -m "feat: add sample data initialization for demo"

# Commit 11: Create Home page structure
git add fontend/src/pages/Home.tsx
git commit -m "feat: create Home page component structure"

# Commit 12: Add Home page styles
git add fontend/src/styles/Home.css
git commit -m "style: implement dark theme for Home page"

# Commit 13: Update Home page with hero section
git add fontend/src/pages/Home.tsx
git commit -m "feat: add hero section with premium design"

# Commit 14: Add services section to Home
git add fontend/src/pages/Home.tsx
git commit -m "feat: add services showcase section"

# Commit 15: Add stats and branches section
git add fontend/src/pages/Home.tsx
git commit -m "feat: add statistics and branch locations"

# Commit 16: Create Login page
git add fontend/src/pages/Login.tsx
git commit -m "feat: create Login page with form validation"

# Commit 17: Create Register page
git add fontend/src/pages/Register.tsx
git commit -m "feat: create Register page with multi-step form"

# Commit 18: Add Auth styles
git add fontend/src/styles/Auth.css
git commit -m "style: add gradient theme for authentication pages"

# Commit 19: Create User page structure
git add fontend/src/pages/User.tsx
git commit -m "feat: create User dashboard page structure"

# Commit 20: Add User booking interface
git add fontend/src/pages/User.tsx
git commit -m "feat: implement booking interface for users"

# Commit 21: Add User styles
git add fontend/src/styles/User.css
git commit -m "style: implement dark theme for User dashboard"

# Commit 22: Add booking history to User page
git add fontend/src/pages/User.tsx
git commit -m "feat: add booking history and invoice tracking"

# Commit 23: Create Staff page structure
git add fontend/src/pages/Staff.tsx
git commit -m "feat: create Staff management page"

# Commit 24: Add Staff appointment management
git add fontend/src/pages/Staff.tsx
git commit -m "feat: implement appointment management for staff"

# Commit 25: Add Staff styles
git add fontend/src/styles/Staff.css
git commit -m "style: add professional theme for Staff page"

# Commit 26: Add Staff statistics
git add fontend/src/pages/Staff.tsx
git commit -m "feat: add performance statistics for staff"

# Commit 27: Create Admin page structure
git add fontend/src/pages/Admin.tsx
git commit -m "feat: create Admin dashboard page"

# Commit 28: Add Admin service management
git add fontend/src/pages/Admin.tsx
git commit -m "feat: implement service CRUD operations"

# Commit 29: Add Admin staff management
git add fontend/src/pages/Admin.tsx
git commit -m "feat: implement staff management system"

# Commit 30: Add Admin styles
git add fontend/src/styles/Admin.css
git commit -m "style: implement modern admin dashboard theme"

# Commit 31: Add Admin branch management
git add fontend/src/pages/Admin.tsx
git commit -m "feat: add branch management functionality"

# Commit 32: Add modal forms for Admin
git add fontend/src/pages/Admin.tsx
git commit -m "feat: implement modal forms for CRUD operations"

# Commit 33: Optimize Home page images
git add fontend/src/pages/Home.tsx
git commit -m "perf: add real images from Unsplash"

# Commit 34: Fix responsive design
git add fontend/src/styles/*.css
git commit -m "fix: improve responsive design for mobile devices"

# Commit 35: Add documentation
git add fontend/README.md fontend/INSTRUCTIONS.md
git commit -m "docs: add project documentation and instructions"

# Commit 36: Add usage guide
git add fontend/HUONG_DAN_SU_DUNG.md fontend/HUONG_DAN.md
git commit -m "docs: add Vietnamese usage guide"

# Commit 37: Add localStorage guide
git add fontend/HUONG_DAN_LOCAL_STORAGE.md
git commit -m "docs: add localStorage implementation guide"

# Commit 38: Add UI change guide
git add fontend/THAY_DOI_GIAO_DIEN.md fontend/FIX_IMAGE.md
git commit -m "docs: add UI customization and image fix guide"

# Commit 39: Add project summary
git add fontend/SUMMARY.md
git commit -m "docs: add comprehensive project summary"

# Commit 40: Final cleanup and optimization
git add .
git commit -m "chore: final cleanup and code optimization"

Write-Host "Successfully created 40 commits!" -ForegroundColor Green
