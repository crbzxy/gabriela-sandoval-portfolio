# PowerShell Script para verificar la integración de Google Analytics

Write-Host "======= Verificando integración de Google Analytics =======" -ForegroundColor Yellow

# Directorio del proyecto - cambia esto si es necesario
$projectDir = "."
$indexHtml = "$projectDir\index.html"
$gaId = "G-RWTE743TV5"

# Verifica que el archivo index.html exista
if (-not (Test-Path $indexHtml)) {
    Write-Host "Error: No se encontró el archivo index.html en $projectDir" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit
}

Write-Host "Verificando archivo index.html..."

# Verifica si el script de Google Analytics está presente
$content = Get-Content $indexHtml -Raw
if ($content -match "googletagmanager.com/gtag/js") {
    Write-Host "✓ Script de Google Analytics encontrado" -ForegroundColor Green
}
else {
    Write-Host "✗ No se encontró el script de Google Analytics" -ForegroundColor Red
    Write-Host "Añade el siguiente código en la sección <head> de tu index.html:"
    Write-Host "<!-- Google tag (gtag.js) -->`n<script async src=`"https://www.googletagmanager.com/gtag/js?id=$gaId`"></script>"
}

# Verifica si la configuración de GA está presente
if ($content -match "gtag\('config'") {
    Write-Host "✓ Configuración de Google Analytics encontrada" -ForegroundColor Green
    
    # Verifica si el ID de GA es correcto
    if ($content -match $gaId) {
        Write-Host "✓ ID de Google Analytics correcto ($gaId)" -ForegroundColor Green
    }
    else {
        Write-Host "✗ ID de Google Analytics incorrecto" -ForegroundColor Red
        Write-Host "Actualiza tu ID de GA a: $gaId"
    }
}
else {
    Write-Host "✗ No se encontró la configuración de Google Analytics" -ForegroundColor Red
    Write-Host "Añade el siguiente código en la sección <head> de tu index.html:"
    Write-Host "<script>`nwindow.dataLayer = window.dataLayer || [];`nfunction gtag(){dataLayer.push(arguments);}`ngtag('js', new Date());`ngtag('config', '$gaId');`n</script>"
}

Write-Host "`n======= Verificando integración con React =======" -ForegroundColor Yellow

# Busca archivos que podrían contener configuración de GA
$reactFiles = Get-ChildItem -Path "$projectDir\src" -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" -ErrorAction SilentlyContinue

$firebaseFound = $false
$reactGaFound = $false
$cookieConsentFound = $false

foreach ($file in $reactFiles) {
    $fileContent = Get-Content $file -Raw
    
    if ($fileContent -match "firebase/analytics") {
        $firebaseFound = $true
    }
    
    if ($fileContent -match "react-ga") {
        $reactGaFound = $true
    }
    
    if ($fileContent -match "cookieConsent|cookie-consent|gdpr") {
        $cookieConsentFound = $true
    }
}

if ($firebaseFound) {
    Write-Host "✓ Integración de Firebase Analytics encontrada" -ForegroundColor Green
}
else {
    Write-Host "⚠ No se encontró integración con Firebase Analytics" -ForegroundColor Yellow
    Write-Host "Esto es opcional, pero podría ser útil para funcionalidades avanzadas"
}

if ($reactGaFound) {
    Write-Host "✓ Integración de ReactGA encontrada" -ForegroundColor Green
}
else {
    Write-Host "⚠ No se encontró integración con ReactGA" -ForegroundColor Yellow
    Write-Host "Considera usar ReactGA para un mejor seguimiento de eventos en React"
    Write-Host "npm install react-ga4"
}

if ($cookieConsentFound -or ($content -match "cookieConsent|cookie-consent|gdpr")) {
    Write-Host "✓ Sistema de consentimiento de cookies encontrado" -ForegroundColor Green
}
else {
    Write-Host "⚠ No se encontró sistema de consentimiento de cookies" -ForegroundColor Yellow
    Write-Host "Considera implementar un banner de consentimiento de cookies para cumplir con GDPR y otras regulaciones"
}

Write-Host "`n======= Recomendaciones =======" -ForegroundColor Yellow
Write-Host "1. Asegúrate de que el script de Google Analytics esté en la sección <head> del index.html"
Write-Host "2. Para un seguimiento más preciso en una aplicación React, considera usar react-ga4"
Write-Host "3. Implementa un banner de consentimiento de cookies para cumplir con regulaciones de privacidad"
Write-Host "4. Verifica que el ID de Google Analytics ($gaId) sea correcto"

Write-Host "`n======= ¿Cómo probar que funciona? =======" -ForegroundColor Yellow
Write-Host "1. Ejecuta tu aplicación en modo desarrollo: npm run dev"
Write-Host "2. Abre la consola de desarrollador del navegador (F12)"
Write-Host "3. Ve a la pestaña 'Network' (Red)"
Write-Host "4. Filtra por 'google-analytics' o 'collect'"
Write-Host "5. Deberías ver peticiones a los servidores de Google Analytics"
Write-Host "6. También puedes verificar en Google Analytics en tiempo real después de 24-48 horas"

Write-Host "`nEsto completará la integración básica. Para características avanzadas, considera usar react-ga4 o Firebase Analytics."