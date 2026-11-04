Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path -Parent $PSScriptRoot
$srcPath = Join-Path $projectRoot "public\android-chrome-512x512.png"
$srcImg = [System.Drawing.Image]::FromFile($srcPath)

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($folder in $sizes.Keys) {
    $dim = $sizes[$folder]
    $destFolder = Join-Path $projectRoot "android\app\src\main\res\$folder"
    if (Test-Path $destFolder) {
        $bmp = New-Object System.Drawing.Bitmap($dim, $dim)
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.DrawImage($srcImg, 0, 0, $dim, $dim)
        $graph.Dispose()

        $bmp.Save("$destFolder\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Save("$destFolder\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Output "Generated $folder icons at ${dim}x${dim}"
    }
}
$srcImg.Dispose()
