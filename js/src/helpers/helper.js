'use strict';
////////////// Helper variables
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
////////////// Helper functions
//
// _q(element)
// _qAll(elements)
// removeClass(element, className)
// addClass(element, className)
// nextElementSibling(element)
function _q(argument) {
	return document.querySelector(argument);
}
function _qAll(argument) {
	return document.querySelectorAll(argument);
}

function removeClass(el, className) {
	if (el.classList) {
		el
			.classList
			.remove(className)
	} else {
		el.className = el
			.className
			.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
	}
}
function addClass(el, className) {
	if (el.classList) {
		el
			.classList
			.add(className)
	} else {
		var current = el.className,
			found = false;
		var all = current.split(' ');
		for (var i = 0; i < all.length, !found; i += 1) {
			found = all[i] === className
		}
		if (!found) {
			if (current === '') {
				el.className = className
			} else {
				el.className += ' ' + className
			}
		}
	}
}
function hasClass(el, className) {
	if (el.classList)
		return el.classList.contains(className);
	else
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
function nextElementSibling(el) {
	do {
		el = el.nextSibling
	} while (el && el.nodeType !== 1);
	return el
}
function hoverEvents(els, over, out) {
	els.forEach(function(el) {
		el.addEventListener("mouseover", function(e) {
			if (over) over(el, e);
		});
		el.addEventListener("mouseout", function(e){
			if (out) out(el, e);
		});
	});
}

// Clear the style
var removeStyle = function(el) {
	if (el.style) {
		el.style = {};
	} else {
		gToArray(el).forEach(function(el) {
			removeStyle(el);
		});
	}
}
// Add plural to word
function plural(number, word, locale) {
	if(!locale) locale = "en-US";
	if(!word) {
		word = '';
	} else {
		word = ' ' + word;
		if (number > 1) word = word + 's';
	}
	return number.toLocaleString(locale) + word;
}
function pluralinwords(number, word, locale) {
	if(!locale) locale = "en-US";

	if(!word) {
		word = '';
	} else {
		word = ' ' + word;
		if (number > 1) word = word + 's';
	}

	if (Math.floor(number / 1000000) > 0) {
		number = plural(Math.floor(number / 1000000), "million");
	} else if (Math.floor(number / 1000) > 0) {
		number = plural(Math.floor(number / 1000), "thousand");
	}

	return number.toLocaleString(locale) + word;
}
// Humanize date difference
function datediff(date) {
	var when = "";
	var today = new Date();
	date = new Date(date);

	var diff = today.getTime() - date.getTime();
	var diffday = Math.round(diff / (1000 * 3600 * 24));
	var diffmonth = Math.round(diff / (30.5 * 1000 * 3600 * 24));
	var diffyear = Math.round(diff / (12 * 30.5 * 1000 * 3600 * 24));

	if (diffyear == 1) when = "A year ago";
	else if (diffyear > 1) when = diffyear + " years ago";
	else if (diffmonth > 1) when = diffmonth + " months ago";
	else if (diffmonth == 1) when = "A month ago";
	else if (diffday >= 14) when = Math.round(diffday / 7) + " weeks ago";
	else if (diffday >= 7) when = "A week ago";
	else if (diffday == 1) when = "Yesterday";
	else if (diffday > 1) when = diffday + " days ago";
	// else when = "Today at " + date_format(date,"H:i");
	else when = "Today";

	return when;
}
// Animate number
function animateNumber(from, to, onUpdate, onComplete){
	var load = { progress: from }
	gsap.to(load, {
		progress: to,
		snap: "progress",
		ease: "linear",
		duration: .5,
		onUpdate: function() {
			if(onUpdate) onUpdate(load.progress);
		},
		onComplete: function() {
			if(onComplete) onComplete(load.progress);
		}
	});
}
// Helper distributeByPosition
function distributeByPosition(vars) {
	var ease = vars.ease,
		from = vars.from || 0,
		base = vars.base || 0,
		axis = vars.axis,
		ratio = {center: 0.5, end: 1, edges:0.5}[from] || 0,
		distances;
	return function(i, target, a) {
		var l = a.length,
			originX, originY, x, y, d, j, minX, maxX, minY, maxY, positions;
		if (!distances) {
			distances = [];
			minX = minY = Infinity;
			maxX = maxY = -minX;
			positions = [];
			for (j = 0; j < l; j++) {
				d = a[j].getBoundingClientRect();
				x = (d.left + d.right) / 2; //based on the center of each element
				y = (d.top + d.bottom) / 2;
				if (x < minX) {
					minX = x;
				}
				if (x > maxX) {
					maxX = x;
				}
				if (y < minY) {
					minY = y;
				}
				if (y > maxY) {
					maxY = y;
				}
				positions[j] = {x:x, y:y};
			}
			originX = isNaN(from) ? minX + (maxX - minX) * ratio : positions[from].x || 0;
			originY = isNaN(from) ? minY + (maxY - minY) * ratio : positions[from].y || 0;
			maxX = 0;
			minX = Infinity;
			for (j = 0; j < l; j++) {
				x = positions[j].x - originX;
				y = originY - positions[j].y;
				distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs((axis === "y") ? y : x);
				if (d > maxX) {
					maxX = d;
				}
				if (d < minX) {
					minX = d;
				}
			}
			distances.max = maxX - minX;
			distances.min = minX;
			distances.v = l = (vars.amount || (vars.each * l) || 0) * (from === "edges" ? -1 : 1);
			distances.b = (l < 0) ? base - l : base;
		}
		l = (distances[i] - distances.min) / distances.max;
		return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
	};
}
// Wait for image to load
// Parameter:
// 1. IMG Elements Object or String
// 2. On progress callback, or on done callback if there's only 2 parameter
// 3. On done callback
function waitForImg() {
	var els,
		progress,
		done,
		els_count;

	if(arguments.length <= 0) {
		return false;
	} else {
		if(typeof arguments[0] != "object") els = document.querySelectorAll(els);
		else els = arguments[0];
		els_count = els.length + 1;

		if (arguments[2]) {
			progress = arguments[1];
			done = arguments[2];
		} else {
			progress = false;
			done = arguments[1];
		}

		// At the beginning animate the progress a bit
		els_count--;
		if(progress) progress(els_count, 100-(els_count/els.length*100));

		if(els_count > 0) {
			for (var i = 0; i < els.length; i++) {
				// When loaded report it as a progress
				if(els[i].complete) {
					if(progress) progress(els_count--, 100-(els_count/els.length*100));

					if(els_count == 0) done();
				} else {
					els[i].addEventListener("load", function(e) {
						if(progress) progress(els_count--, 100-(els_count/els.length*100));

						if(els_count == 0) done();
					});
				}

			}
		} else {
			if(progress) progress(0, 100);
			done();
		}

		return true;
	}
}
// Prevent error in older browser for console
(function () {
	var method;
	var noop = function () {};
	var methods = [
		'assert',
		'clear',
		'count',
		'debug',
		'dir',
		'dirxml',
		'error',
		'exception',
		'group',
		'groupCollapsed',
		'groupEnd',
		'info',
		'log',
		'markTimeline',
		'profile',
		'profileEnd',
		'table',
		'time',
		'timeEnd',
		'timeline',
		'timelineEnd',
		'timeStamp',
		'trace',
		'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	while (length--) {
		method = methods[length];
		if (!console[method]) {
			console[method] = noop
		}
	}
}());
// Splitting text
var splitText = function(els) {
	var addTags = function (el, idx) {
		var splord, splext;
		var split = "";

		splord = el.textContent.split(" ");
		for (var i = 0; i < splord.length; i++) {
			splext = splord[i].split("");
			splord[i] = "<dl class='splord wrd" + idx + i + "'>";
			for (var j = 0; j < splext.length; j++) {
				if (splext[j] == " ") splext[j] = "&nbsp;";
				splord[i] += "<dt class='splext txt" + idx + i + j + "'>" + splext[j] + "</dt>";
			}
			splord[i] += "</dl>";
			if (i < splord.length - 1) splord[i] += " ";
			split += splord[i];
		}

		return split;
	}

	var travelTags = function(nodes, idx) {
		var split = [],
			childNodes = nodes.childNodes;

		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i].childNodes.length == 0) {
				// The child that doesn't have child
				if (childNodes[i].textContent.trim() == "") {
					split.push([" ", " "]);
				} else {
					split.push([childNodes[i].textContent, addTags(childNodes[i], idx + "" + i)]);
				}
			} else {
				// Replace the inner text with split text
				var str = childNodes[i],
					tags = travelTags(childNodes[i], idx + "" +i);
				str.innerHTML = tags[0][1];
				split.push([childNodes[i].textContent, str.outerHTML]);
			}
		}

		return split;
	}

	if (typeof els == "string") els = _qAll(els);
	if (els.length == undefined) els = [els];

	els.forEach(function(el, i) {
		var result = travelTags(el, i);
		el.innerHTML = "";
		for (var j = 0; j < result.length; j++) {
			el.innerHTML += result[j][1];
		}
	});
}
////////////////////// Huge text animation
var hugeText = function (el) {
	this.element = _q(el);
	this.element.innerHTML = "<span></span>";
	this.cancelhide = false;
	this.onshow = false;
	this.tween = null;

	gsap.set(this.element.children, {yPercent: 100});
	gsap.fromTo(this.element.children, {
		xPercent: -25
	}, {
		duration: 10,
		repeat: -1,
		ease: "linear",
		xPercent: -75
	});

	this.show = function (text) {
		this.cancelhide = true;
		this
			.element
			.querySelector("span")
			.innerHTML = "<i>" + text + "</i><i>" + text + "</i><i>" + text + "</i><i>" + text + "</i>";
		if (this.tween != null)
			this.tween.kill();
		this.tween = gsap.to(this.element.children, {
			duration: .512,
			ease: "expo",
			yPercent: 0
		});
	}

	this.hide = function () {
		var that = this;
		this.tween = gsap.to(this.element.children, {
			duration: .512,
			ease: "expo",
			yPercent: 100,
			onComplete: function () {
				if (that.cancelhide) {
					that.cancelhide = false;
				} else {
					that
						.element
						.querySelector("span")
						.innerHTML = "";
				}
			}
		});
	}

	return this;
}
///////////////// Animate Number
function animateNumbers(selector) {
	var that = this;
	this.game = {
		score: 0
	};
	this.selector = _q(selector);
	this.value = this.selector.textContent || this.selector.innerText;
	this.plus = "+";
	this.value = this.value.split("+");
	if (this.value.length <= 1) {
		this.plus = ""
	}
	this.value = this.value[0];
	this.selector.innerHTML = "0" + this.plus;
	this.animate = function () {
		gsap.to(that.game, 5, {
			score: "+=" + that.value,
			roundProps: "score",
			onUpdate: that.updateHandler,
			ease: "expo.out"
		})
	};
	this.updateHandler = function () {
		that.selector.innerHTML = that.game.score + that.plus
	};
	this.animate()
}
function animateYears(selector, year) {
	var that = this;
	this.game = {
		score: 0
	};
	this.selector = _q(selector);
	this.year__now = (new Date()).getFullYear(),
	this.year__animate = (this.year__now - year);
	this.animate = function () {
		gsap.to(that.game, 5, {
			score: "+=" + that.year__animate,
			roundProps: "score",
			onUpdate: that.updateHandler,
			ease: "expo.out"
		})
	};
	this.updateHandler = function () {
		that.selector.innerHTML = that.game.score + "+"
	};
	this.animate()
}
// Check touchevents
function isTouchSupported() {
    var msTouchEnabled = window.navigator.msMaxTouchPoints;
    var generalTouchEnabled = "ontouchstart" in document.createElement("div");

    return (msTouchEnabled || generalTouchEnabled) ? true : false;
}
// Parallax on mouse move
function parallax(callback) {
	if(isTouchSupported()) {
		// Do something with gyroscpe
	} else {
		window.onmousemove = function(event) {
			var eventDoc, doc, body;

			event = event || window.event; // IE-ism

			// If pageX/Y aren't available and clientX/Y are,
			// calculate pageX/Y - logic taken from jQuery.
			// (This is to support old IE)
			if (event.pageX == null && event.clientX != null) {
				eventDoc = (event.target && event.target.ownerDocument) || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = event.clientX +
				  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
				  (doc && doc.clientLeft || body && body.clientLeft || 0);
				event.pageY = event.clientY +
				  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
				  (doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			if (event.screenX != null) {
				var x = (event.screenX - (window.innerWidth / 2)) / (window.innerWidth / 2) / 10,
					y = (event.screenY - (window.innerHeight / 2)) / (window.innerHeight / 2) / 10;

				callback(x, y);
			}
		}
	}
}
// Photoswipe helper
var initPhotoSwipeFromDOM = function (gallerySelector) {
	// parse slide data (url, title, size ...) from DOM elements (children of
	// gallerySelector)
	var parseThumbnailElements = function (el) {
		var thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			figureEl,
			linkEl,
			size,
			item;

		for (var i = 0; i < numNodes; i++) {

			figureEl = thumbElements[i]; // <figure> element

			// include only element nodes
			if (figureEl.nodeType !== 1) {
				continue;
			}

			// linkEl = figureEl.children[0]; // <a> element
			linkEl = figureEl; // <a> element

			size = linkEl
				.getAttribute('data-size')
				.split('x');

			// create slide object
			item = {
				src: linkEl.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};

			if (figureEl.children.length > 1) {
				// <figcaption> content
				item.title = figureEl.children[1].innerHTML;
			}

			if (linkEl.children.length > 0) {
				// <img> thumbnail element, retrieving thumbnail url
				item.msrc = linkEl
					.children[0]
					.getAttribute('src');
			}

			item.el = figureEl; // save link to element for getThumbBoundsFn
			items.push(item);
		}

		return items;
	};

	// find nearest parent element
	var closest = function closest(el, fn) {
		return el && (fn(el)
			? el
			: closest(el.parentNode, fn));
	};

	// triggers when user clicks on thumbnail
	var onThumbnailsClick = function (e) {
		e = e || window.event;
		e.preventDefault
			? e.preventDefault()
			: e.returnValue = false;

		var eTarget = e.target || e.srcElement;

		// find root element of slide
		var clickedListItem = closest(eTarget, function (el) {
			return (el.tagName && el.tagName.toUpperCase() === 'A');
		});

		if (!clickedListItem) {
			return;
		}

		// find index of clicked item by looping through all child nodes alternatively,
		// you may define index via data- attribute
		var clickedGallery = clickedListItem.parentNode,
			childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;

		for (var i = 0; i < numChildNodes; i++) {
			if (childNodes[i].nodeType !== 1) {
				continue;
			}

			if (childNodes[i] === clickedListItem) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}

		if (index >= 0) {
			// open PhotoSwipe if valid index found
			openPhotoSwipe(index, clickedGallery);
		}
		return false;
	};

	// parse picture index and gallery index from URL (#&pid=1&gid=2)
	var photoswipeParseHash = function () {
		var hash = window
				.location
				.hash
				.substring(1),
			params = {};

		if (hash.length < 5) {
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}

		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		return params;
	};

	var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
		var pswpElement = _qAll('.pswp')[0],
			gallery,
			options,
			items;

		items = parseThumbnailElements(galleryElement);

		// define options (if needed)
		options = {

			// define gallery index (for URL)
			galleryUID: galleryElement.getAttribute('data-pswp-uid'),
			bgOpacity: 1,
			preload: [
				1, 3
			],

			getThumbBoundsFn: function (index) {
				// See Options -> getThumbBoundsFn section of documentation for more info
				var thumbnail = items[index]
						.el
						.getElementsByTagName('img')[0], // find thumbnail
					pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect();

				return {
					x: rect.left,
					y: rect.top + pageYScroll,
					w: rect.width
				};
			}

		};

		// PhotoSwipe opened from URL
		if (fromURL) {
			if (options.galleryPIDs) {
				// parse real index when custom PIDs are used
				// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
				for (var j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				// in URL indexes start from 1
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}

		// exit if index not found
		if (isNaN(options.index)) return;

		if (disableAnimation) options.showAnimationDuration = 0;

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

	// loop through all gallery elements and bind events
	var galleryElements = _qAll(gallerySelector);

	for (var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i + 1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if (hashData.pid && hashData.gid) {
		openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
	}
}
////////////// Konami Code
var konami = "38,38,40,40,37,39,37,39,66,65".split(","),
	keyIndex = 0;
document.onkeydown = function (t) {
	konami[keyIndex] == t.keyCode
		? keyIndex++
		: keyIndex = 0,
	keyIndex == konami.length && (0 === _qAll("#konamicode").length && (_q("body").innerHTML += '<div id="konamicode"><iframe width="905" height="510" src="https://www.youtube-nocookie.com/embed/tgbNymZ7vqY?controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'), keyIndex = 0);
	if (_q('#konamicode') != undefined) {
		elem = _q('#konamicode');
		elem.onclick = function (e) {
			gsap.to('#konamicode', {
				duration: 1,
				ease: "expo.in",
				opacity: 0,
				onComplete: function () {
					elem
						.parentNode
						.removeChild(elem)
				}
			})
		}
	}
};