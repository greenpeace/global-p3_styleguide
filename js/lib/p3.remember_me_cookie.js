/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function c(a){if(e.raw)return a;try{return decodeURIComponent(a.replace(b," "))}catch(c){}}function d(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),a=c(a);try{return e.json?JSON.parse(a):a}catch(b){}}var b=/\+/g,e=a.cookie=function(b,f,g){if(void 0!==f){if(g=a.extend({},e.defaults,g),"number"==typeof g.expires){var h=g.expires,i=g.expires=new Date;i.setDate(i.getDate()+h)}return f=e.json?JSON.stringify(f):String(f),document.cookie=[e.raw?b:encodeURIComponent(b),"=",e.raw?f:encodeURIComponent(f),g.expires?"; expires="+g.expires.toUTCString():"",g.path?"; path="+g.path:"",g.domain?"; domain="+g.domain:"",g.secure?"; secure":""].join("")}for(var j=b?void 0:{},k=document.cookie?document.cookie.split("; "):[],l=0,m=k.length;m>l;l++){var n=k[l].split("="),o=c(n.shift()),p=n.join("=");if(b&&b===o){j=d(p);break}b||void 0===(p=d(p))||(j[o]=p)}return j};e.defaults={},a.removeCookie=function(b,c){return void 0!==a.cookie(b)?(a.cookie(b,"",a.extend({},c,{expires:-1})),!0):!1}});

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