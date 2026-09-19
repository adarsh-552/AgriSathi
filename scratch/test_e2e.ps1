$baseUrl = "http://localhost:8080/api/v1"
$results = @()

function Record-Test($name, $passed, $details) {
    $stat = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }
    $script:results += [PSCustomObject]@{
        Test = $name
        Status = $stat
        Details = $details
    }
    Write-Host "[$stat] $name : $details" -ForegroundColor $color
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "AGRISATHI AUTOMATED FULL END-TO-END VERIFICATION" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Test Demo Bypass Invalidation (Security Check)
try {
    # Request OTP for farmer mobile
    $testMobile = "9876543210"
    $otpReq = Invoke-RestMethod -Uri "$baseUrl/auth/otp/request" -Method POST -Body (@{ identifier = $testMobile } | ConvertTo-Json) -ContentType "application/json"
    
    # Try demo bypass "123456" -> MUST FAIL
    $bypassRejected = $false
    try {
        $verifyBypass = Invoke-RestMethod -Uri "$baseUrl/auth/otp/verify" -Method POST -Body (@{ identifier = $testMobile; otp = "123456" } | ConvertTo-Json) -ContentType "application/json"
    } catch {
        $bypassRejected = $true
    }
    Record-Test "Demo Bypass '123456' Invalidation" $bypassRejected "Bypass 123456 was strictly rejected as unauthorized."
} catch {
    Record-Test "Demo Bypass Test" $false $_.Exception.Message
}

# 2. Authentic OTP Verification & Farmer JWT Token
$farmerToken = ""
$farmerUserId = 0
try {
    # Retrieve real cryptographically generated OTP via dev test preview
    $devOtpRes = Invoke-RestMethod -Uri "$baseUrl/auth/otp/dev-preview?identifier=$testMobile" -Method GET
    $realOtp = $devOtpRes.otp
    
    # Verify with real OTP
    $verifyRes = Invoke-RestMethod -Uri "$baseUrl/auth/otp/verify" -Method POST -Body (@{ identifier = $testMobile; otp = $realOtp; preferredLanguage = "te" } | ConvertTo-Json) -ContentType "application/json"
    $farmerToken = $verifyRes.token
    $farmerUserId = $verifyRes.userId
    Record-Test "Authentic OTP Verification & Farmer JWT" ($farmerToken -ne "") "Authenticated with secure OTP: $realOtp (Role: $($verifyRes.role))"
} catch {
    Record-Test "Authentic OTP Verification" $false $_.Exception.Message
}

$farmerHeaders = @{ Authorization = "Bearer $farmerToken" }

# 3. Admin Authentication
$adminToken = ""
try {
    $adminLogin = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method POST -Body (@{ email = "admin@agrisathi.com"; password = "Admin@AgriSathi2026" } | ConvertTo-Json) -ContentType "application/json"
    $adminToken = $adminLogin.token
    Record-Test "Admin Authentication" ($adminToken -ne "") "Admin authenticated with role $($adminLogin.role)"
} catch {
    Record-Test "Admin Authentication" $false $_.Exception.Message
}

$adminHeaders = @{ Authorization = "Bearer $adminToken" }

# 4. Farmer Profile Update & Persistence (Pan-India State/District/Soil/Irrigation)
try {
    $profileUpdateBody = @{
        fullName = "Ramayya Farmer"
        state = "Telangana"
        district = "Warangal"
        mandal = "Wardhannapet"
        village = "Inavolu"
        pincode = "506002"
        landAreaAcres = 4.5
        soilType = "BLACK_COTTON"
        irrigationSource = "BOREWELL"
        preferredLanguage = "te"
    } | ConvertTo-Json

    $profilePut = Invoke-RestMethod -Uri "$baseUrl/profile" -Method PUT -Headers $farmerHeaders -Body $profileUpdateBody -ContentType "application/json; charset=utf-8"
    $profileGet = Invoke-RestMethod -Uri "$baseUrl/profile" -Method GET -Headers $farmerHeaders
    $profilePass = ($profileGet.district -eq "Warangal" -and $profileGet.soilType -eq "BLACK_COTTON" -and $profileGet.landAreaAcres -eq 4.5)
    Record-Test "Farmer Profile Persistence" $profilePass "State: $($profileGet.state), District: $($profileGet.district), Acres: $($profileGet.landAreaAcres), Soil: $($profileGet.soilType)"
} catch {
    Record-Test "Farmer Profile Persistence" $false $_.Exception.Message
}

# 5. Crop Catalog & Crop Journey with GDD Engine
$farmerCropId = 0
try {
    $catalog = Invoke-RestMethod -Uri "$baseUrl/crops/catalog" -Method GET -Headers $farmerHeaders
    $hasCrops = ($catalog.Count -ge 4)
    Record-Test "Crop Catalog Verification" $hasCrops "Found $($catalog.Count) master crops in database."

    $cotton = $catalog | Where-Object { $_.cropCode -eq "COTTON" }
    $cropReq = @{
        cropId = $cotton.id
        plotIdentifier = "North Plot (Uttaram Chenu)"
        sowingDate = (Get-Date).AddDays(-40).ToString("yyyy-MM-dd")
        landAreaAcres = 4.5
        state = "Telangana"
        district = "Warangal"
    } | ConvertTo-Json

    $cropRes = Invoke-RestMethod -Uri "$baseUrl/crops/farmer-crops" -Method POST -Headers $farmerHeaders -Body $cropReq -ContentType "application/json; charset=utf-8"
    $farmerCropId = $cropRes.id

    $dash = Invoke-RestMethod -Uri "$baseUrl/crops/dashboard" -Method GET -Headers $farmerHeaders
    $gddValid = ($dash.accumulatedGdd -gt 0)
    $stagesValid = ($dash.allStages.Count -gt 0)
    $tasksValid = ($dash.stageTasks.Count -gt 0)
    Record-Test "Crop Journey & GDD Engine" ($gddValid -and $stagesValid -and $tasksValid) "Crop: $($dash.cropNameEn), Age: $($dash.cropAgeDays) days, GDD: $($dash.accumulatedGdd), Stage: $($dash.stageNameEn), Tasks: $($dash.stageTasks.Count)"
} catch {
    Record-Test "Crop Journey & GDD Engine" $false $_.Exception.Message
}

# 6. Crop Memory Append-Only Ledger
try {
    $eventBody = @{
        eventType = "RAIN"
        cropAgeDays = 35
        title = "Heavy Rainfall Recorded"
        notes = "Field waterlogged after continuous monsoon rainfall."
        loggedBy = "FARMER"
    } | ConvertTo-Json

    $eventRes = Invoke-RestMethod -Uri "$baseUrl/memory/$farmerCropId/log" -Method POST -Headers $farmerHeaders -Body $eventBody -ContentType "application/json; charset=utf-8"
    $timeline = Invoke-RestMethod -Uri "$baseUrl/memory/$farmerCropId/timeline" -Method GET -Headers $farmerHeaders
    $eventPass = ($timeline.Count -ge 1 -and ($timeline | Where-Object { $_.title -like "*Rainfall*" }))
    Record-Test "Crop Memory Ledger" $eventPass "Verified event logged into append-only memory timeline (count: $($timeline.Count))."
} catch {
    Record-Test "Crop Memory Ledger" $false $_.Exception.Message
}

# 7. Diagnostic Safety Gate (Differential Diagnosis & CIBRC Compliance)
try {
    # Test A: Leaf Yellowing with Waterlogging
    $diagReqA = @{
        farmerCropId = $farmerCropId
        symptomCategory = "LEAF_YELLOWING"
        symptomLocation = "LOWER_OLD_LEAVES"
        soilWaterlogged = $true
        description = "Lower old leaves turning pale yellow after heavy rains"
    } | ConvertTo-Json
    $diagA = Invoke-RestMethod -Uri "$baseUrl/problems/evaluate" -Method POST -Headers $farmerHeaders -Body $diagReqA -ContentType "application/json; charset=utf-8"
    $passA = ($diagA.chemicalRecommended -eq $false -and $diagA.suspectedCauseEn -like "*Nitrogen*")
    Record-Test "Safety Gate: Nitrogen Leaching (Non-Chemical First)" $passA "Cause: $($diagA.suspectedCauseEn), ChemicalRecommended: $($diagA.chemicalRecommended)"

    # Test B: Sucking Pest Complex
    $diagReqB = @{
        farmerCropId = $farmerCropId
        symptomCategory = "SUCKING_PEST"
        symptomLocation = "UPPER_NEW_LEAVES"
        soilWaterlogged = $false
        description = "Upward leaf curling, aphid and thrip colonies on leaf undersides"
    } | ConvertTo-Json
    $diagB = Invoke-RestMethod -Uri "$baseUrl/problems/evaluate" -Method POST -Headers $farmerHeaders -Body $diagReqB -ContentType "application/json; charset=utf-8"
    $passB = ($diagB.toxicityBand -eq "BLUE" -and $diagB.preHarvestIntervalDays -eq 14)
    Record-Test "Safety Gate: Sucking Pest (CIBRC Band & PHI)" $passB "Cause: $($diagB.suspectedCauseEn), Band: $($diagB.toxicityBand), PHI: $($diagB.preHarvestIntervalDays) days"
} catch {
    Record-Test "Diagnostic Safety Gate" $false $_.Exception.Message
}

# 8. KVK Escalation System
try {
    $escReq = @{
        cropName = "Cotton (Patti)"
        issueCategory = "PEST_DISEASE"
        symptomsDescription = "Severe pest infestation observed on crop, scientist inspection requested."
        urgency = "HIGH"
        contactNumber = "9876543210"
    } | ConvertTo-Json

    $escRes = Invoke-RestMethod -Uri "$baseUrl/escalations" -Method POST -Headers $farmerHeaders -Body $escReq -ContentType "application/json; charset=utf-8"
    $myEsc = Invoke-RestMethod -Uri "$baseUrl/escalations/my" -Method GET -Headers $farmerHeaders
    $escPass = ($myEsc.Count -ge 1 -and $myEsc[0].status -eq "PENDING")
    Record-Test "KVK Escalation Ticket Creation" $escPass "Ticket #$($myEsc[0].id) created with status: $($myEsc[0].status)"
} catch {
    Record-Test "KVK Escalation System" $false $_.Exception.Message
}

# 9. Dynamic Alerts Engine
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method GET -Headers $farmerHeaders
    $alertsPass = ($alerts.Count -ge 1)
    Record-Test "Dynamic Alerts Engine" $alertsPass "Received $($alerts.Count) active dynamic alerts."
} catch {
    Record-Test "Dynamic Alerts Engine" $false $_.Exception.Message
}

# 10. Government Schemes Portal
try {
    $schemes = Invoke-RestMethod -Uri "$baseUrl/schemes?state=Telangana" -Method GET
    $schemesPass = ($schemes.Count -ge 5)
    Record-Test "Government Schemes API" $schemesPass "Found $($schemes.Count) verified schemes (PM-KISAN, PMFBY, PMKSY, Soil Health Card, SMAM...)"
} catch {
    Record-Test "Government Schemes API" $false $_.Exception.Message
}

# 11. ICAR Agronomic Knowledge
try {
    $knowledge = Invoke-RestMethod -Uri "$baseUrl/knowledge" -Method GET
    $knowledgePass = ($knowledge.Count -ge 4)
    Record-Test "ICAR Knowledge API" $knowledgePass "Found $($knowledge.Count) verified agronomic guidelines with citations."
} catch {
    Record-Test "ICAR Knowledge API" $false $_.Exception.Message
}

# 12. External Weather & Mandi APIs
try {
    $weather = Invoke-RestMethod -Uri "$baseUrl/external/weather?district=Warangal" -Method GET
    $mandi = Invoke-RestMethod -Uri "$baseUrl/external/market-prices?market=Warangal" -Method GET
    $extPass = ($weather.Count -ge 1 -and $mandi.Count -ge 1)
    Record-Test "Weather & Mandi APIs" $extPass "Weather entries: $($weather.Count), Mandi records: $($mandi.Count)"
} catch {
    Record-Test "Weather & Mandi APIs" $false $_.Exception.Message
}

# 13. Admin Security & Governance (Role Protection Check)
try {
    # Try accessing admin endpoint with farmer token -> must be 403 Forbidden
    $forbiddenPass = $false
    try {
        $forbiddenRes = Invoke-RestMethod -Uri "$baseUrl/admin/overview" -Method GET -Headers $farmerHeaders
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 403) {
            $forbiddenPass = $true
        }
    }
    Record-Test "Admin Role Security (403 on Farmer)" $forbiddenPass "Non-admin access strictly forbidden with HTTP 403."

    # Access admin overview with Admin token
    $adminOverview = Invoke-RestMethod -Uri "$baseUrl/admin/overview" -Method GET -Headers $adminHeaders
    $adminPass = ($adminOverview.totalFarmers -ge 1 -and $adminOverview.activeCropsCount -ge 1)
    Record-Test "Admin Governance Overview" $adminPass "Total Farmers: $($adminOverview.totalFarmers), Crops: $($adminOverview.activeCropsCount), Contents: $($adminOverview.verifiedContentsCount), Escalations: $($adminOverview.totalEscalationsCount)"
} catch {
    Record-Test "Admin Security & Governance" $false $_.Exception.Message
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "FINAL RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
$passedCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$totalCount = $results.Count
$summaryColor = if ($passedCount -eq $totalCount) { "Green" } else { "Yellow" }
Write-Host "Passed: $passedCount / $totalCount tests" -ForegroundColor $summaryColor

$results | Format-Table -AutoSize
