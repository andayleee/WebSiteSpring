# run.ps1 - Spring Boot Development Launcher
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Spring Boot Development Launcher" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check required files
Write-Host "Checking required files..." -ForegroundColor Yellow

if (-not (Test-Path ".\pom.xml")) {
    Write-Host "ERROR: pom.xml not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory" -ForegroundColor Yellow
    pause
    exit 1
}

if (-not (Test-Path ".\mvnw.cmd")) {
    Write-Host "ERROR: mvnw.cmd not found!" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with your configuration" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ All required files found" -ForegroundColor Green

# Load environment variables
Write-Host "Loading environment variables from .env..." -ForegroundColor Green

Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $parts = $line.Split('=', 2)
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            
            if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
                $value = $value.Substring(1, $value.Length - 2)
            }
            
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
            Write-Host "  ✓ $key = $value" -ForegroundColor DarkGray
        }
    }
}

Write-Host "✓ Environment variables loaded" -ForegroundColor Green

# Display configuration
Write-Host ""
Write-Host "Application Configuration:" -ForegroundColor Yellow
Write-Host "  Database: $($env:DB_HOST):$($env:DB_PORT)/$($env:DB_NAME)" -ForegroundColor White
Write-Host "  Username: $($env:DB_USERNAME)" -ForegroundColor White
Write-Host "  Profile: $($env:SPRING_PROFILES_ACTIVE)" -ForegroundColor White
Write-Host "  Port: $($env:SERVER_PORT)" -ForegroundColor White
Write-Host "  Hibernate: $($env:HIBERNATE_DDL_AUTO)" -ForegroundColor White

Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host "This may take a minute for the first run..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor DarkYellow
Write-Host "-----------------------------------------" -ForegroundColor Cyan

# Start the application
& .\mvnw.cmd spring-boot:run