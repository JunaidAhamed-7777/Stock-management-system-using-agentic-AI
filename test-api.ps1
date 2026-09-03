$body = @{name="Test User"; email="test4@example.com"; password="password123"}
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/auth/register" -Body $body -ContentType "application/json"