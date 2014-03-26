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
(function($, global) {
    'use strict';

    // GET parameters to send with each request
    var petition = {
            live: {
                parameters: {
                    action: 685
                },
                actions: {
                    base: 'https://secured.greenpeace.org/international/en/api/v2/pledges/',
                    signerCheck: 'https://secured.greenpeace.org/international/en/api/v2/pledges/signercheck/',
                    validation: 'json/rules_ocean_en.json',
                   // validation: 'https://secured.greenpeace.org/international/Global/international/code/2014/sos/json/rules_ocean_en.json'
                }
            }
        };

    $.ajaxSetup({cache: false});

    $(global.document).ready(function() {

        // Track form abandonment
        $.p3.form_tracking('.js-track-abandonment');

        // Focus the email field for easier form entry
        $('input[name=email]').focus();

        // Fill input fields from GET parameters
        $.p3.autofill('#action-form');

        // Only call the validation plugin if you aren't using pledge_with_email,
        // or you've set pledge_with_email to not use validation
        $.p3.validation('#action-form', {
            jsonURL: petition.live.actions.validation,
            params: petition.live.parameters
        });

    });

}(jQuery, this));
