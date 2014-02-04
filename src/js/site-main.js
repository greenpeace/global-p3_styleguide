/**!
 * Main application javascript
 * Initialise all necessary plugins applicable for the site
 *
 * @param {object} $ jQuery
 * @param {object} M Modernizr
 * @returns {undefined}
 */
/* globals jQuery, Modernizr */
(function($, M) {
    'use strict';

    // move search form into mobile menu and back
    $.p3.mobilesearchform("768");

    // provides submenu navigation for mobile menu
    //$.p3.mobilemenu("#main-nav");

    // pretty checkboxes and radios via Formstone picker
    //$('form input[type=radio], form input[type=checkbox]:not(.mobilemenu-label)').picker();

    // Initalise narrow.js if media queries are not supported
    if (!M.mq('only all')) {
         $.p3.narrow();
    }

    // Detect placeholder functionality
    $('html').addClass((M.input.placeholder ? '' : 'no-') + 'placeholder');

}(jQuery, Modernizr, this));
