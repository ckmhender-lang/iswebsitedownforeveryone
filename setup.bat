@echo off
cd /d "d:\AI PROJECTS\VSCODEPROJECTS\iswebsitedown"
echo ==========================================
echo  IsWebsiteDown - Project Setup
echo ==========================================

echo.
echo [1/4] Running project initializer (node init.js)...
call node init.js
if %errorlevel% neq 0 (
    echo ERROR: init.js failed. Make sure Node.js is installed.
    exit /b 1
)

echo.
echo [2/4] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed.
    exit /b 1
)

echo.
echo [3/4] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: prisma generate failed. (You can run this later after setting DATABASE_URL)
)

echo.
echo [4/4] Setup complete!
echo.
echo ==========================================
echo  Next steps:
echo  1. Copy .env.example to .env.local
echo  2. Fill in your DATABASE_URL and other vars
echo  3. Run: npx prisma db push
