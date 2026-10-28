@echo off
title Publish a FlowLab release
echo Before you run this:
echo   1. Edit "owner" and "repo" in package.json
echo   2. Raise "version" in package.json (for example 1.0.0 to 1.0.1)
echo   3. Create a GitHub token (see RELEASING.md). Never share, paste in chat, or commit it.
echo   4. Run build-windows.bat once first to confirm the build works.
echo.
for /f "delims=" %%t in ('powershell -NoProfile -Command "$s = Read-Host 'Paste your GitHub token (typing is hidden)' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($s))"') do set GH_TOKEN=%%t
call npm install || (echo npm install failed & pause & exit /b 1)
call npm run release || (
  set GH_TOKEN=
  echo.
  echo Release failed. If you saw "Cannot create symbolic link", read the Troubleshooting part of README.md.
  pause & exit /b 1
)
set GH_TOKEN=
echo.
echo Done. Open your repository on GitHub, go to Releases, and PUBLISH the new draft.
pause
