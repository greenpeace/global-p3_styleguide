// Avoid `console` errors in browsers that lack a console.
!function(){"use strict";for(var a,b=function(){},c=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],d=c.length,e=window.console=window.console||{};d--;)a=c[d],e[a]||(e[a]=b)}();

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
 * @param           {string} url jQuery
 * @returns         {object} { url: 'http://fish.com', parameters: { type: 'salmon' } }
 */
(function($) {
    'use strict';
    var _p3 = $.p3 || {};

    _p3.request = function(url) {
        var parts = url.split('?'),
        getRequestParams = function() {
            var params = {};

            if (parts[1]) {
                parts[1].split(/[&;]/g).forEach(function (param) {
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
        },
        location = getRequestURL(),
        parameters = getRequestParams();

        return {
            url: location,
            parameters: parameters
        };
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
    var pledgeURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledge/pledges/?fish=42&page=269648', // Demonstration showing parameters passed in the URL (including spurious parameter)
    validationURL = 'http://greenpeace.relephant.nl/international/en/api/v2/pledge/validation/', // Demonstrating a blank URL, which will have required parameters added in the function call
    parameters = {
        page: 269648,
        key:  '78d245e17c455859b4863ad34674f2b8'
    };

    $.ajaxSetup({cache: 1});

    $(document).ready(function() {

        // Detect placeholder functionality
        $('html').addClass((M.input.placeholder) ? 'placeholder' : 'no-placeholder');

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
            signerCheckURL:     'js/v03/json_testing/signer_error_fields.json',
            validationRulesURL: validationURL,
            params:             parameters
        });

        // Update social share counts
//        $.p3.social_sharing('#action-social-share', {
//            jsonURL: 'js/v03/json_testing/social_simple.json',
//            networks: {
//                twitter: {
//                    title: window.document.title
//                },
//                pinterest: {
//                    image: 'http://www.greenpeace.org/international/Global/international/artwork/other/2010/openspace/bigspace-photo.jpg',
//                    description: window.document.title
//                }
//            }
//        });

    });

}(jQuery, Modernizr));