/**!
 *
 * @name            p3.regions.js
 * @fileOverview    Populate region select based on the value selected in country select,
 *                  Show up or hide region select depending on if it is populated or not.
 * @copyright       Copyright 2014, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1
 * @author          Javier Latorre Lopez-Villalta <jlalovi@gmail.com>
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 * @example         $.p3.regions('#UserCountry', '#UserRegion', '#selectRegion');
 */
/* global jQuery */

(function ( $, w ) {
  var _p3 = $.p3 || {};

  _p3.regions = function(countrySelectId, regionSelectId, regionDivId) {

  // Array with the available json countries with their regions.
  var isoValue = ["CN", "NL", "US"];

    $(countrySelectId).change(function(){
        for (var i=0; i<isoValue.length; i++) {
          if ($(this).val() === isoValue[i]) {
            $(regionDivId).removeClass("hidden");
            break;
          }
          else {
            $(regionDivId).addClass("hidden");
          }
        }
        if (isoValue[i]) {
            $.getJSON("json/regions/" + isoValue[i] + "_en.json", function (addOptionRegion) {
                var items = [];
                $.each( addOptionRegion, function( iso, region ) {
                    items.push( "<option value='" + iso + "'>" + region + "</option>" );
                });
                $(regionSelectId).html(items.join( "" ));
            });
        }
    });
  };

  $.p3 = _p3;

}( jQuery, this ));
