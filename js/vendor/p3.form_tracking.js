// Form Abandonment
$(document).ready(function() { 
	var formName = '';
	var fieldName = '';
	$('.js-track-abandonment :input').blur(function () {
		formName = ($(this).closest('form').attr('id'));
		fieldName = ($(this).attr('name'));
		if(fieldName != undefined && formName != undefined) {
			if($(this).val().length > 0) {
			_gaq.push(['_trackEvent', formName, 'completed', fieldName]);
			} 
			else {
			_gaq.push(['_trackEvent', formName, 'skipped', fieldName]);
			}
		}
	});
});
