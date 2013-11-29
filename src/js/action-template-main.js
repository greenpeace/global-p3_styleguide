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
    var parameters = {
            page: 300507, // ID of the current page
            key: '78d245e17c455859b4863ad34674f2b8', // API access key - tied to the referring domain
            expire: '2013-11-02'
        },
        // API URL Demonstration showing parameters passed in the URL
        pledgeURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/',
        pledgeTesting = 'json/pledges.json?fish=salmon',
        // API URL to test if user can submit form using only email
        signerCheckURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/signercheck/',
        signerCheckTesting = 'json/signer_error_fields.json',
        // API URL for form validation rules
        validationURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/validation/',
        validationTesting = 'json/rules_revised.json';

    $.ajaxSetup({cache: false});

    // Load narrow.js if media queries are not supported
//    M.load({
//        test: M.mq('only all'),
//        nope: 'dist/js/compat/p3.narrow.js'
//    });

    $(document).ready(function() {

        // Detect placeholder functionality
        $('html').addClass((M.input.placeholder ? '' : 'no-') + 'placeholder');

        // Add classes to html
        if (!M.mq('only all')) {
            $.p3.narrow();
        }

        // Track form abandonment
        $.p3.form_tracking('.js-track-abandonment');

        // Display pseudo-placeholder in search form
        // using default/placeholder.js
        if (!M.input.placeholder) {
            $('#SearchText').focus(function() {
                var input = $(this);
                if (input.val() === input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() === '' || input.val() === input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() === input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }

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
        $.p3.pledge_counter('#action-counter', {
            jsonURL: pledgeURL,
            params: parameters
        });

        // Check if we can sign this pledge using email field only
        // Includes form validation via $.p3.validation by default
        $.p3.pledge_with_email_only('#action-form', {
            signerCheckURL: signerCheckTesting,
            validationRulesURL: validationTesting,
            params: parameters
        });

        // Only call validation plugin if you aren't using pledge_with_email,
        // or you've set pledge_with_email to not use validation
//        $.p3.validation('#action-form', {
//            jsonURL: validationTesting,
//            params: parameters
//        });

        // Update social share counts
        $.p3.social_sharing('#action-social-share', {
            jsonURL: 'json/social_simple.json',
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

        $.p3.recent_signers('#action-recent-signers', {
            jsonURL: pledgeURL,
            params: parameters
        });

        // move search form into mobile menu and back
        $.p3.mobilesearchform("768");

        // provides submenu navigation for mobile menu
        $.p3.mobilemenu("#main-nav");

    });


}(jQuery, Modernizr, this));
