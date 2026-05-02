$content = Get-Content frontend/index.html
$head = $content[0..19]
$tail = $content[14245..($content.Length-1)]
$newContent = $head + '  <link rel="stylesheet" href="css/index-styles.css">' + '</head>' + "" + '<body class="antialiased">' + $tail
$newContent | Set-Content frontend/index.html
