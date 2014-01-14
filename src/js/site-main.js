/**!
 * Main application javascript
 * Initialise all necessary plugins applicable for the site
 *
 * @param {object} $ jQuery
 * @param {object} M Modernizr
 * @param {object} w window
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, M, w, undef) {
    'use strict';
    // move search form into mobile menu and back
    $.p3.mobilesearchform("768");

    // provides submenu navigation for mobile menu
    //$.p3.mobilemenu("#main-nav");

    // pretty checkboxes and radios via Formstone picker
    //$('form input[type=radio], form input[type=checkbox]:not(.mobilemenu-label)').picker();

    // Load narrow.js if media queries are not supported
    M.load({
        test: M.mq('only all'),
        nope: 'dist/js/compat/p3.narrow.js'
    });

    // Detect placeholder functionality
    $('html').addClass((M.input.placeholder ? '' : 'no-') + 'placeholder');

}(jQuery, Modernizr, this));
