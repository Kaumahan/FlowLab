@echo off
title Publish a FlowLab release
echo Before you run this:
echo   1. Edit "owner" and "repo" in package.json
echo   2. Raise "version" in package.json (for example 1.0.0 to 1.0.1)
echo   3. Create a GitHub token (see RELEASING.md). Never share or commit it.
echo.
set /p GH_TOKEN=Paste your GitHub token and press Enter: 
call npm install || (echo npm install failed & pause & exit /b 1)
call npm run release || (echo release failed & pause & exit /b 1)
set GH_TOKEN=
echo.
echo Done. Open your repository on GitHub, go to Releases, and PUBLISH the new draft.
pause
