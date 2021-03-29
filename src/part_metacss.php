	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<!-- Primary Meta Tags -->
	<title>RePlurk Test Page</title>
	<meta name="title" content="RePlurk Test Page">
	<meta name="description" content="Replurk Test Page">

	<link rel="stylesheet" media="screen" href="/css/bundle.css?<?php echo filemtime('css/bundle.css') ?>">
	<link rel="stylesheet" media="screen and (min-aspect-ratio: 1/1)" href="/css/horizontal-screen.css?<?php echo filemtime('css/horizontal-screen.css') ?>">
	<link rel="stylesheet" media="screen and (max-aspect-ratio: 1/1)" href="/css/vertical-screen.css?<?php echo filemtime('css/vertical-screen.css') ?>">

	<script type="text/javascript">
		var classcollection = "no-js";
		/* See if it's in dark mode */
		h = document.querySelector("html");
		if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
			classcollection = "dark";
		}
		// Displaying rounded corner only on fullscreen
		if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
			classcollection += " rounded"
		}
		// Set the class
		h.setAttribute('class', classcollection);
	</script>

	<?php
		$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === FALSE ? 'http' : 'https';

		$host = $_SERVER['HTTP_HOST'];
		$uri = $_SERVER['REQUEST_URI'];
		$params = @$_SERVER['QUERY_STRING'];

		if ($params == "") $url = $protocol . '://' . $host . $uri;
		else $url = $protocol . '://' . $host . $uri . '?' . $params;
	?>