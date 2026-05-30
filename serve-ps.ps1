$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:8080/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Servidor en $prefix (Ctrl+C para parar)"

$mime = @{
    ".html"="text/html"; ".js"="text/javascript"; ".css"="text/css";
    ".json"="application/json"; ".webmanifest"="application/manifest+json";
    ".svg"="image/svg+xml"; ".md"="text/markdown"; ".png"="image/png";
    ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".webp"="image/webp"; ".ico"="image/x-icon"
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
        if ([string]::IsNullOrWhiteSpace($rel)) { $rel = "index.html" }
        $isHead = $ctx.Request.HttpMethod -eq "HEAD"

        # ── Proxy TTS: voz italiana neuronal (sin CORS/ORB, mismo origen) ──
        if ($rel -eq "tts") {
            try {
                $q = $ctx.Request.QueryString["q"]
                if ([string]::IsNullOrWhiteSpace($q)) {
                    $ctx.Response.StatusCode = 400
                } else {
                    $enc = [System.Uri]::EscapeDataString($q)
                    $ttsUrl = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=it&q=$enc"
                    $ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
                    $resp = Invoke-WebRequest -Uri $ttsUrl -Headers @{ "User-Agent" = $ua; "Referer" = "https://translate.google.com/" } -UseBasicParsing
                    $audio = $resp.Content
                    $ctx.Response.ContentType = "audio/mpeg"
                    $ctx.Response.Headers.Add("Cache-Control", "public, max-age=86400")
                    $ctx.Response.ContentLength64 = $audio.Length
                    if (-not $isHead) { $ctx.Response.OutputStream.Write($audio, 0, $audio.Length) }
                }
            } catch {
                $ctx.Response.StatusCode = 502
            }
            $ctx.Response.Close()
            continue
        }

        # ── Validacion codigo de desbloqueo premium (test local) ──
        if ($rel -eq "unlock") {
            $code = ($ctx.Request.QueryString["code"] ?? "").Trim().ToUpper()
            # Cambia este valor para probar localmente (en produccion usa la variable de entorno en Netlify)
            $localUnlockCode = "TEST-1234"
            $isValid = ($code -eq $localUnlockCode)
            $json = if ($isValid) { '{"valid":true,"message":"Acceso desbloqueado."}' } else { '{"valid":false,"message":"Codigo no valido."}' }
            $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $ctx.Response.ContentType = "application/json"
            $ctx.Response.ContentLength64 = $jsonBytes.Length
            if (-not $isHead) { $ctx.Response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length) }
            $ctx.Response.Close()
            continue
        }

        $path = Join-Path $root $rel
        if (Test-Path $path -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            $ext = [System.IO.Path]::GetExtension($path).ToLower()
            if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] }
            $ctx.Response.ContentLength64 = $bytes.Length
            if (-not $isHead) { $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length) }
        } else {
            $ctx.Response.StatusCode = 404
        }
        $ctx.Response.Close()
    } catch {
        # Nunca dejar que un error de una petición tumbe el servidor
    }
}
