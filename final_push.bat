@echo off
cd /d D:\DoAn3

REM Remove any lock files
del /F /Q .git\index.lock 2>nul
del /F /Q .git\HEAD.lock 2>nul

echo Creating 20 commits on main branch...
echo.

git add fontend/package.json fontend/package-lock.json
git commit -m "feat: initialize React + TypeScript + Vite"

git add fontend/vite.config.ts fontend/tsconfig*.json
git commit -m "config: Vite and TypeScript setup"

git add fontend/eslint.config.js fontend/.gitignore fontend/index.html
git commit -m "config: ESLint and HTML entry"

git add fontend/public/
git commit -m "assets: public assets"

git add fontend/src/main.tsx fontend/src/index.css fontend/src/App.tsx fontend/src/App.css
git commit -m "feat: React app structure"

git add fontend/src/utils/localStorage.ts
git commit -m "feat: localStorage service"

git add fontend/src/utils/initData.ts fontend/src/utils/api.ts fontend/src/App.test.tsx fontend/src/assets/
git commit -m "feat: utilities and sample data"

git add fontend/src/pages/Home.tsx fontend/src/styles/Home.css
git commit -m "feat: Home page with dark theme"

git add fontend/src/pages/Login.tsx fontend/src/pages/Register.tsx
git commit -m "feat: authentication pages"

git add fontend/src/styles/Auth.css
git commit -m "style: auth gradient theme"

git add fontend/src/pages/User.tsx
git commit -m "feat: User dashboard"

git add fontend/src/styles/User.css
git commit -m "style: User dark theme"

git add fontend/src/pages/Staff.tsx
git commit -m "feat: Staff management"

git add fontend/src/styles/Staff.css
git commit -m "style: Staff theme"

git add fontend/src/pages/Admin.tsx
git commit -m "feat: Admin dashboard"

git add fontend/src/styles/Admin.css
git commit -m "style: Admin theme"

git add fontend/*.md
git commit -m "docs: documentation"

git add backend/
git commit -m "feat: ASP.NET backend"

git add *.sql
git commit -m "feat: database schema"

git add .
git commit -m "chore: final setup"

echo.
echo Pushing to GitHub...
git push origin main --force

echo.
echo Done! Commits:
git log --oneline -20
