/**
 * Scroll-to-top
 * https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js
 */
 window.addEventListener("load", function () {
	var btn = document.getElementsByClassName("top")[0];
	if (btn) {
		btn.addEventListener("click", function(e) {
			e.preventDefault();
			scroll({ top: 0, left: 0, behavior: 'smooth' });
		});
		if (window.scrollY >= 100 && window.getComputedStyle(btn, null).getPropertyValue('right').replace(/px$/, '') <= 0) {
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
		}, {
            passive: true
        });
	}
});
