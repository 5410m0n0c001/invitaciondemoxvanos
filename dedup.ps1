$lines = Get-Content -Path .\js\script.js -Encoding UTF8
$newLines = $lines[0..808] + $lines[1008..($lines.Count - 1)]
Set-Content -Path .\js\script.js -Value $newLines -Encoding UTF8
