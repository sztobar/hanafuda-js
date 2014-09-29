<?php
echo <<<FIRST
<!DOCTYPE HTML>
<html lang="pl">
<head>
    <title>Strona po¿wi¿cona grze karcianej Hanafuda</title>
    <link href='http://fonts.googleapis.com/css?family=IM+Fell+DW+Pica+SC' rel='stylesheet' type='text/css'>
	<link media="all" rel="stylesheet" href="css/style.css" type="text/css" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/colorpickers.js"></script>
</head>
<body>
	<section id="whole">
		<section id="main">
			<header class="frame">
				<embed src="img/hanafuda.svg" width="500" height="150" type="image/svg+xml" />
			</header>
			<nav class="frame">
				<ul>
					<li id="this"><a href="index.html">Strona G³ówna</a></li>
					<li><a href="o_grze.html">O grze</a></li>
					<li><a href="zasady.html">Zasady gry</a></li>
 					<li><a href="gra.html">Zagraj</a></li>
					<li><a href="linki.html">Linki</a></li>
				</ul>
				<section id="colorpickers">
					<svg onClick="changeTheme('219, 85, 29', '233, 151, 116');" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
						<rect width="20" height="20" fill="rgb(219, 85, 29)" />
						<rect x="3" y="3" width="14" height="14" fill="rgb(233, 151, 116)" />
					</svg>
					<svg onClick="changeTheme('150, 0, 0', '182, 27, 27');" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
						<rect width="20" height="20" fill="rgb(150, 0, 0)" />
						<rect x="3" y="3" width="14" height="14" fill="rgb(182, 27, 27)" />
					</svg>
					<svg onClick="changeTheme('11, 53, 117', '27, 89, 182');" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
						<rect width="20" height="20" fill="rgb(11, 53, 117)" />
						<rect x="3" y="3" width="14" height="14" fill="rgb(27, 89, 182)" />
					</svg>
				</section>
			</nav>
            <section id="frame">
FIRST;
?>
