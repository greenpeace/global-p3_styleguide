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

    /**
     * p3.narrow.js adds classes to the body indicating widths,
     * for use in breakpoints for older browsers
     */
    if (!M.mq('only all')) {
        // Initalise narrow.js if media queries are not supported
        $.p3.narrow();
    }

    /**
     *  Placeholder options
     */

    // Force labels hidden
//    $('html').addClass('placeholder');

    // Initalise jquery.placeholder.js, a polyfill for old browser placeholders
    // You should probably also force labels hidden
    $('input, textarea, select').placeholder();

    // Force labels shown
//    $('html').addClass('no-placeholder');

    // Show or hide labels depending on browser placeholder support
    // $('html').addClass((M.input.placeholder ? '' : 'no-') + 'placeholder');


}(jQuery, Modernizr, this));
