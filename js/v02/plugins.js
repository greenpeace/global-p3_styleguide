// Avoid `console` errors in browsers that lack a console.
(function () {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'];
	var l = methods.length;
	var console = (window.console = window.console || {});

	while (l--) {
		method = methods[l];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// Place any jQuery/helper plugins in here.
$.getScript("js/backwards-compatibility/degrade-gracefully-with-modernizer.js");
