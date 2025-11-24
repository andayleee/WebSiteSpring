# build-prod.ps1 - Build for production

Write-Host "Building production JAR file..." -ForegroundColor Green

# Очищаем и собираем проект
.\mvnw.cmd clean package -DskipTests

if ($LASTEXITCODE -eq 0) {
    $jarFile = Get-ChildItem -Path "target" -Filter "*.jar" | Where-Object { 
        $_.Name -notlike "*-sources.jar" -and $_.Name -notlike "*-javadoc.jar" 
    } | Select-Object -First 1
    
    if ($jarFile) {
        Write-Host "Build successful!" -ForegroundColor Green
        Write-Host "JAR file: $($jarFile.FullName)" -ForegroundColor Cyan
        Write-Host "Size: $([math]::Round($jarFile.Length/1MB, 2)) MB" -ForegroundColor Cyan
    } else {
        Write-Host "JAR file not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}