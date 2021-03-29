// Predefined scroll animation
var scroll = {
	l: 0,
	tl: [],
	st: [],
	// Move elements up with opacity with scrub
	moveText: function(params) {
		if (!params) return false;

		var elements = (params.elements)? params.elements: [];
		var position = (params.position)? params.position: "85%";
		var delta = (params.delta)? params.delta: 100;
		var move = (params.move === undefined)? true: params.move;
		var markers = (params.markers)? params.markers: false;
		var horizontal = (params.horizontal)? params.horizontal: false;
		var scroller = (params.scroller)? params.scroller: window;
		var that = this;

		gToArray(elements).forEach(function(element, index) {
			var y = delta + (15 * index);
			var trigger = (params.trigger)? params.trigger: element.parentNode;
			if (!move) y = 0;

			that.l = that.tl.push(gsap.timeline()) - 1;

			if (horizontal) {
				that.tl[that.l].fromTo(element, {
					x: y,
					opacity: 0,
				}, {
					x: 0,
					opacity: 1,
					ease: "ease.out"
				}, 0);
			} else {
				that.tl[that.l].fromTo(element, {
					y: y,
					opacity: 0,
				}, {
					y: 0,
					opacity: 1,
					ease: "ease.out"
				}, 0);
			}

			that.st.push(ScrollTrigger.create({
				scroller: scroller,
				markers: markers,
				trigger: trigger,
				start: "0 " + position,
				end:  "+=175 " + position,
				scrub: 1,
				animation: that.tl[that.l]
			}));
		});
	},
	// Move elements up without scrub
	moveThumbs: function(elements, position, scroller) {
		var that = this;

		scroller = (scroller)? scroller: window;

		if (!position) position = "85%";
		gToArray(elements).forEach(function(element) {
			var y = gRandom(250, 500, 5) + "px";

			that.l = that.tl.push(gsap.timeline()) - 1;
			that.tl[that.l].fromTo(element, {
				y: y
			}, {
				y: 0,
				duration: .75,
			}, 0);

			that.st.push(ScrollTrigger.create({
				scroller: scroller,
				trigger: element.parentNode,
				start: "0 " + position,
				end: "0 " + position,
				toggleActions: "restart none none reverse",
				animation: that.tl[that.l]
			}));
		});
	},
	// Add custom animation
	push: function(animationFunction, scrollFunction) {
		if (!animationFunction || !scrollFunction) return false;

		this.l = this.tl.push(gsap.timeline()) - 1;

		if (typeof animationFunction === "function") {
			this.tl[this.l] = animationFunction(this.tl[this.l]);
		}

		if (typeof scrollFunction === "function") {
			this.st.push(scrollFunction(this.tl[this.l]));
		}
	},
	// Call this to remove garbage
	destroy: function() {
		// Cleaning up GSAP timeline
		for (var i = 0; i < this.tl.length; i++) {
			this.tl[i].kill();
		}
		this.tl = [];
		// Cleaning up ScrollTrigger
		for (var i = 0; i < this.st.length; i++) {
			this.st[i].kill();
		}
		this.st = [];
		//
		this.l = 0;
	}
}