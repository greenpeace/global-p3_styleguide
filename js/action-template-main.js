/**!
 * $.p3.request
 *
 * Query string parser, returns the url and an object
 * containing the GET parameters in key: value format
 *
 * Required in most $.p3 libraries
 *
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @requires        <a href="http://jquery.com/">jQuery</a>
 * @usage           $.p3.request('http://fish.com?type=salmon');
 * @version         0.1.1
 * @param           {string} url jQuery
 * @returns         {object} { url: 'http://fish.com', parameters: { type: 'salmon' } }
 */
(function($) {
    'use strict';
    var _p3 = $.p3 || {};

    _p3.request = function(url) {
        var request = {
          url: false,
          parameters: false
        },
        parts = [],
        getRequestParams = function() {
            var params = {};

            if (parts[1]) {
                $.each(parts[1].split(/[&;]/g), function (i, param) {
                    var q = param.split(/\=/);
                    if (q.length > 1 && q[0].length && q[1].length) {
                        params[q[0]] = q[1];
                    }
                });
            }
            return params;
        },
        getRequestURL = function() {
            return (parts[0].length) ? parts[0] : url;
        };

        if (url) {
          parts = url.split('?');
        } else {
          return request;
        }

        request.url = getRequestURL(),
        request.parameters = getRequestParams();

        return request;
    };

    $.p3 = _p3;

}(jQuery));

/**!
 * Main application javascript
 * Initialise all necessary plugins here
 *
 * @param {object} $ jQuery
 * @param {object} M Modernizr
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, M) {
    'use strict';

    // GET parameters to send with each request
    var parameters = {
        page: 269648,                               // ID of the current page
        key:  '78d245e17c455859b4863ad34674f2b8'    // API access key - tied to the referring domain
    },
    // Demonstration showing parameters passed in the URL (including spurious parameter)
    pledgeURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/',
    pledgeTesting = 'js/v03/json_testing/pledges.json',
    signerCheckURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/signercheck/',
    signerCheckTesting = 'js/v03/json_testing/signer_error_fields.json',
    // Demonstrating a blank URL, which will have required parameters added in the function call
    validationURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledges/validation/',
    validationTesting = 'js/v03/json_testing/rules_revised.json';

    $.ajaxSetup({cache: 1});

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
            jsonURL: 'js/v03/json_testing/social_simple.json',
            networks: {
                twitter: {
                    title: window.document.title
                },
                pinterest: {
                    image: 'http://www.greenpeace.org/international/Global/international/artwork/other/2010/openspace/bigspace-photo.jpg',
                    description: window.document.title
                }
            }
        });

        $.p3.recent_signers('#action-recent-signers', {
            jsonURL: pledgeURL,
            params: parameters
        });

    });

}(jQuery, Modernizr));
