$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$buildRoot = Join-Path $projectRoot 'build'
$assetSource = Join-Path $projectRoot 'assets'
$assetDestination = Join-Path $buildRoot 'assets'

New-Item -ItemType Directory -Path $buildRoot -Force | Out-Null
New-Item -ItemType Directory -Path $assetDestination -Force | Out-Null

foreach ($fileName in @('index.html', 'manifest.webmanifest', 'sw.js')) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $fileName) -Destination (Join-Path $buildRoot $fileName) -Force
}

Copy-Item -Path (Join-Path $assetSource '*') -Destination $assetDestination -Recurse -Force

Write-Host "Prepared GitHub Pages files in $buildRoot"
