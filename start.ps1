$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:8000/"

function Get-ContentType($path) {
  switch ([System.IO.Path]::GetExtension($path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "application/javascript; charset=utf-8" }
    ".txt" { "text/plain; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".png" { "image/png" }
    ".gif" { "image/gif" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".svg" { "image/svg+xml" }
    ".mp3" { "audio/mpeg" }
    ".ogg" { "audio/ogg" }
    ".wav" { "audio/wav" }
    default { "application/octet-stream" }
  }
}

function Write-Response($context, $statusCode, $bytes, $contentType) {
  $response = $context.Response
  $response.StatusCode = $statusCode
  $response.ContentType = $contentType
  $response.ContentLength64 = $bytes.Length
  $response.OutputStream.Write($bytes, 0, $bytes.Length)
  $response.OutputStream.Close()
}

try {
  $listener.Prefixes.Add($prefix)
  $listener.Start()
  Write-Host ""
  Write-Host "Serving $root" -ForegroundColor Green
  Write-Host "Open $prefix in your browser" -ForegroundColor Cyan
  Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
  Write-Host ""

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $safeRelativePath = $requestPath -replace "/", "\"
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $root $safeRelativePath))

    if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
      Write-Response $context 403 $bytes "text/plain; charset=utf-8"
      continue
    }

    if ((Test-Path $fullPath) -and -not (Get-Item $fullPath).PSIsContainer) {
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $contentType = Get-ContentType $fullPath
      Write-Response $context 200 $bytes $contentType
      continue
    }

    $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
    Write-Response $context 404 $bytes "text/plain; charset=utf-8"
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
