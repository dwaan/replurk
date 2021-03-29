var REPORTSIZE = false;

var gToArray = gsap.utils.toArray;
var gRandom = gsap.utils.random;


//////////////// Dark Mode
var darkmode = false;
function toggleDarkMode() {
	if (darkmode) addClass(_q("html"), "dark");
	else removeClass(_q("html"), "dark");
}
if (window.matchMedia){
	var darkmodemedia = window.matchMedia('(prefers-color-scheme: dark)');
	var setdarkmode = function(e) {
		if (e.matches) darkmode = true;
		else darkmode = false;
	}
	setdarkmode(darkmodemedia);
	darkmodemedia.addListener(function(e) {
		setdarkmode(e);
		toggleDarkMode();
	});
}


// HTML Log
function log(params) {
	console.log(params);
	_q("#log").innerHTML = params;
}
console.warning = function() {}

// Report size of window
if (REPORTSIZE) {
	console.info("Window:", window.innerWidth, window.innerHeight);
	console.info("Body:", _q("body").offsetWidth, _q("body").offsetHeight);
	window.addEventListener('resize', function() {
		console.info("Window:", window.innerWidth, window.innerHeight);
		console.info("Body:", _q("body").offsetWidth, _q("body").offsetHeight);
	});
}


// Displaying rounded corner only on fullscreen
var displayRoundedCorner = function() {
	if (window.innerWidth == screen.width && window.innerHeight == screen.height) {
		addClass(_q("html"), "rounded");
	} else {
		removeClass(_q("html"), "rounded");
	}
}
displayRoundedCorner();
window.addEventListener('resize', displayRoundedCorner);


////////// Initial

api.abort();