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

        // social buttons
        $.p3.social_sharing('#action-form',{
            api: false,
            pageURL: 'http://www.greenpeace.org/SOS-oceans',
            networks: petition.share
        });

    });

}(jQuery, this));
