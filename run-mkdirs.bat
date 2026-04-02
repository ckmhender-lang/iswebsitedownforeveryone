@echo off
cd /d "d:\AI PROJECTS\VSCODEPROJECTS\iswebsitedown"
echo Creating directories...

node create-dirs.js
if %errorlevel% equ 0 goto done

echo node failed, trying python...
python mkdirs.py
if %errorlevel% equ 0 goto done

echo Both node and python failed, using mkdir...
mkdir prisma 2>nul
mkdir "src\app" 2>nul
mkdir "src\app\(auth)\login" 2>nul
mkdir "src\app\(auth)\register" 2>nul
mkdir "src\app\(dashboard)\dashboard" 2>nul
mkdir "src\app\(dashboard)\monitors\[id]" 2>nul
mkdir "src\app\(dashboard)\alerts" 2>nul
mkdir "src\app\(dashboard)\settings" 2>nul
mkdir "src\app\api\check" 2>nul
mkdir "src\app\api\monitors\[id]" 2>nul
mkdir "src\app\api\auth\register" 2>nul
mkdir "src\app\api\auth\[...nextauth]" 2>nul
mkdir "src\app\api\cron" 2>nul
mkdir "src\lib" 2>nul
mkdir "src\types" 2>nul
mkdir "src\components\auth" 2>nul
mkdir "src\components\layout" 2>nul
mkdir "src\components\dashboard" 2>nul
mkdir "src\components\monitors" 2>nul

:done
echo DONE
dir /b
pause
