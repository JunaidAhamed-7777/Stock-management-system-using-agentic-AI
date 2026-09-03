1. Get-Service *postgres*
- see if postgres is running
- if not running:
    - Start-Service postgresql-x64-18

2. cd server
- npx prisma validate 
- npx prisma db push
- npm run dev
- Invoke-WebRequest http://localhost:3001
    - would give 404 Route not found 
    - this confirms express is running properly
- Invoke-RestMethod http://localhost:3001/api/products
    - shows product list
    - Invoke-RestMethod http://localhost:3001/api/products/<productid>
        - productid is an int
        - shows info about one particular product
- Invoke-RestMethod http://localhost:3001/api/stock/low-stock
    - quantity <= lowStockThreshold
- Invoke-RestMethod http://localhost:3001/api/stock/transactions
- Authentication: 
    - User registration
        $body = @{
            name = "Test Customer"
            email = "testcustomer@example.com"
            password = "TestPassword123"
        } | ConvertTo-Json

        $register = Invoke-RestMethod `
            -Uri "http://localhost:3001/api/auth/register" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body

        $register
    - Customer Login
        $body = @{
            email = "testcustomer@example.com"
            password = "TestPassword123"
        } | ConvertTo-Json

        $login = Invoke-RestMethod `
            -Uri "http://localhost:3001/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body

        $login
        $customerToken = $login.token
        - use $customerToken to check if customer token was 
    - /api/auth/me
        Invoke-RestMethod `
            -Uri "http://localhost:3001/api/auth/me" `
            -Headers @{ Authorization = "Bearer $customerToken" }
- Invoke-RestMethod http://localhost:3001/api/auth/me
    - Should give 401 unauthorized 
    - proves the endpoint isn't publicly accessible
    - this is authentication protection

- Admin Login
    - admin@example.com
    - admin123
    $body = @{
        email = "admin@example.com"
        password = "admin123"
    } | ConvertTo-Json

    $adminLogin = Invoke-RestMethod `
        -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $adminLogin
    $adminToken = $adminLogin.token
    - then use $adminToken to see if admin token was taken successfully
    - admin /me path
    Invoke-RestMethod `
        -Uri "http://localhost:3001/api/auth/me" `
        -Headers @{ Authorization = "Bearer $adminToken" }

- Supplier Login
    - supplier1@example.com
    - supplier123
    $body = @{
        email = "supplier1@example.com"
        password = "supplier123"
    } | ConvertTo-Json

    $supplierLogin = Invoke-RestMethod `
        -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body

    $supplierToken = $supplierLogin.token
    
- Testing role based authorization 
    - Using customer token to use product creation which is only for admin/supplier
    $body = @{
        name = "Unauthorized Product"
        description = "RBAC test"
        sku = "RBAC-TEST"
        price = 100
        quantity = 10
        lowStockThreshold = 2
    } | ConvertTo-Json

    Invoke-RestMethod `
        -Uri "http://localhost:3001/api/products" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $customerToken" } `
        -ContentType "application/json" `
        -Body $body
    - 403 Forbidden

- Testing customer order creation
    - get product list 
    $products = Invoke-RestMethod http://localhost:3001/api/products
    $products
    $products[0].id