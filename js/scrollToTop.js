/**
 * Scroll-to-top
 * https://github.com/iamdustan/smoothscroll/blob/master/src/smoothscroll.js
 */
window.addEventListener("load", () => {
	const btn = document.getElementsByClassName("top")[0];
	if (btn) {
		// Click to scroll to top
		btn.addEventListener("click", e => {
			e.preventDefault();
			scroll({ top: 0, left: 0, behavior: 'smooth' });
		});
		// Triggers button if refresh occurs while not being at the top of the page
		if (window.scrollY >= 10 && window.getComputedStyle(btn, null).getPropertyValue('right').replace(/px$/, '') <= 0) {
			btn.style.right = "30px";
			btn.style.transform = "none";
		}
		// Scroll dynamic triggering
		window.addEventListener("scroll", () => {
			if (window.scrollY < 0) return;
			const btnRight = window.getComputedStyle(btn, null)
				.getPropertyValue('right')
				.replace(/px$/, '');
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
