/**!
 * Moves the search form in the mobile menu (and back on desktop).
 *
 * @copyright       Copyright 2013
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1.0
 * @author          <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.5+</a>, window.matchMedia
 * @example         $.p3.mobilesearchform(pixel);
 */
/* global jQuery */

(function ( $ ) {
    var _p3 = $.p3 || {};

    _p3.mobilesearchform = function( pixel ) {

        // default for our only option
        if (!pixel) {
            pixel = 768;
        }

        var px = parseInt(pixel, 10);

        // if window.matchMedia support
        if (px && matchMedia) {
            var mq = window.matchMedia("(min-width: " + px + "px)");
            mq.addListener(moveSearchForm);
            moveSearchForm(mq);
        }

        // mobile menu: move the seach form into #main-nav (when it
        // becomes the mobile menu) and move it back when switching to
        // desktop
        // (works only on browsers with media queries)
        function moveSearchForm(mq) {
            var searchForm;

            if (mq.matches) {
                // move search form back into tools menu
                searchForm = $('#main-nav .search-form').detach();
                $('.heading-first .tools').append(searchForm);
            }
            else {
                // move search form into mobile menu
                searchForm =  $('.heading-first .tools .search-form').detach();
                $('#nav').before(searchForm);
            }
        }

    };

    $.p3 = _p3;

}( jQuery ));

