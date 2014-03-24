/**!
 * Track Form Abandonment through Google Analytics
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.3
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>,
 *                  Google Analytics tracking script
 * @example         $.p3.form_tracking('#action-form');
 */
/* global jQuery, _gaq */

(function($, w, d, undef) {
    'use strict';

    var _p3 = $.p3 || ($.p3 = {}),
        pre = '$.p3.form_tracking :: ',
        G = (typeof w._gaq === 'undefined') ? [] : w._gaq;

    _p3.form_tracking = function(el) {
        var $el = $(el),
            $input = $el.is(':input') ? $el : $(':input', $el),
            formName = $el.closest('form').attr('id') || d.title;

        // Check google analytics is defined
        if (!G.length) {
            console.warn(pre + 'Google Analytics not found');
        }

        // Found a form, so monitor
        $input.blur(function() {
            var $this = $(this),
            fieldName = $this.attr('name');

            // If this field has a name
            if (fieldName !== undef) {
                // And it has a value
                if ($input.val().length > 0) {
                    // Track an input event
                    G.push(['_trackEvent', formName, 'completed', fieldName]);
                } else {
                    // Or track a skip event
                    G.push(['_trackEvent', formName, 'skipped', fieldName]);
                }
            }
        });
    };

}(jQuery, this, document));
