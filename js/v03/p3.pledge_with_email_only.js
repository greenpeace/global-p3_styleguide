/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 * 
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="https://github.com/greenpeace/client-code-styleguide/blob/master/js/v03/p3.validation.js">p3.validation.js</a>
 * @example         $.p3.pledge_with_email_only('#action-form'[, options]);
 * 
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M) {
    'use strict';
    
    var _p3 = $.p3 || {},
    defaults = {
        /* Selector for the email input field */
        emailField: '#UserEmail',
        /* Valid options: 'email', 'uuid' (uuid not yet implemented) */
        identifyUserBy: 'email',
        /* Data attribute for user identifier (unused) */
        userDataAttr: 'user',
        /* Data attribute for action page identifier.
         * Valid options: 'uuid', 'id', 'name' */
        pageDataAttr: 'uuid',                                                     
        expiryDataAttr: 'expiry',
        registrationFields: '#action-form-register',                               
        exceptionFields: '#action-form-message, #action-smallprints',
        signerCheckURL: 'https://www.greenpeace.org/api/public/pledges/signercheck.json',
        validationRulesURL: 'https://www.greenpeace.org/api/p3/pledge/config.json',
        animationDuration: 350,
        fallbackHTML5: false
    };
    
    _p3.pledge_with_email_only = function(el, options) {
        var config = $.extend(true, defaults, options || {}),
        $el = $(el),
        $form = ($el.is('form')) ? $el : $('form', $el),
        $emailField = $(config.emailField),
        $submit = $('input[type=submit]',$form),
        checkSigner = true,
        getParameter = function (url, parameter) {
            var urlparts = url.split('?');   /* prefer to use l.search if you have a location/link object */
            if (urlparts.length >= 2) {
                var prefix = encodeURIComponent(parameter) + '=',
                parts = urlparts[1].split(/[&;]/g);
                for (var i = 0; ++i < parts.length; )  {  
                    if (parts[i].lastIndexOf(prefix, 0) !== -1) {
                        return parts[i].replace(prefix,'');
                    }
                }
            }
        },
        removeParameter = function (url, parameter) {
            var urlparts = url.split('?');   /* prefer to use l.search if you have a location/link object */
            if (urlparts.length >= 2) {
                var prefix = encodeURIComponent(parameter) + '=',
                parts = urlparts[1].split(/[&;]/g);
                // reverse iteration as may be destructive
                for (var i = parts.length; i-- > 0; )  {             
                    // idiom for string.startsWith
                    if (parts[i].lastIndexOf(prefix, 0) !== -1)     {
                        parts.splice(i, 1);
                    }
                }
                url = urlparts[0];
                if (parts.length) {
                    url = url + '?' + parts.join('&');
                }
            }            
            return url;
        },        
        query = {
            user: '',
            page: getParameter(config.signerCheckURL, 'page') || $el.data(config.pageDataAttr) || config.pageUUID || config.pageID|| config.pageName || '',
            expiry: getParameter(config.signerCheckURL, 'expiry') || $el.data(config.expiryDataAttr) || config.expiry || ''
        },
        setPageIdentifier = function () {
            config.signerCheckURL = removeParameter(config.signerCheckURL,'user');
            
            if (query.page === '') {
                throw new Error('Page identifier not found');
            }            
        },
        setUserIdentifier = function () {
            switch (config.identifyUserBy) {
            case 'email':
                query.user = $emailField.val();
                break;
            case 'uuid':
                throw new Error('uuid not implemented');
            default:
                throw new Error('config.identifyUserBy: ' + config.identifyUserBy + ' invalid');
            }
        },
        setExpiryDate = function () {
            config.signerCheckURL = removeParameter(config.signerCheckURL,'expiry');
            if (query.expiry === '') {
                console.log('WARNING: No expiry date set');
            }
        },
        /**
         * @description Performs the json query against signer check endpoint
         * @returns     {boolean} True if user can pledge using only email address
         */
        canSign = function() {
            $submit.prop('disabled','disabled').addClass('disabled');
                        
            $.each(query, function () {
                if (this.length) {
                    encodeURIComponent(this);
                }                
            });                        
            
            $.getJSON(config.signerCheckURL, query, function (response) {
                setTimeout(function() {
                    $submit.removeProp('disabled').removeClass('disabled');
                }, 250);
                if (response.status === 'success') {
                    return true;
                } else if (response.errors.pledge) {
                    /* @todo Already signed: show explanatory information */
                    alert('Already signed!');
                    return false;
                } else {
                    checkSigner = false;
                    showMissingFields(response);
                    return false;
                }
            }).error(function () {
                throw new Error('Signer API request failed');
            });
        },
        showMissingFields = function (response) {
            var messageText = $('<div class="message"></div>');
            $.each(response.errors, function (type, fields) {
                switch (type) {
                case 'user':
                    $(config.registrationFields).prepend('<div class="message"></div>');
                    $.each(fields, function (label, errorText) {
                        var $field =  $('.' + label,$form),
                        $message = $('.message', $field),
                        $input = $('input', $field);

                        if (!$message.length) {
                            $field.append(messageText);
                            $message = $('.message', $field);
                        }
                        $message.html('<span class="error" for="'+$input.attr('id')+'">' + errorText + '</span>');
                        $input.removeProp('disabled');
                        $field.show(config.animationDuration);
                    });
                    break;
                case 'pledge':
                    console.log('Pledge already signed!');
                    break;
                default:
                    throw new Error('Unhandled error type: ' + type);
                }
            });
        },
        init = function() {
            // Hide unwanted form elements
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find('input').prop('disabled','disabled');
            
            setPageIdentifier();
            setExpiryDate();

            // Initialise validation plugin
            $.p3.validation($form, {
                jsonURL: config.validationRulesURL,
                submitHandler: function (form) {
                    setUserIdentifier();
                    
                    if (checkSigner) {
                        // Valid email address
                        return canSign();
                    } else {
                        form.submit();
                    }       
                },
                fallbackHTML5: config.fallbackHTML5
            }); 
        };

        M.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                init();
            }
        });
        
        $.p3 = _p3;
    };
    
}(jQuery,Modernizr));