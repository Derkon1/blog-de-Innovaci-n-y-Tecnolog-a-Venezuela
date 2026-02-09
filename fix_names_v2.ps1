$dir = Get-ChildItem -Path . -Directory | Where-Object { $_.Name -like "IM*GENES" }
if ($dir) {
    Write-Host "Found directory: $($dir.FullName)"
    $images = Get-ChildItem -Path $dir.FullName -Filter "WhatsApp Image*"
    $count = 1
    foreach ($img in $images) {
        $newName = "gallery-$count.jpg"
        $newPath = Join-Path -Path $dir.FullName -ChildPath $newName
        Move-Item -LiteralPath $img.FullName -Destination $newPath -Force
        Write-Host "Renamed $($img.Name) to $newName"
        $count++
    }
} else {
    Write-Host "Directory not found matching IM*GENES"
}
