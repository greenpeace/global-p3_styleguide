/**!
 * Greenpeace Email-only Pledge signing version 0.1
 * 
 * @fileOverview Checks if visitor can sign in using only an email address
 *               Prompts for missing fields
 * @version 0.1
 * @author Ray Walker <hello@raywalker.it>
 * @example
 * $.p3.pledge_with_email_only('#action-form'[, options]);
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M) {
    'use strict';
    
    var _p3 = $.p3 || {},
    defaults = {
        emailField: '#UserEmail',
        identifyUserBy: 'email',                                                    /* Valid options are 'email', 'uuid' */
        userDataAttr: 'user',
        pageDataAttr: 'uuid',                                                     /* Valid options: 'uuid', 'id', 'name' */
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
        query = {
            user: '',
            page: $el.data(config.pageDataAttr) || config.pageUUID || config.pageID|| config.pageName,
            expiry: $el.data(config.expiryDataAttr) || config.expiry
        },       
        setPageIdentifier = function () {
            if (!query.page) {
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
            }
        },
        setExpiryDate = function () {
            if (!query.expiry) {
                console.log('WARNING: No expiry date set');
            }  
        },
        /**
         * @description Performs the json query against signer check endpoint
         * @returns {boolean} True if user can pledge using only email address
         */
        canSign = function() {
            $submit.prop('disabled','disabled').addClass('disabled');
            var parameters = {
                user: encodeURIComponent(query.user),
                page: query.page
            };
            
            $.ajaxSetup ({
                // Disable caching of AJAX responses
                cache: false
            });
            
            $.getJSON(config.jsonURL, parameters, function (response) {
                setTimeout( function () { $submit.removeProp('disabled').removeClass('disabled') }, 250);
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
            }).error(function (e) {
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
                            $field.append(messageText)
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