$images = Get-ChildItem -Path "c:\Users\PROTO\Documents\blog\blog-de-Innovaci-n-y-Tecnolog-a-Venezuela\IMÀGENES" -Filter "WhatsApp Image*"
$count = 1
foreach ($img in $images) {
    $newName = "gallery-$count.jpg"
    $newPath = Join-Path -Path $img.DirectoryName -ChildPath $newName
    Move-Item -LiteralPath $img.FullName -Destination $newPath -Force
    Write-Host "Renamed $($img.Name) to $newName"
    $count++
}
