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
            pageURL: 'http://www.greenpeace.org/SOS-oceans',
            networks: {
                twitter: {
                    url: "https://twitter.com/intent/tweet?original_referer=__REFERRER__&source=tweetbutton&text=__TITLE__&url=__REFERRER__",
                    title: "Our #oceans need your help! Send an #SOS and ask the World's leaders to support #OceanSanctuaries at the #UN:"
                },
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
