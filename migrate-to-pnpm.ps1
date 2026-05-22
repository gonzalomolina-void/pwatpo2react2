# migrate-to-pnpm.ps1
# Script para limpiar y migrar el entorno local a pnpm

if (Test-Path "node_modules") {
    Write-Host "Removiendo node_modules antigua..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Write-Host "Removiendo package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
}

Write-Host "Instalando dependencias con pnpm..." -ForegroundColor Green
pnpm install
