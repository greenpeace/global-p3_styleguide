//temp values:
var updateUrl = '1496';
var progressCount = 1496;
var progressTarget = 5000;

/* time to wait to fetch next value from server (in milliseconds) */
var fetchFrequency = 4000;

/* this is the value update speed (in milliseconds). Change this value to make animation faster or slower */
var updateSpeed = 30;

/* change this value to modify how fast the progress grows for the first time */
/* NOTE: the use of this value is deprecated because the addition of initialAnimationTotalDuration variable */
var initialStep = 15;

/* change this value to set the total duration of the first fetch animation (how many milliseconds takes
the progress bar from 0 to the current value */
var initialAnimationTotalDuration = 2000;

/* change this value to set the duration of the progress animation. Set it to 0 to make no animation */
var animationDuration = 0;

var controlWidth = 0;
var paused = false;
var currentValue = 0;
var targetValue = 0;
var firstFetch = true;
var currentWidth = 0;

$.ajaxSetup({
	cache: false
});
$(document).ready(function () {
	controlWidth = parseInt($('.meter-wrap').css('width').replace('px', ''));
	$('.meter-text span').html(0);
	UpdateProgress();
});

function UpdateProgress() {
	if (paused) {
		setTimeout("UpdateProgress();", fetchFrequency);
		return;
	}

	//$.get(updateUrl, function (data) {
	paused = true;

	var value = updateUrl;
	if (value < currentValue) currentValue = 0;
	targetValue = value;
	initialStep = Math.ceil((value * updateSpeed) / initialAnimationTotalDuration, 0);
	if (initialStep == 0) initialStep = 1;

	animateProgress();
	//});
}

function animateProgress() {
	if (currentValue >= targetValue) {
		paused = false;
		setTimeout("UpdateProgress();", fetchFrequency);
		return;
	}

	if (firstFetch) {
		if (targetValue - currentValue > initialStep) currentValue += initialStep;
		else {
			currentValue = targetValue;
			firstFetch = false;
		}
	} else {
		currentValue++;
	}

	var percent = currentValue / progressTarget;
	if (percent > 1) {
		percent = 1;
	}

	$('.meter-text span').html(addCommas(currentValue));
	var textWidth = $('.meter-text span').width();
	var progressWidth = controlWidth * percent;

	if (progressWidth < textWidth) {
		progressWidth = textWidth + 10;
	}

	if (progressWidth > currentWidth) {
		currentWidth = progressWidth;
	}
	$('.meter-value').animate({
		width: currentWidth
	}, {
		duration: animationDuration
	});

	/* adjust text position to ensure visibility */
	var difference = $('.meter-value').width() - textWidth;
	if (difference < 0) {
		$('.meter-text').css('margin-right', (difference - 5) + 'px');
	} else {
		$('.meter-text').css('margin-right', '5px');
	}

	setTimeout("animateProgress()", updateSpeed);
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
