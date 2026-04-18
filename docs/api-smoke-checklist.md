# API Smoke Checklist (Laragon Local)

Base URL used below:

- https://localhost

Use one browser session for cookie-based auth so PHP session cookies are preserved.

## Preflight

1. Confirm config endpoint responds:
   - GET https://localhost/api/app-config.php
   - Expect: JSON with app section
2. Confirm status endpoint responds:
   - GET https://localhost/api/auth/status.php
   - Expect: authenticated false (before login)

## Auth Flow

1. Register
   - POST https://localhost/api/auth/register.php
   - JSON body: username, email, password
   - Expect: success true
2. Verify account
   - Open email verification link or call verify endpoint manually with token
   - GET https://localhost/api/auth/verify.php?token=YOUR_TOKEN
   - Expect: success true
3. Login
   - POST https://localhost/api/auth/login.php
   - JSON body: email, password
   - Expect: success true and user object
4. Status after login
   - GET https://localhost/api/auth/status.php
   - Expect: authenticated true
5. Logout
   - POST https://localhost/api/auth/logout.php
   - Expect: success true

## Images Flow

1. Login first (cookie required)
2. Upload PNG
   - POST https://localhost/api/images/upload.php
   - multipart/form-data field: screenshot
   - Expect: success true and image object
3. List images
   - GET https://localhost/api/images/list.php
   - Expect: images array with uploaded file
4. Serve image
   - GET https://localhost/api/images/serve.php?id=IMAGE_ID
   - Expect: image/png stream
5. Label image
   - POST https://localhost/api/images/label.php
   - JSON body: id, label
   - Expect: success true
6. Delete image
   - POST https://localhost/api/images/delete.php
   - JSON body: id
   - Expect: success true

## Colours Flow

1. Save colour
   - POST https://localhost/api/colours/save.php
   - JSON body: hex, rgb_r, rgb_g, rgb_b, hsl_h, hsl_s, hsl_l, image_id (optional), label (optional)
   - Expect: success true and colour object
2. List colours
   - GET https://localhost/api/colours/list.php
   - Expect: colours array
3. Label colour
   - POST https://localhost/api/colours/label.php
   - JSON body: id, label
   - Expect: success true
4. Delete colour
   - POST https://localhost/api/colours/delete.php
   - JSON body: id
   - Expect: success true

## Palettes Flow

1. Create palette
   - POST https://localhost/api/palettes/create.php
   - JSON body: name
   - Expect: success true and palette object
2. List palettes
   - GET https://localhost/api/palettes/list.php
   - Expect: palettes array
3. Add colour to palette
   - POST https://localhost/api/palettes/add-colour.php
   - JSON body: palette_id, colour_id
   - Expect: success true
4. Remove colour from palette
   - POST https://localhost/api/palettes/remove-colour.php
   - JSON body: palette_id, colour_id
   - Expect: success true
5. Rename palette
   - POST https://localhost/api/palettes/rename.php
   - JSON body: id, name
   - Expect: success true
6. Delete palette
   - POST https://localhost/api/palettes/delete.php
   - JSON body: id
   - Expect: success true

## Password Reset Flow

1. Request reset
   - POST https://localhost/api/auth/reset-request.php
   - JSON body: email
   - Expect: success true always
2. Confirm reset
   - POST https://localhost/api/auth/reset-confirm.php
   - JSON body: token, password
   - Expect: success true

## Cleanup Flow

1. Run manually:
   - php api/cleanup/expire.php
2. Expect:
   - JSON summary in terminal
   - log line appended to api/cleanup/expire.log

## Optional PowerShell test snippets

These commands are examples only. Use your own values.

```powershell
$base = "https://localhost/api"

Invoke-RestMethod "$base/app-config.php" -Method Get
Invoke-RestMethod "$base/auth/status.php" -Method Get -SessionVariable WebSession

$registerBody = @{ username = "testuser"; email = "test@example.com"; password = "Password123!" } | ConvertTo-Json
Invoke-RestMethod "$base/auth/register.php" -Method Post -Body $registerBody -ContentType "application/json"

$loginBody = @{ email = "test@example.com"; password = "Password123!" } | ConvertTo-Json
Invoke-RestMethod "$base/auth/login.php" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $WebSession
Invoke-RestMethod "$base/auth/status.php" -Method Get -WebSession $WebSession
```
