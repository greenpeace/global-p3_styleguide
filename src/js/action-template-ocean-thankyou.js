/**!
 * Action template 'Ocean' thankyou page
 * Initialise all necessary plugins here
 *
 * @param {object} $ jQuery
 * @param {object} w window
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, global) {
    'use strict';

    $(global.document).ready(function() {

        // Track form abandonment
        $.p3.social_sharing('#action-form',{
            api: false,
            networks: {
                google: {
                    enabled: false
                },
                linkedin: {
                    enabled: false
                },
                pinterest: {
                    enabled: false
                }
            }
        });

    });

}(jQuery, this));
