$Content = Get-Content .\js\script.js -Raw
$StartIdx = $Content.LastIndexOf('// PHOTO UPLOAD & GLOBAL GALLERY (CLOUDINARY)')
$EndIdx = $Content.IndexOf('// GUIDED TOUR LOGIC', $StartIdx)
if ($StartIdx -ne -1 -and $EndIdx -ne -1) {
    $NewContent = $Content.Substring(0, $StartIdx) + $Content.Substring($EndIdx)
    [System.IO.File]::WriteAllText(".\js\script.js", $NewContent, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed!"
} else {
    Write-Host "Not found"
}
