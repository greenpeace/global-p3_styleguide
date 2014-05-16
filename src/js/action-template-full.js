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

    // GET parameters to send with each request
    var petition = {
            live: {
                parameters: {
                    action: 685
                },
                actions: {
                    base: 'https://secured.greenpeace.org/international/en/api/v2/pledges/',
                    signerCheck: 'https://secured.greenpeace.org/international/en/api/v2/pledges/signercheck/',
                    validation: 'https://secured.greenpeace.org/international/en/api/v2/pledges/validation/'
                }
            },
            localSocial: {
                url: {
                    simple: '../test/json/social_simple.json',
                    full: '../test/json/social_full_response.json'
                }
            }
        };

    $.ajaxSetup({cache: false});


    $(document).ready(function() {

        // Detect placeholder functionality
        $('html').addClass((M.input.placeholder ? '' : 'no-') + 'placeholder');

        // Add classes to html
        if (!M.mq('only all')) {
            $.p3.narrow();
        }

        // Track form abandonment
        $.p3.form_tracking('.js-track-abandonment');

        // Focus the email field for easier form entry
        $('input[name=email]').focus();

        /** Note the order of the next two plugins
         Both p3.remember_me_cookie() and p3.autofill() plugins may
         potentially fill the email field automatically, overwriting contents
         Adjust the load order as required */

        // Fill email field if cookie is set
        $.p3.remember_me_cookie('#action-form');

        // Fill input fields from GET parameters
        $.p3.autofill('#action-form');

        // Animate pledge counter
        // Note that no parameters are required if you intend to trigger updates
        // from events in a different fetch, eg p3.recent_signers
        $.p3.pledge_counter('#action-counter');

        // Else to have pledge_counter initiate it's own fetches use:
//        $.p3.pledge_counter('#action-counter', {
//            jsonURL: pledgeLive,
//            params: parameters
//        });


        // Check if we can sign this pledge using email field only
        // Includes form validation via $.p3.validation by default
//        $.p3.pledge_with_email_only('#action-form', {
//           signerCheckURL: petition.live.actions.signerCheck,
//            validationRulesURL: petition.live.actions.validation,
//            params: petition.live.parameters
//        });


        // Only call validation plugin if you aren't using pledge_with_email,
        // or you've set pledge_with_email to not use validation
//        $.p3.validation('#action-form', {
//            jsonURL: validationTesting,
//            params: parameters
//        });


        // Update social share counts
        $.p3.social_sharing('#action-social-share', {
            api: petition.localSocial.url.simple,
            networks: {
                twitter: {
                    title: w.document.title
                },
                pinterest: {
                    image: 'http://www.greenpeace.org/international/Global/international/artwork/other/2010/openspace/bigspace-photo.jpg',
                    description: w.document.title
                }
            }
        });

        // Recent signers widget
        $.p3.recent_signers('#action-recent-signers', {
            jsonURL: petition.live.actions.pledges,
            params: petition.live.parameters
        });

        // Populate and show regions
        $.p3.regions();

        // Birthday input masked
        $ ("#UserBirthday").mask ("99/99/9999");

    });

}(jQuery, Modernizr, this));
