# Ads API Test Script
# PowerShell test komutları

$BASE_URL = "http://localhost:3001"

Write-Host "🧪 Ads API Test Script" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    Write-Host ($health | ConvertTo-Json)
    Write-Host ""
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 2: TikTok Ads (Dummy Data)
Write-Host "2️⃣  Testing TikTok Ads API..." -ForegroundColor Yellow
try {
    $tiktokBody = @{
        search_term = "fitness"
        country = "TR"
        limit = 3
    } | ConvertTo-Json

    $tiktokAds = Invoke-RestMethod -Uri "$BASE_URL/tiktok/ads" -Method Post -Body $tiktokBody -ContentType "application/json"
    Write-Host "✅ TikTok API call successful!" -ForegroundColor Green
    Write-Host "Source: $($tiktokAds.source)" -ForegroundColor Gray
    Write-Host "Count: $($tiktokAds.count)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Sample Ad:" -ForegroundColor Cyan
    Write-Host ($tiktokAds.data[0] | ConvertTo-Json -Depth 3)
    Write-Host ""
} catch {
    Write-Host "❌ TikTok API failed: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Meta Ads (Dummy Data)
Write-Host "3️⃣  Testing Meta Ads API..." -ForegroundColor Yellow
try {
    $metaBody = @{
        search_term = "fitness"
        country = "TR"
        ad_type = "ALL"
        limit = 3
    } | ConvertTo-Json

    $metaAds = Invoke-RestMethod -Uri "$BASE_URL/meta/ads" -Method Post -Body $metaBody -ContentType "application/json"
    Write-Host "✅ Meta API call successful!" -ForegroundColor Green
    Write-Host "Source: $($metaAds.source)" -ForegroundColor Gray
    Write-Host "Count: $($metaAds.count)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Sample Ad:" -ForegroundColor Cyan
    Write-Host ($metaAds.data[0] | ConvertTo-Json -Depth 3)
    Write-Host ""
} catch {
    Write-Host "❌ Meta API failed: $_" -ForegroundColor Red
    Write-Host ""
}

# Test 4: 404 Endpoint
Write-Host "4️⃣  Testing 404 Handler..." -ForegroundColor Yellow
try {
    $notFound = Invoke-RestMethod -Uri "$BASE_URL/nonexistent" -Method Get
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ 404 handler working correctly!" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "🎉 Test suite completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Notes:" -ForegroundColor Yellow
Write-Host "- If 'source' is 'tiktok_dummy' or 'meta_dummy', API tokens are not configured" -ForegroundColor Gray
Write-Host "- Add APIFY_API_TOKEN and META_ACCESS_TOKEN to .env for real data" -ForegroundColor Gray
Write-Host "- Check README.md for token setup instructions" -ForegroundColor Gray
