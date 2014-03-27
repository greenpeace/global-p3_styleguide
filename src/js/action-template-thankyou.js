/**!
 * Main application javascript
 * Initialise all necessary plugins here
 *
 * @param {object} $ jQuery
 * @param {object} M Modernizr
 * @param {object} w window
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, M, w, undef) {
    'use strict';

    $.ajaxSetup({cache: false});

    $(document).ready(function() {

        // Update social share counts
        $.p3.social_sharing('#action-social-share', {
            //jsonURL: petition.localSocial.url.simple,
            networks: {
                twitter: {
                    title: w.document.title
                }
            }
        });

    });

}(jQuery, Modernizr, this));
