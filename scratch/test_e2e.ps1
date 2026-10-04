$baseUrl = "http://localhost:8080/api/v1"
$results = @()

function Record-Test($num, $name, $passed, $details) {
    $stat = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }
    $script:results += [PSCustomObject]@{
        "#" = $num
        Test = $name
        Status = $stat
        Details = $details
    }
    Write-Host "[$stat] Scenario $num : $name - $details" -ForegroundColor $color
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "AGRISATHI 20-SCENARIO FULL END-TO-END VERIFICATION" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$testMobile = "9876543210"

# Scenario 1: Farmer registration & OTP request
try {
    $otpReq = Invoke-RestMethod -Uri "$baseUrl/auth/otp/request" -Method POST -Body (@{ identifier = $testMobile } | ConvertTo-Json) -ContentType "application/json; charset=utf-8"
    $reqPass = ($otpReq.identifier -eq $testMobile -and $otpReq.message -like "*dispatched*")
    Record-Test 1 "Farmer Registration & OTP Request" $reqPass "Dispatched OTP request for mobile: $testMobile"
} catch {
    Record-Test 1 "Farmer Registration & OTP Request" $false $_.Exception.Message
}

# Scenario 2: Real SecureRandom OTP via dev-preview
$realOtp = ""
try {
    $devOtpRes = Invoke-RestMethod -Uri "$baseUrl/auth/otp/dev-preview?identifier=$testMobile" -Method GET
    $realOtp = $devOtpRes.otp
    $otpPass = ($realOtp -match "^\d{6}$" -and $realOtp -ne "123456")
    Record-Test 2 "Real SecureRandom OTP Delivery" $otpPass "Retrieved genuine SecureRandom OTP: $realOtp"
} catch {
    Record-Test 2 "Real SecureRandom OTP Delivery" $false $_.Exception.Message
}

# Scenario 3: 123456 Demo Bypass Rejection (HTTP 401)
try {
    $bypassRejected = $false
    try {
        $verifyBypass = Invoke-RestMethod -Uri "$baseUrl/auth/otp/verify" -Method POST -Body (@{ identifier = $testMobile; otp = "123456" } | ConvertTo-Json) -ContentType "application/json; charset=utf-8"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            $bypassRejected = $true
        }
    }
    Record-Test 3 "123456 Bypass Rejection (HTTP 401)" $bypassRejected "Hardcoded bypass '123456' was strictly rejected with HTTP 401 Unauthorized."
} catch {
    Record-Test 3 "123456 Bypass Rejection" $false $_.Exception.Message
}

# Scenario 4: Invalid/Mismatched OTP Rejection (HTTP 401)
try {
    $wrongOtpRejected = $false
    try {
        $verifyWrong = Invoke-RestMethod -Uri "$baseUrl/auth/otp/verify" -Method POST -Body (@{ identifier = $testMobile; otp = "000000" } | ConvertTo-Json) -ContentType "application/json; charset=utf-8"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            $wrongOtpRejected = $true
        }
    }
    Record-Test 4 "Invalid OTP Rejection (HTTP 401)" $wrongOtpRejected "Mismatched OTP '000000' strictly returned HTTP 401 Unauthorized."
} catch {
    Record-Test 4 "Invalid OTP Rejection" $false $_.Exception.Message
}

# Scenario 5: JWT Authentication on valid OTP
$farmerToken = ""
$farmerUserId = 0
try {
    $verifyRes = Invoke-RestMethod -Uri "$baseUrl/auth/otp/verify" -Method POST -Body (@{ identifier = $testMobile; otp = $realOtp; preferredLanguage = "te" } | ConvertTo-Json) -ContentType "application/json; charset=utf-8"
    $farmerToken = $verifyRes.token
    $farmerUserId = $verifyRes.userId
    $jwtPass = ($farmerToken -ne "" -and $verifyRes.role -eq "ROLE_FARMER")
    Record-Test 5 "JWT Authentication & Session" $jwtPass "Issued JWT for Farmer ID $($farmerUserId) with role $($verifyRes.role)"
} catch {
    Record-Test 5 "JWT Authentication & Session" $false $_.Exception.Message
}

$farmerHeaders = @{ Authorization = "Bearer $farmerToken" }

# Scenario 6: Profile Save (Land Area, Soil Type, Irrigation, Pincode)
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
    $profilePass = ($profileGet.soilType -eq "BLACK_COTTON" -and $profileGet.landAreaAcres -eq 4.5 -and $profileGet.pincode -eq "506002")
    Record-Test 6 "Farmer Profile Persistence" $profilePass "Persisted Soil: $($profileGet.soilType), Acres: $($profileGet.landAreaAcres), Pincode: $($profileGet.pincode)"
} catch {
    Record-Test 6 "Farmer Profile Persistence" $false $_.Exception.Message
}

# Scenario 7: Pan-India State / District Selection
try {
    $stateDistPass = ($profileGet.state -eq "Telangana" -and $profileGet.district -eq "Warangal")
    Record-Test 7 "State / District Selection" $stateDistPass "Selected State: $($profileGet.state), District: $($profileGet.district)"
} catch {
    Record-Test 7 "State / District Selection" $false $_.Exception.Message
}

# Scenario 8: Crop Catalog Retrieval
try {
    $catalog = Invoke-RestMethod -Uri "$baseUrl/crops/catalog" -Method GET -Headers $farmerHeaders
    $hasCrops = ($catalog.Count -ge 6)
    Record-Test 8 "Crop Catalog Retrieval" $hasCrops "Retrieved $($catalog.Count) master crops with base temperatures."
} catch {
    Record-Test 8 "Crop Catalog Retrieval" $false $_.Exception.Message
}

# Scenario 9: Add Crop / Add Plot
$farmerCropId = 0
try {
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
    Record-Test 9 "Add Crop Plot Registration" ($farmerCropId -gt 0) "Created FarmerCrop ID #$farmerCropId (Cotton, 4.5 acres)"
} catch {
    Record-Test 9 "Add Crop Plot Registration" $false $_.Exception.Message
}

# Scenario 10: Crop Journey & GDD Engine
try {
    $dash = Invoke-RestMethod -Uri "$baseUrl/crops/dashboard" -Method GET -Headers $farmerHeaders
    $gddValid = ($dash.accumulatedGdd -gt 0)
    $stageValid = ($dash.stageNameEn -ne "")
    Record-Test 10 "Crop Journey & GDD Engine" ($gddValid -and $stageValid) "Age: $($dash.cropAgeDays) days, GDD: $($dash.accumulatedGdd) deg-days, Stage: $($dash.stageNameEn)"
} catch {
    Record-Test 10 "Crop Journey & GDD Engine" $false $_.Exception.Message
}

# Scenario 11: Dynamic Crop Tasks Checklist
try {
    $hasTasks = ($dash.stageTasks.Count -gt 0 -and $dash.todayTaskId -ne $null)
    Record-Test 11 "Dynamic Crop Task Checklist" $hasTasks "Found $($dash.stageTasks.Count) tasks for stage (Today: $($dash.todayTaskNameEn))"
} catch {
    Record-Test 11 "Dynamic Crop Task Checklist" $false $_.Exception.Message
}

# Scenario 12: Crop Memory Append-Only Ledger
try {
    $eventBody = @{
        eventType = "RAIN"
        cropAgeDays = 35
        title = "Heavy Monsoon Rainfall"
        notes = "Continuous rainfall; soil waterlogged in root zone."
        loggedBy = "FARMER"
    } | ConvertTo-Json

    $eventRes = Invoke-RestMethod -Uri "$baseUrl/memory/$farmerCropId/log" -Method POST -Headers $farmerHeaders -Body $eventBody -ContentType "application/json; charset=utf-8"
    $timeline = Invoke-RestMethod -Uri "$baseUrl/memory/$farmerCropId/timeline" -Method GET -Headers $farmerHeaders
    $eventPass = ($timeline.Count -ge 1 -and ($timeline | Where-Object { $_.title -like "*Rainfall*" }))
    Record-Test 12 "Crop Memory Ledger" $eventPass "Appended event to ledger; timeline count: $($timeline.Count)"
} catch {
    Record-Test 12 "Crop Memory Ledger" $false $_.Exception.Message
}

# Scenario 13: Diagnostic Safety Gate: Nitrogen Leaching (Non-Chemical First)
try {
    $diagReqA = @{
        farmerCropId = $farmerCropId
        symptomCategory = "LEAF_YELLOWING"
        symptomLocation = "LOWER_OLD_LEAVES"
        soilWaterlogged = $true
        description = "Lower leaves pale yellow following heavy waterlogging"
    } | ConvertTo-Json
    $diagA = Invoke-RestMethod -Uri "$baseUrl/problems/evaluate" -Method POST -Headers $farmerHeaders -Body $diagReqA -ContentType "application/json; charset=utf-8"
    $passA = ($diagA.chemicalRecommended -eq $false -and $diagA.suspectedCauseEn -like "*Nitrogen*")
    Record-Test 13 "Safety Gate: Non-Chemical First" $passA "Diagnosed $($diagA.suspectedCauseEn); ChemicalRecommended: $($diagA.chemicalRecommended)"
} catch {
    Record-Test 13 "Safety Gate: Non-Chemical First" $false $_.Exception.Message
}

# Scenario 14: Diagnostic Safety Gate: CIBRC Toxicity Band & PHI
try {
    $diagReqB = @{
        farmerCropId = $farmerCropId
        symptomCategory = "SUCKING_PEST"
        symptomLocation = "UPPER_NEW_LEAVES"
        soilWaterlogged = $false
        description = "Curling leaves with visible thrips and aphids underneath"
    } | ConvertTo-Json
    $diagB = Invoke-RestMethod -Uri "$baseUrl/problems/evaluate" -Method POST -Headers $farmerHeaders -Body $diagReqB -ContentType "application/json; charset=utf-8"
    $passB = ($diagB.toxicityBand -eq "BLUE" -and $diagB.preHarvestIntervalDays -eq 14)
    Record-Test 14 "Safety Gate: Toxicity Band & PHI" $passB "Toxicity: $($diagB.toxicityBand), PHI: $($diagB.preHarvestIntervalDays) days"
} catch {
    Record-Test 14 "Safety Gate: Toxicity Band & PHI" $false $_.Exception.Message
}

# Scenario 15: KVK Escalation Ticket Creation & Tracking
try {
    $escReq = @{
        cropName = "Cotton (Patti)"
        issueCategory = "PEST_DISEASE"
        symptomsDescription = "Severe thrips infestation; scientist field consultation requested."
        urgency = "HIGH"
        contactNumber = $testMobile
    } | ConvertTo-Json

    $escRes = Invoke-RestMethod -Uri "$baseUrl/escalations" -Method POST -Headers $farmerHeaders -Body $escReq -ContentType "application/json; charset=utf-8"
    $myEsc = Invoke-RestMethod -Uri "$baseUrl/escalations/my" -Method GET -Headers $farmerHeaders
    $escPass = ($myEsc.Count -ge 1 -and $myEsc[0].status -eq "PENDING")
    Record-Test 15 "KVK Escalation Ticket Creation" $escPass "Created Ticket #$($myEsc[0].id) with status: $($myEsc[0].status)"
} catch {
    Record-Test 15 "KVK Escalation Ticket Creation" $false $_.Exception.Message
}

# Scenario 16: Dynamic Alerts Engine
try {
    $alerts = Invoke-RestMethod -Uri "$baseUrl/alerts" -Method GET -Headers $farmerHeaders
    $alertsPass = ($alerts.Count -ge 1)
    Record-Test 16 "Dynamic Alerts Engine" $alertsPass "Received $($alerts.Count) active localized alerts (weather & IPM)"
} catch {
    Record-Test 16 "Dynamic Alerts Engine" $false $_.Exception.Message
}

# Scenario 17: Government Schemes API
try {
    $schemes = Invoke-RestMethod -Uri "$baseUrl/schemes?state=Telangana" -Method GET
    $schemesPass = ($schemes.Count -ge 5)
    Record-Test 17 "Government Schemes API" $schemesPass "Found $($schemes.Count) schemes (PM-KISAN, PMFBY, PMKSY, Soil Health Card...)"
} catch {
    Record-Test 17 "Government Schemes API" $false $_.Exception.Message
}

# Scenario 18: ICAR Agronomic Knowledge System
try {
    $knowledge = Invoke-RestMethod -Uri "$baseUrl/knowledge" -Method GET
    $knowledgePass = ($knowledge.Count -ge 4)
    Record-Test 18 "ICAR Knowledge Base" $knowledgePass "Found $($knowledge.Count) verified ICAR/CRIDA guidelines"
} catch {
    Record-Test 18 "ICAR Knowledge Base" $false $_.Exception.Message
}

# Scenario 19: Weather Forecast & Mandi Prices
try {
    $weather = Invoke-RestMethod -Uri "$baseUrl/external/weather?district=Warangal" -Method GET
    $mandi = Invoke-RestMethod -Uri "$baseUrl/external/market-prices?market=Warangal" -Method GET
    $extPass = ($weather.Count -ge 1 -and $weather[0].safeToSpray -ne $null -and $mandi.Count -ge 1)
    Record-Test 19 "Weather & Mandi APIs" $extPass "5-day Weather entries: $($weather.Count), Mandi commodities: $($mandi.Count)"
} catch {
    Record-Test 19 "Weather & Mandi APIs" $false $_.Exception.Message
}

# Scenario 20: Admin Authentication & Role Security Protection
try {
    # 1. Farmer token -> 403 Forbidden
    $forbiddenPass = $false
    try {
        $forbiddenRes = Invoke-RestMethod -Uri "$baseUrl/admin/overview" -Method GET -Headers $farmerHeaders
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 403) {
            $forbiddenPass = $true
        }
    }

    # 2. Admin login -> 200 OK & Overview
    $adminLogin = Invoke-RestMethod -Uri "$baseUrl/auth/admin/login" -Method POST -Body (@{ email = "admin@agrisathi.com"; password = "Admin@AgriSathi2026" } | ConvertTo-Json) -ContentType "application/json; charset=utf-8"
    $adminHeaders = @{ Authorization = "Bearer $($adminLogin.token)" }
    $adminOverview = Invoke-RestMethod -Uri "$baseUrl/admin/overview" -Method GET -Headers $adminHeaders
    $adminPass = ($forbiddenPass -and $adminOverview.totalFarmers -ge 1)
    Record-Test 20 "Admin Security & Governance" $adminPass "Farmer received HTTP 403; Admin accessed dashboard (Farmers: $($adminOverview.totalFarmers), Crops: $($adminOverview.activeCropsCount))"
} catch {
    Record-Test 20 "Admin Security & Governance" $false $_.Exception.Message
}

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "FINAL RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
$passedCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$totalCount = $results.Count
$summaryColor = if ($passedCount -eq $totalCount) { "Green" } else { "Yellow" }
Write-Host "Passed: $passedCount / $totalCount tests" -ForegroundColor $summaryColor

$results | Format-Table -AutoSize
