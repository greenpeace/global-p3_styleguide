// Avoid `console` errors in browsers that lack a console.
(function() {
    'use strict';
    var method,
    noop = function() {},
    methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'],
    l = methods.length,
    console = (window.console = window.console || {});

    while (l--) {
        method = methods[l];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

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
    var pledgeJSON = 'js/v03/json_testing/pledges.json';
    
    $(document).ready(function() {
        
        // Detect placeholder functionality
        $('html').addClass((M.input.placeholder) ? 'placeholder' : 'no-placeholder');
        
        // Focus the email field
        $('input[name=email]').focus();

        // Fill email field if cookie is set
        $.p3.remember_me_cookie('#action-form');
        
        // Animate pledge counter
        $.p3.pledge_counter('#action-counter', {
            jsonURL: pledgeJSON,
            uuid: '550e8402-e29b-41d4-a716-446655444563'
        });
  
        // Check if we can sign this pledge using only email field
        // Includes form validation plugin
        $.p3.pledge_with_email_only('#action-form', {
            signerCheckURL: 'js/v03/json_testing/signer_error_fields.json?user=fish&page=chickens&expiry=42',
            pageUUID: '550e8401-e29b-41d4-a716-446678440294',
            validationRulesURL: 'js/v03/json_testing/rules_revised.json'
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
        
    });

}(jQuery, Modernizr));