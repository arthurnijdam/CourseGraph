if (navigator.userAgent.search("Firefox") >= 0) {
	/* Scroll to anchor */
	function pgshow(e) {
		var elId = window.location.hash;
		if (elId.length > 1) {
			el = document.getElementById(elId.substr(1));
			if (el) el.scrollIntoView(true);
		}
	}
	// pageshow fires after load and on Back/Forward
	window.addEventListener('pageshow', pgshow);
}