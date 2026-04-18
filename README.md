# ScreenCapture by CodeMonkey

ScreenCapture is a full-stack app for capturing screenshots, extracting colours, and organizing colours into palettes.

## Stack

- Frontend: React 18 + Vite + JavaScript
- Backend: PHP 8.1+ (Apache)
- Database: MySQL 8
- Auth: PHP sessions
- Mail: PHPMailer (SMTP)

## Project Layout

- Frontend source: src
- PHP API: api
- Upload storage: uploads
- SQL schema: database/schema.sql
- Runtime config: .config.json

## Local Development (Laragon + https://localhost)

### 1. Requirements

- Laragon with Apache, PHP 8.1+, MySQL 8
- Node.js 20+
- Composer 2+

### 2. Place project in Laragon web root

Put this folder under your Laragon www directory and map it to an HTTPS host.

Example host:

- https://localhost

### 3. Configure app

Edit .config.json:

- Set app.url to https://localhost
- Set db credentials to your Laragon MySQL values
- Set smtp values to your test SMTP account

Important:

- api/cors.php now uses app.url as the allowed origin, so changing app.url to https://localhost is enough for local API calls.

### 4. Create database tables

Run database/schema.sql in MySQL.

### 5. Install PHP dependencies

Run in project root:

```bash
composer install
```

### 6. Install frontend dependencies

Run in project root:

```bash
npm install
```

### 7. Build frontend into dist

```bash
npm run build
```

Deploy the generated dist files to your Apache document root when testing deployed behavior.

### 8. Ensure upload permissions

uploads must be writable by the web server process.

### 9. Local endpoint quick check

- App config: https://localhost/api/app-config.php
- Session status: https://localhost/api/auth/status.php

## Dreamhost Production Deployment

### 1. Upload files

Deploy to Dreamhost document root:

- index.html + assets from dist
- api directory
- uploads directory
- .htaccess
- .config.json

### 2. Configure .config.json

- app.url must be https://screencapture.codemonkey.design
- Use production db and smtp credentials

### 3. Install Composer packages on server

```bash
composer install --no-dev --optimize-autoloader
```

### 4. Create DB schema

Run database/schema.sql in Dreamhost MySQL.

### 5. Cron job for cleanup

Set a daily cron task:

```bash
php /path/to/screencapture.codemonkey.design/api/cleanup/expire.php
```

### 6. Verify Apache rules

- .config.json blocked
- uploads blocked
- SPA rewrite active for non-api routes

## API Smoke Test Checklist

Use the step-by-step list in docs/api-smoke-checklist.md.

## Notes

- Place codemonkey-logo.png in web root so header/auth branding renders.
- Never commit real secrets in .config.json.
