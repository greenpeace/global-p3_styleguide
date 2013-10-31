/**!
 * p3.remember_me_cookie
 * 
 * @fileOverview        Auto fills email field from cookie
 *                      if user has previously opted in
 *                      Stores 'remember me' state from previous pledges
 *                      if browser supports localStorage (all except IE 6-7)
 * @author              <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version             0.1
 * @copyright           Copyright 2013, Greenpeace International
 * @license             MIT License (opensource.org/licenses/MIT)
 * @example             $.p3.remember_me_cookie('#action-form'[, options]);
 * @requires            <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                      <a href="http://modernizr.com/">Modernizr</a>                     
 *
 */
/* global Modernizr */
(function ($, M) {
    'use strict';
    
    var _p3 = $.p3 || {},
    defaults = {
        /* rememberMe input checkbox selector */
        rememberMeSelector: '#RememberMe',
        /* email input field selector */
        emailSelector:      '#UserEmail',
        /* cookie variable name */
        cookieName:         'email',
        /* time in days before the cookie expires */
        expires:            31,
        /* sets secure cookie if protocol is https.  IE does things differently */
        secure:             (window.location.protocol == 'https' || document.location.protocol == 'https' ) ? true : false,
        /* stores value of 'rememberMe' in localStorage if supported */
        keepRememberMeState:true
    };
    
    _p3.remember_me_cookie = function(el, settings) {

        var config = $.extend(true, defaults, settings || {}),
        $form = $(el).is('form') ? $(el) : $('form:first', el),
        $rememberMe = $(config.rememberMeSelector, $form).first(),        
        $emailField = $(config.emailSelector, $form).first(),
        keepRememberMe = (config.keepRememberMeState && M.localstorage) ? true : false;
        
        $.cookie.defaults = { expires: config.expires, secure: config.secure };
        
        // Set the email field to the value of the cookie
        $emailField.val($.cookie(config.cookieName));
        
        // Monitor form submission, and store email field if 'rememberMe' is set
        $form.submit(function () {
            if ($rememberMe.is(':checked')) {
                $.cookie(config.cookieName, $emailField.val());
            } else {
                $.removeCookie(config.cookieName);
            }
            
            // Remember 'rememberMe' for the next form
            if (keepRememberMe) {                
                localStorage.rememberMeGP = $rememberMe.is(':checked') ? 'true' : 'false';
            }
            
        });
        
        // Set 'rememberMe' if the value is stored locally
        if (keepRememberMe && "undefined" !== localStorage.rememberMeGP) {
            $rememberMe.prop('checked', localStorage.rememberMeGP === 'true' ? true : false);                
        }
        
    };
    
    $.p3 = _p3;
    
    
}(jQuery, Modernizr));
