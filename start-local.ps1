param(
    [int]$Port = 8080
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$url = "http://localhost:$Port"

Write-Host "Sirviendo Maestro Italiano en $url" -ForegroundColor Cyan
Write-Host "Pulsa Ctrl+C para detener el servidor." -ForegroundColor DarkGray

Start-Process $url
py -m http.server $Port --directory $root