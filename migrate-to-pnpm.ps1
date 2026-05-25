# migrate-to-pnpm.ps1
# Script para limpiar y migrar el entorno local a pnpm

# Verificar si pnpm está instalado
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "pnpm no está instalado. Iniciando instalación global mediante npm..." -ForegroundColor Yellow
    npm install -g pnpm
    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        Write-Error "No se pudo instalar pnpm de forma automática. Por favor, instalalo manualmente con 'npm install -g pnpm' y volvé a correr este script."
        exit 1
    }
    Write-Host "pnpm instalado correctamente." -ForegroundColor Green
}

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
