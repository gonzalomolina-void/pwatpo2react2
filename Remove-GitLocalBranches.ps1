# Remove-GitLocalBranches.ps1
# Deletes local branches whose remote counterpart no longer exists (merged and deleted on GitHub).

# 1. Limpiar referencias remotas inactivas
git fetch --prune | Out-Null

$protected = @('develop', 'main')

# 2. Obtener la rama en la que estamos parados actualmente para protegerla del borrado
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()

# 3. Filtrar y limpiar los nombres de las ramas de forma robusta
$branches = git branch -vv |
    Where-Object { $_ -match ': gone\]' } |
    ForEach-Object {
        # Quitamos asteriscos y espacios sobrantes del inicio y fin
        $cleanLine = $_.Replace('*', '').Trim()
        # El primer elemento tras el split por espacios siempre será el nombre de la rama
        ($cleanLine -split '\s+')[0]
    } |
    Where-Object { $_ -notin $protected -and $_ -ne $currentBranch }

if (-not $branches) {
    Write-Host "Nothing to clean up — all local branches have a remote counterpart." -ForegroundColor Green
    exit 0
}

Write-Host "Branches to delete (excluding protected and current checkout '$currentBranch'):" -ForegroundColor Yellow
$branches | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }

$confirm = Read-Host "`nProceed? (y/N)"
if ($confirm -ne 'y') {
    Write-Host "Cancelled." -ForegroundColor Gray
    exit 0
}

# Borrado masivo
$branches | ForEach-Object { 
    Write-Host "Deleting branch $_..."
    git branch -D $_ 
}
Write-Host "`nDone." -ForegroundColor Green
