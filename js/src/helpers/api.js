// API call helper
var api = {
	url: "./plurk-api.php",
	request: [],
	call: function(url, success, error) {
		var request;
		api.request[api.request.length] = new XMLHttpRequest();
		request = api.request[api.request.length - 1];

		request.open('GET', api.url + url, true);
		request.onload = function() {
			if (this.status == 200) {
				if(success) success(JSON.parse(this.response));
			} else if (this.status != 0) {
				if(error) error(this.response);
			}
		}
		request.send();
	},
	abort: function() {
		for (var i = 0; i < api.request.length; i++) {
			api.request[i].abort();
		}
		api.request = [];
	}
}