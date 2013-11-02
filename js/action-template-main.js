/**!
 * Main application javascript
 * Initialise all necessary plugins here
 *
 * @param {object} $ jQuery
 * @param {object} M Modernizr
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, M, w) {
    'use strict';

    // GET parameters to send with each request
    var parameters = {
        page: 269648,                               // ID of the current page
        key:  '78d245e17c455859b4863ad34674f2b8'    // API access key - tied to the referring domain
    },
    // API URL Demonstration showing parameters passed in the URL (including spurious parameter)
    pledgeURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/?fish=salmon&page=12345',
    pledgeTesting = 'json/pledges.json?fish=salmon',
    // API URL to test if user can submit form using only email
    signerCheckURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/signercheck/',
    signerCheckTesting = 'json/signer_error_fields.json',
    // API URL for form validation rules
    validationURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/validation/',
    validationTesting = 'json/rules_revised.json';

//    $.ajaxSetup({cache: 1});

    // Load narrow.js if media queries are not supported
    M.load({
        test: M.mq('only all'),
        nope: 'js/lib/p3.narrow.js'
    });

    $(document).ready(function() {

        // Detect placeholder functionality
        $('html').addClass( (M.input.placeholder ? '' : 'no-') + 'placeholder');

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

        // Fill email field if cookie is set
        $.p3.remember_me_cookie('#action-form');

        // Animate pledge counter
        $.p3.pledge_counter('#action-counter', {
            jsonURL:    pledgeURL,
            params:     parameters
        });

        // Check if we can sign this pledge using email field only
        // Includes form validation via $.p3.validation
        $.p3.pledge_with_email_only('#action-form', {
            signerCheckURL:     signerCheckTesting,
            validationRulesURL: validationURL,
            params:             parameters
        });

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

    });

    function getBaseURL () {
//        var path = w.location.pathname.split( '/' );
//        console.log(path);

       return w.location.protocol + "//" + w.location.hostname + (w.location.port && ":" + w.location.port) + "/" + w.location.pathname;
    }

}(jQuery, Modernizr, this));
