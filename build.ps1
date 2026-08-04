<#
    build.ps1 — 把整個 App 打包成單一 HTML 檔（手機用）

    用途：
      多檔版適合在電腦上開發與閱讀，但要帶到手機上就麻煩。
      這個腳本把所有 CSS 與 JS 內嵌進 index.html，產出一個
      English-Learning.html，用 LINE / Email / 雲端硬碟傳到手機，
      用瀏覽器開啟就能用，完全離線。

    執行方式（在這個資料夾按右鍵 →「在終端中開啟」，然後貼上）：
      powershell -ExecutionPolicy Bypass -File "build.ps1"

    只需要 Windows 內建的 PowerShell，不需要 Node.js 或 Python。
#>

$ErrorActionPreference = 'Stop'

$root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$src    = Join-Path $root 'index.html'
$outFile= Join-Path $root 'English-Learning.html'

if (-not (Test-Path $src)) {
    Write-Host "找不到 index.html，請確認 build.ps1 和 index.html 放在同一個資料夾。" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== English Quest 單檔打包 ===" -ForegroundColor Cyan
Write-Host ""

$html = Get-Content -LiteralPath $src -Raw -Encoding UTF8

$cssCount = 0
$jsCount  = 0
$missing  = @()

# ---------- 內嵌 CSS ----------
# 比對 <link rel="stylesheet" href="...">
$linkPattern = '<link[^>]*rel\s*=\s*"stylesheet"[^>]*href\s*=\s*"([^"]+)"[^>]*>'
$html = [regex]::Replace($html, $linkPattern, {
    param($m)
    $rel = $m.Groups[1].Value -replace '\?.*$', ''
    $path = Join-Path $script:root $rel
    if (Test-Path $path) {
        $script:cssCount++
        Write-Host ("  CSS  " + $rel) -ForegroundColor DarkGray
        $body = Get-Content -LiteralPath $path -Raw -Encoding UTF8
        return "<style>`n/* ===== $rel ===== */`n$body`n</style>"
    } else {
        $script:missing += $rel
        return $m.Value
    }
})

# ---------- 內嵌 JS ----------
# 比對 <script src="..."></script>
$scriptPattern = '<script[^>]*src\s*=\s*"([^"]+)"[^>]*>\s*</script>'
$html = [regex]::Replace($html, $scriptPattern, {
    param($m)
    $rel = $m.Groups[1].Value -replace '\?.*$', ''
    $path = Join-Path $script:root $rel
    if (Test-Path $path) {
        $script:jsCount++
        Write-Host ("  JS   " + $rel) -ForegroundColor DarkGray
        $body = Get-Content -LiteralPath $path -Raw -Encoding UTF8
        # 內容裡如果出現 </script> 會提早關掉標籤，先拆開
        $body = $body -replace '</script>', '<\/script>'
        return "<script>`n/* ===== $rel ===== */`n$body`n</script>"
    } else {
        $script:missing += $rel
        return $m.Value
    }
})

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "以下檔案找不到，已保留原本的連結：" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host ("  - " + $_) -ForegroundColor Yellow }
}

# 加一行註記，方便日後辨認這是打包版
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
$html = $html -replace '(?<=<body>)', "`n<!-- 單檔打包版 build: $stamp -->"

# 用「無 BOM 的 UTF-8」寫出：某些手機瀏覽器看到 BOM 會顯示怪字元
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outFile, $html, $utf8NoBom)

$sizeKB = [math]::Round((Get-Item $outFile).Length / 1KB, 1)

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host ("  內嵌 " + $cssCount + " 個 CSS、" + $jsCount + " 個 JS")
Write-Host ("  產出 " + (Split-Path -Leaf $outFile) + "（" + $sizeKB + " KB）")
Write-Host ""
Write-Host "怎麼拿到手機上：" -ForegroundColor Cyan
Write-Host "  1. 把 English-Learning.html 用 LINE 傳給自己（或放到 Google 雲端硬碟）"
Write-Host "  2. 在手機上下載這個檔案"
Write-Host "  3. 用瀏覽器開啟它（Android 可直接開；iPhone 建議用「檔案」App 長按 → 分享 → 用瀏覽器開啟）"
Write-Host "  4. 進度是分開存的 — 用設定頁的「複製進度碼 / 貼上進度碼」在兩台裝置間同步"
Write-Host ""
Write-Host "注意：口說的自動評分需要網路；離線時會自動改成錄音自評。" -ForegroundColor DarkGray
Write-Host ""
