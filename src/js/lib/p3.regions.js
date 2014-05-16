/**!
 *
 * @name			p3.regions.js
 * @fileOverview	Populate region select based on the value selected in country select,
 *					Show up or hide region select depending on if it is populated or not.
 * @copyright		Copyright 2014, Greenpeace International
 * @license			MIT License (opensource.org/licenses/MIT)
 * @version			0.1
 * @author			Javier Latorre Lopez-Villalta <jlalovi@gmail.com>
 * @requires		<a href="http://jquery.com/">jQuery 1.7+</a>,
 * @example			$.p3.regions('#UserCountry', '#UserRegion', '#selectRegion');
 */
/* global jQuery */

(function ( $, w ) {
	'use strict';
	var _p3 = $.p3 || {};

	
	// Array with the available json countries with their regions.
	var defaults = {
		isoValue : ["CN", "NL", "US"],
		countrySelect : '#UserCountry',
		regionSelect : '#UserRegion',
		regionWrapper : '#selectRegion',
		urlBase : "json/regions/",
		language : 'en'	
	};

	_p3.regions = function(options) {
		var config  = $.extend(true, defaults, options || {});
		
		var init = function () {
			$(config.countrySelect).change(function(){
				onCountryChange($(this).val());			
			});
		};

		var showRegions = function(show) {
			if(show) {
				$(config.regionWrapper).removeClass("hidden");
			} else {
				$(config.regionWrapper).addClass("hidden");
			}
		};

		var onCountryChange = function(country) {
			var i = config.isoValue.indexOf(country);
			showRegions(false);
			if (i >= 0) {
				var url =  config.urlBase + config.isoValue[i] + "_" + config.language + ".json";
				$.getJSON(url, function (regions) {
					onRegionAjaxComplete(regions);
				});
			}
		};

		var onRegionAjaxComplete = function(regions) {
			console.log('region onAjaxComplete');
			var items = [];
			$.each(regions, function( iso, region ) {
				items.push( "<option value='" + iso + "'>" + region + "</option>" );
			});
			$(config.regionSelect).html(items.join(""));
			showRegions(true);
		};

		init();
	};

  $.p3 = _p3;

}( jQuery, this ));
