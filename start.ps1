# MatchPulse AI - Windows Launcher for Team
Write-Host "🚀 Starting MatchPulse AI Platform on Windows..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Setup & Start Backend
Write-Host "⚡ Setting up FastAPI Backend..." -ForegroundColor Yellow
Set-Location "$scriptDir\backend"

if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Gray
    python -m venv venv
    & ".\venv\Scripts\python.exe" -m pip install --upgrade pip
    & ".\venv\Scripts\python.exe" -m pip install -r requirements.txt
}

Write-Host "Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$backendProc = Start-Process -FilePath "$scriptDir\backend\venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" -PassThru -NoNewWindow

# 2. Setup & Start Frontend
Write-Host "✨ Setting up React/Vite Frontend..." -ForegroundColor Yellow
Set-Location "$scriptDir\frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Gray
    npm install
}

Write-Host "Launching Vite Frontend on http://localhost:5173..." -ForegroundColor Green
$frontendProc = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -PassThru -NoNewWindow

Set-Location $scriptDir

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🎯 App is running!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Press Enter or Ctrl+C to terminate both servers..." -ForegroundColor Yellow

try {
    [Console]::ReadLine()
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    if ($backendProc -and -not $backendProc.HasExited) { Stop-Process -Id $backendProc.Id -Force }
    if ($frontendProc -and -not $frontendProc.HasExited) { Stop-Process -Id $frontendProc.Id -Force }
    Write-Host "Servers stopped." -ForegroundColor Gray
}
