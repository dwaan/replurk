<?php
	$base_url = "https://www.plurk.com";
	$req_url = "$base_url/OAuth/request_token";
	$auth_url = "$base_url/OAuth/authorize";
	$acc_url = "$base_url/OAuth/access_token";
	$api_url = "$base_url/APP";

	$conskey = 'qrMzkjPRRmaM';
	$conssec = 'HMQ7W2gkzECcY753BG7h4f9LWDrf1LK3';

	function debug($str) {
		print("<pre>");
		print_r($str);
		exit();
	}

	function error($message = "unauthorized") {
		http_response_code(203);
		header('Content-type:application/json;charset=utf-8');
		echo '{"success": false, "error": true, "message": "'.$message.'"}';
		exit();
	}

	function success($message = "success") {
		http_response_code(200);
		header('Content-type:application/json;charset=utf-8');
		echo '{"success": true, "error":  false, "message": '.$message.'}';
		exit();
	}

	function datediff($today, $date) {
		$diffday = $today->diff($date)->format("%d");
		$diffmonth = $today->diff($date)->format("%m");
		$diffyear = $today->diff($date)->format("%y");

		if ($diffyear == 1) $when = "A year ago";
		else if ($diffyear > 1) $when = $diffyear . " years ago";
		else if ($diffmonth > 1) $when = $diffmonth . " months ago";
		else if ($diffmonth == 1) $when = "A month ago";
		else if ($diffday >= 14) $when = round($diffday / 7) . " weeks ago";
		else if ($diffday >= 7) $when = "A week ago";
		else if ($diffday == 1) $when = "Yesterday";
		else if ($diffday > 1) $when = $diffday . " days ago";
		else $when = "Today at " . date_format($date,"H:i");

		return $when;
	}

	session_start();

	$_SESSION['year'] = '2020';

	if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') $url = 'https://';
    else $url = 'http://';
    $url.= $_SERVER['HTTP_HOST'];
    $url.= $_SERVER['REQUEST_URI'];

	$oauth = new OAuth($conskey, $conssec, OAUTH_SIG_METHOD_HMACSHA1, OAUTH_AUTH_TYPE_URI);

	try {
		if(isset($_GET['request'])) {
			$request = $_GET['request'];
			if ($request == "token") {
				// Get first token
				$request_token_info = $oauth->getRequestToken($req_url);
				$_SESSION['token'] = $request_token_info['oauth_token'];
				$_SESSION['secret'] = $request_token_info['oauth_token_secret'];

				success('{"token":"'.$_SESSION['token'].'","url":"'.$auth_url.'?oauth_token='.$_SESSION['token']. '"}');
			} else if ($request == "permanenttoken") {
				if (!isset($_SESSION['token']) || !isset($_SESSION['secret'])) {
					error('No token/token secret available');
				}
				if (!isset($_GET['token'])) {
					error('Please provide access token');
				}

				$_SESSION['oauth_token'] = $_GET['token'];

				$oauth->setToken($_SESSION['token'], $_SESSION['secret']);
				$access_token_info = $oauth->getAccessToken($acc_url, $url, $_SESSION['oauth_token']);
				$_SESSION['permanenttoken'] = $access_token_info['oauth_token'];
				$_SESSION['permanentsecret'] = $access_token_info['oauth_token_secret'];

				success('"Permanent tokens are saved"');
			} else if ($request == "logout") {
				session_destroy();
				success('"You\'re logged out"');
			} else {
				error();
			}
		} else {
			if (!isset($_SESSION['permanenttoken']) || !isset($_SESSION['permanentsecret'])) {
				error('No permanent token available');
			}

			$oauth->setToken($_SESSION['permanenttoken'], $_SESSION['permanentsecret']);

			$fetch = '';
			if(isset($_GET['fetch'])) $fetch = $_GET['fetch'];

			if ($fetch == "plurks") {
				// Get Plurk
				$content = [];
				$plurker = [];
				$offset = 0;
				$loop = -1;
				$year = '2020';
				$filter = "";

				// Filter Plurk
				if(isset($_GET['filter'])) $filter = $_GET['filter'];

				// If loop present, this will only fetch (loop) times
				if(isset($_GET['year'])) $year = intval($_GET['year']);
				if(isset($_GET['loop'])) $loop = intval($_GET['loop']);

				$parameters = array("filter" => $filter);
				do {
					if($offset != 0) $parameters = array("offset" => $offset, "filter" => $filter);

					$oauth->fetch("$api_url/Timeline/getPlurks", $parameters);
					$plurks = json_decode($oauth->getLastResponse());

					// Get the last plurk date
					$postdate = date_create($plurks->plurks[sizeof($plurks->plurks) - 1]->posted);
					$offset = date_format($postdate,"Y-m-d\TH:i:s");
					$postyear = intval(date_format($postdate,"Y"));

					// Merge the plurk content with previous one
					$content = array_merge($content, $plurks->plurks);

					$loop--;
					if ($loop == 0) {
						break;
					}
				} while($postyear == $year);
				success(json_encode($content));
			} else if ($fetch == "plurk") {
				// Get Plurk
				$plurker = [];
				$parameters = [];

				if(isset($_GET['offset'])) $parameters["offset"] = $_GET['offset'];
				if(isset($_GET['filter'])) $parameters["filter"] = $_GET['filter'];

				$oauth->fetch("$api_url/Timeline/getPlurks", $parameters);
				$plurks = json_decode($oauth->getLastResponse());

				$postdate = date_create($plurks->plurks[sizeof($plurks->plurks) - 1]->posted);
				$offset = date_format($postdate,"Y-m-d\TH:i:s");
				$plurks->offset = $offset;

				success(json_encode($plurks));
			} else if ($fetch == "response") {
				// Get Response
				if(isset($_GET['plurk_id'])) {
					$response = [];

					$oauth->fetch("$api_url/Responses/get", array("plurk_id" => $_GET['plurk_id']));
					$response = json_decode($oauth->getLastResponse());
					$response->plurk_id = $_GET['plurk_id'];

					success(json_encode($response));
				} else if(isset($_GET['plurk_ids'])) {
					$responses = [];
					if($_GET['plurk_ids']) {
						$plurk_ids = explode(',', $_GET['plurk_ids']);

						$response = [];
						foreach ($plurk_ids as $key => $value) {
							$oauth->fetch("$api_url/Responses/get", array("plurk_id" => $value));
							$response = json_decode($oauth->getLastResponse());
							$response->plurk_id = $value;

							$responses[] = $response;
						}
						success(json_encode($responses));
					} else {
						error('Please provide one or more plurk ids');
					}
				} else {
					error('Please provide plurk id');
				}
			} else if ($fetch == "key") {
				// Get Response
				if(isset($_SESSION['permanenttoken'])) {
					success('{"token": "'.$_SESSION['permanenttoken'].'", "secret": "'.$_SESSION['permanentsecret'].'"}');
				} else {
					error('No session available');
				}
			} else if ($fetch == "APP") {
				// Get Response
				if(sizeof($_GET) > 2) {
					$parameters = [];
					foreach ($_GET as $key => $value) {
						if ($value != "APP" && $key != "url") $parameters[$key] = $value;
					}
					$response = [];

					$oauth->fetch($api_url.$_GET["url"], $parameters);
					$response = json_decode($oauth->getLastResponse());

					success(json_encode($response));
				} else {
					error('Please provide url and other parameters');
				}
			} else {
				// Output user data by default
				$oauth->fetch("$api_url/Users/me");
				success($oauth->getLastResponse());
			}
		}
	} catch(OAuthException $E) {
		error('Bad request');
	}
?>