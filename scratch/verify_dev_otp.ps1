# Verify devOtp response
$otpReq = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/otp/request" -Method Post -Body (@{ identifier = "9876543210" } | ConvertTo-Json) -ContentType "application/json"
Write-Host "Response identifier:" $otpReq.identifier
Write-Host "Response message:" $otpReq.message
Write-Host "Response devOtp:" $otpReq.devOtp

if ($otpReq.devOtp -match "^\d{6}$") {
    Write-Host "SUCCESS: devOtp is properly returned in dev profile!" -ForegroundColor Green
} else {
    Write-Host "FAIL: devOtp missing" -ForegroundColor Red
}

# Verify with that devOtp
$verify = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/otp/verify" -Method Post -Body (@{ identifier = "9876543210"; otp = $otpReq.devOtp } | ConvertTo-Json) -ContentType "application/json"
Write-Host "Verify success. Token issued:" ($verify.token.Substring(0, 20) + "...")
Write-Host "Role:" $verify.role
Write-Host "Farmer ID:" $verify.farmerId
