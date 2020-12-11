/**
 * Browser detector
 */
if (!/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
	console.log("Non-Apple product detected");
	document.getElementsByTagName("body")[0].className += " not-apple";
} else {
	console.log("Apple product detected");
}

/**
 * Scroll-to-top
 * https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js
 */
window.addEventListener("load", function () {
	var btn = document.getElementsByClassName("top")[0];
	if (btn) {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			scroll({ top: 0, left: 0, behavior: 'smooth' });
		});
		if (window.scrollY >= 10 && window.getComputedStyle(btn, null).getPropertyValue('right').replace(/px$/, '') <= 30) {
			btn.style.right = "30px";
			btn.style.transform = "none";
		}
		window.addEventListener("scroll", function() {
			var btnRight = window.getComputedStyle(btn, null)
				.getPropertyValue('right')
				.replace(/px$/, '')
			if (window.scrollY >= 10) {
				if (btnRight <= 0) {
					btn.style.right = "30px";
					btn.style.transform = "none";
				}
			} else if (btnRight > 0) {
				btn.style.right = "-100px";
				btn.style.transform = "rotate(-90deg)";
			}
		});
	}
});

function polyfill() {
	'use strict';
	if ('scrollBehavior' in document.documentElement.style && window.__forceSmoothScrollPolyfill__ !== true) return;
	
	var original = { scroll: window.scroll };
	
	var now = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : Date.now;
	
	class scrollElement {
		constructor(x, y) {
			this.scrollLeft = x;
			this.scrollTop = y;
		}
	}
	
	function ease(k) {
		return 0.5 * (1 - Math.cos(Math.PI * k));
	}
	
	function shouldBailOut(firstArg) {
		if (firstArg === null || typeof firstArg !== 'object' || firstArg.behavior === undefined || firstArg.behavior === 'auto' || firstArg.behavior === 'instant') return true;
	
		if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') return false;
	
		throw new TypeError('behavior member of ScrollOptions ' + firstArg.behavior + ' is not a valid value for enumeration ScrollBehavior.');
	}
	
	function step(context) {
		var value;
		var currentX;
		var currentY;
		var elapsed = (now() - context.startTime) / 468;
	
		elapsed = elapsed > 1 ? 1 : elapsed;
	
		value = ease(elapsed);
	
		currentX = context.startX + (context.x - context.startX) * value;
		currentY = context.startY + (context.y - context.startY) * value;
	
		context.method.call(context.scrollable, currentX, currentY);
	
		if (currentX !== context.x || currentY !== context.y) window.requestAnimationFrame(step.bind(window, context));
	}
	
	function smoothScroll(el, x, y) {
		var scrollable;
		var startX;
		var startY;
		var method;
	
		if (el === document.body) {
			scrollable = window;
			startX = window.scrollX || window.pageXOffset;
			startY = window.scrollY || window.pageYOffset;
			method = original.scroll;
		} else {
			scrollable = el;
			startX = el.scrollLeft;
			startY = el.scrollTop;
			method = scrollElement;
		}
	
		step({
			scrollable: scrollable,
			method: method,
			startTime: now(),
			startX: startX,
			startY: startY,
			x: x,
			y: y
		});
	}
	
	window.scroll = function() {
		if (arguments[0] === undefined) return;
	
		if (shouldBailOut(arguments[0]) === true) {
			original.scroll.call(
				window,
				arguments[0].left !== undefined
				? arguments[0].left
				: typeof arguments[0] !== 'object'
					? arguments[0]
					: window.scrollX || window.pageXOffset,
				arguments[0].top !== undefined
				? arguments[0].top
				: arguments[1] !== undefined
					? arguments[1]
					: window.scrollY || window.pageYOffset
			);
		
			return;
		}
	
		smoothScroll.call(
			window,
			document.body,
			arguments[0].left !== undefined
				? ~~arguments[0].left
				: window.scrollX || window.pageXOffset,
			arguments[0].top !== undefined
				? ~~arguments[0].top
				: window.scrollY || window.pageYOffset
		);
	};
}

if (typeof exports === 'object' && typeof module !== 'undefined') {
	(module.exports = { polyfill: polyfill });
} else {
	polyfill();
}
