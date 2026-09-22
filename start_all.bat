@echo off
title BhoomiDrishti - SIH 2026 Platform Launcher
echo ========================================================
echo   BhoomiDrishti - Real-Time National Land Acquisition
echo   SIH 2026 Problem Statement SIH26016 & SIH26017
echo ========================================================
echo.
echo Starting Backend Server on http://localhost:5000...
start cmd /k "cd /d D:\SIH2026\BhoomiDrishti\server && npm start"

timeout /t 3 >nul

echo Starting Frontend UI on http://localhost:3000...
start cmd /k "cd /d D:\SIH2026\BhoomiDrishti\client && npm run dev"

echo.
echo ========================================================
echo   BhoomiDrishti is starting up!
echo   Frontend URL: http://localhost:3000
echo   Backend REST API: http://localhost:5000/api
echo ========================================================
pause
