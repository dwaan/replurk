// Animate functions
var animate = {
	top: function(el, tl) {
		if (tl == null) tl = gsap;

		// Scroll to top
		var scroll = el.scrollTop / (window.outerHeight * 2);
		if (scroll > 0) {
			tl.to(el, {
				scrollTo: 0,
				duration: (scroll > 2)? 2 : scroll,
				ease: "expo.inOut"
			}, 0);
		}

		return tl
	},
	show: function (next, done, nonsticky, footer){
		if (next == undefined) return false;
		if (nonsticky == undefined) nonsticky = false;
		if (footer == undefined) footer = true;

		// Default gsap timeline value
		var tl = gsap.timeline({ defaults: {
			duration: 1,
			stagger: .1,
			ease: "expo.out"
		}});

		// Unhide main element
		tl.set(next, {
			opacity: 1
		}, 0);

		if (typeof done !== "function") return false;

		// Show current view
		var els = next.querySelectorAll(".flares:not(.side)")
		if (footer) els = next.querySelectorAll(".flares:not(.side), .footer > *");
		if (!nonsticky) nonsticky = next.querySelector("section.middle").children;
		// Animate text
		tl.fromTo([nonsticky, els], {
			y: "+=200px",
			opacity: 0
		}, {
			y: "-=200px",
			opacity: 1,
			onComplete: function() {
				removeStyle(nonsticky);
			}
		}, 0);
		// Animate flare
		tl.fromTo(next.querySelectorAll(".flares.side > img"), {
			x: "+=" + (window.innerWidth * 1/2) + "px",
			opacity: 0
		}, {
			x: "-=" + (window.innerWidth * 1/2) + "px",
			opacity: 1
		}, 0);
		// Run done after all all animation complete
		tl.set(next, {
			onComplete: function() {
				done();
			}
		});
	},
	showinstant: function (next, done){
		if (next == undefined) return false;

		// Unhide main element
		gsap.set(next, { opacity: 1 }, 0);

		// Run done after all all animation complete
		done();
	},
	show404: function (next, done){
		if (next == undefined) return false;

		// Default gsap timeline value
		var tl = gsap.timeline({ defaults: {
			duration: 1,
			stagger: .1,
			ease: "expo.out"
		}});

		// Unhide main element
		tl.set(next, {
			opacity: 1
		}, 0);

		if (typeof done !== "function") return false;

		// Show current view
		// Animate text
		tl.fromTo(next.querySelectorAll(".text > *"), {
			y: "+=200px",
			opacity: 0
		}, {
			y: "-=200px",
			opacity: 1,
			onCompleteParams: [[next.querySelectorAll(".text > *")]],
			onComplete: function(els) {
				removeStyle(els);
				done();
			}
		}, 0);
		tl.fromTo(next.querySelectorAll("#lost h2"), {
			x: "-=300",
			opacity: 0
		}, {
			x: 0,
			opacity: 1,
			stagger: .1
		}, 0);
		// Animate Mr. Monkey
		var mrmonkey = next.querySelectorAll("#mrmonkey");
		tl.fromTo(mrmonkey, {
			y: "-100%"
		}, {
			y: "-50%",
			rotation: 5,
			duration: 4,
			ease: "elastic"
		}, .5);
		tl.to(mrmonkey, {
			y: "-32.5%",
			rotation: -2.5,
			duration: 5,
			ease: "expo"
		});
		tl.to(mrmonkey, {
			y: "-10%",
			rotation: 0,
			duration: 5,
			ease: "elastic.out"
		});
		tl.to(mrmonkey, {
			y: "-5%",
			rotation: 0,
			duration: 5,
			ease: "expo"
		});
		tl.to(mrmonkey, {
			y: "0%",
			duration: 5,
			repeat: -1,
			yoyo: true,
			ease: "back.out"
		});
	},
	hide: function (current, done, nonsticky, scrolltop) {
		if (current == undefined) return false;
		if (typeof done !== "function") return false;
		if (nonsticky == undefined) nonsticky = false;
		if (scrolltop == undefined) scrolltop = true;

		// Default gsap timeline value
		var tl = gsap.timeline({ defaults: {
			duration: .75,
			ease: "power3.in",
			stagger: {
				from: "end",
				amount: .1
			}
		}});

		// Scroll to top
		if (scrolltop) tl = this.top(current, tl);

		// Hide current view
		tl.to(current.querySelectorAll(".flares:not(.side), .menu-page ol > li, .footer > *"), {
			y: "+=200",
			opacity: 0
		}, ">");
		tl.to(current.querySelectorAll(".flares.side img"), {
			x: "+=300",
			opacity: 0,
			delay: .1
		}, "<");
		if (!nonsticky) nonsticky = current.querySelector("section.middle").children;
		tl.to(nonsticky, {
			y: "+=200",
			opacity: 0,
			delay: .2
		}, "<");

		// Run loading after all animation
		tl.set(current, {
			onComplete: function() {
				done();
			}
		});
	},
	hide404: function (current, done){
		if (current == undefined) return false;
		if (typeof done !== "function") return false;

		// Default gsap timeline value
		var tl = gsap.timeline({ defaults: {
			duration: .75,
			ease: "power3.in",
			stagger: {
				from: "end",
				amount: .1
			}
		}});

		// Hide current view
		tl.to(current.querySelectorAll(".thumbs"), {
			y: "-80%",
			opacity: 0
		}, ">");
		tl.to(current.querySelectorAll("#lost h2"), {
			x: 0,
			opacity: 0,
			stagger: .1
		}, "<");
		tl.to(current.querySelectorAll(".text"), {
			y: "+=300",
			opacity: 0
		}, "<");

		// Run loading after all animation
		tl.set(current, {
			onComplete: function() {
				done();
			}
		});
	},
}