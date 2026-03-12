param(
    [Parameter(Mandatory=$false)]
    [string]$Environment = "dev",
    
    [Parameter(Mandatory=$false)]
    [switch]$Docker,
    
    [Parameter(Mandatory=$false)]
    [switch]$Help
)

if ($Help) {
    Write-Host @"
🚀 Express Fundamentals API Setup Script
=========================================
Usage: .\scripts\setup.ps1 [-Environment dev|prod] [-Docker] [-Help]

Options:
    -Environment     Environment (dev or prod) - Default: dev
    -Docker         Setup with Docker Compose
    -Help           Show this help
"@ -ForegroundColor Cyan
    exit
}

Write-Host "Setting up Express Fundamentals API - Environment: $Environment" -ForegroundColor Magenta

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Create .env if not exists
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
}

# Install dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

if ($Docker) {
    Write-Host "Starting Docker containers..." -ForegroundColor Yellow
    $composeFile = if ($Environment -eq "prod") { "docker/docker-compose.prod.yml" } else { "docker/docker-compose.yml" }
    docker-compose -f $composeFile up -d
    Write-Host "✅ Docker containers started" -ForegroundColor Green
    docker-compose -f $composeFile ps
} else {
    Write-Host "Starting development server..." -ForegroundColor Yellow
    Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev"
    Write-Host "✅ Server started at http://localhost:3000" -ForegroundColor Green
}

Write-Host @"

✅ Setup complete!

Next steps:
1. Import Thunder Client collection from ./tests/thunder-collection.json
2. Test endpoints:
   - GET  http://localhost:3000/health
   - GET  http://localhost:3000/api/items
   - POST http://localhost:3000/api/items
3. Run tests: npm test
4. Build Docker: npm run docker:build

Happy coding! 🚀
"@ -ForegroundColor Green