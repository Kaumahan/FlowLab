@echo off
title Build FlowLab
where node >nul 2>nul || (echo Node.js is not installed. Get the LTS version from https://nodejs.org and run this again. & pause & exit /b 1)
echo Installing build tools (needs internet, first time only)...
call npm install || (echo npm install failed & pause & exit /b 1)
echo Building Windows app...
call npm run dist || (
  echo.
  echo Build failed. If you saw "Cannot create symbolic link", read the Troubleshooting part of README.md.
  pause & exit /b 1
)
echo.
echo Done. Your .exe files are in the "dist" folder.
start "" dist
pause
