/**!
 * Track Form Abandonment through Google Analytics
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.1
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>,
 *                  Google Analytics tracking script
 * @example         $.p3.form_tracking('#action-form');
 */
/* global jQuery, _gaq */

(function($, G, undef) {
    'use strict';

    var _p3 = $.p3 || ($.p3 = {}),
        pre = '$.p3.form_tracking :: ';

    _p3.form_tracking = function(el) {
        // Check google analytics is defined
        if (undef === G) {
            throw new Error(pre + 'Google Analytics not found');
        }

        var $el = $(el),
            $input = $el.is(':input') ? $el : $(':input', $el),
            formName = $el.closest('form').attr('id');

        if (formName === undef) {
            throw new Error(pre + 'Form not found, aborting');
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

}(jQuery, _gaq));
