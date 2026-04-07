# PowerShell script untuk seed database
Write-Host "Seeding database..." -ForegroundColor Green
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/seed" -Method POST -UseBasicParsing
Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
Write-Host "Response: $($response.Content)"
