/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 *
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.2
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="https://github.com/greenpeace/client-code-styleguide/blob/master/js/v03/p3.validation.js">p3.validation.js</a>
 *                  p3.request.js
 * @example         $.p3.pledge_with_email_only('#action-form' [, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M, undef) {
    'use strict';

    var _p3 = $.p3 || {},
            defaults = {
                /* Selector for the email input field */
                emailField:             '#UserEmail',
                /* Valid options: 'email', 'uuid' (uuid not yet implemented) */
                identifyUserBy:         'email',
                /* Selector for the registration fields */
                registrationFields:     '#action-form-register',
                /* Selector(s) for the fields we DO NOT want to hide */
                exceptionFields:        '#action-form-message, #action-smallprints',
                /* Endpoint URL to check if the user can sign using only email address */
                signerCheckURL:         'https://www.greenpeace.org/api/public/pledges/signercheck.json',
                /* Endpoint for form validation rules, passed to $.p3.validation */
                validationRulesURL:     'https://www.greenpeace.org/api/p3/pledge/config.json',
                /* Duration to animate the display of hidden missing fields
                 * Set to 0 to disable */
                animationDuration:      350,
                /* Enable basic HTML5 form validation if the json URL request fails */
                fallbackHTML5:          false,
                /* GET variables to be added to both the signer check and form validation requests */
                params:                 {},
                messageElement:         '<div class="message"></div>'
            };

    _p3.pledge_with_email_only = function(el, options) {
        var config = $.extend(true, defaults, options || {}),
        $el = $(el),
        $form = ($el.is('form')) ? $el : $('form', $el),
        $emailField = $(config.emailField),
        $submit = $('input[type=submit]', $form),
        checkSigner = true,
        request = $.p3.request(config.signerCheckURL),
        query = {
            url: request.url,
            parameters: $.extend(true, request.parameters, config.params)
        },
        /**
         * Ensures the page identifier is set, throws an error if not defined
         */
        setPageIdentifier = function() {
            if (query.parameters.page === undef) {
                throw new Error('Page identifier not found');
            }
        },
        /**
         * Loads user identifier from the appropriate place
         */
        setUserIdentifier = function() {
            switch (config.identifyUserBy) {
                case 'email':
                    query.parameters.user = $emailField.val();
                    break;
                case 'uuid':
                    throw new Error('uuid not implemented');
                default:
                    throw new Error('config.identifyUserBy: ' + config.identifyUserBy + ' invalid');
            }
        },
        /**
         * Shows a console warning if the expiry parameter is not set
         */
        setExpiryDate = function() {
            if (query.parameters.expiry === undef) {
                console.log('WARNING: No expiry date set');
            }
        },
        /**
         * Performs the json query against signer check endpoint
         * @returns     {boolean} True if user can pledge using only email address, false if not
         */
        canSign = function() {
            // Disable form input until we've obtained signer check status
            $submit.prop('disabled', 'disabled').addClass('disabled');

            $.getJSON(query.url, query.parameters, function(response) {
                // Re-enable form input
                setTimeout(function() {
                    $submit.removeProp('disabled').removeClass('disabled');
                }, 250);
                if (response.status === 'success') {
                    /* User can sign using email only */
                    return true;
                } else if (response.errors.pledge) {
                    /* Display pledge error message */
                    var $emailContainer = $emailField.parents('.input.email:first'),
                            $messageField = $('.message', $emailContainer);

                    if (!$messageField.length) {
                        $emailContainer.append(config.messageElement);
                        $messageField = $('.message', $emailContainer);
                    }
                    $messageField.append('<span class="error" for="' + $emailField.attr('id') + '">' + response.errors.pledge.unique + '</span>');
                    $emailField.addClass('error');
                    return false;
                } else {
                    /* User must fill out additional fields */
                    checkSigner = false;
                    showMissingFields(response);
                    return false;
                }
            }).error(function() {
                throw new Error('Signer API request failed');
            });
        },
        /**
         *
         * @param {type} response
         * @returns {undefined}
         */
        showMissingFields = function(response) {
            var messageText = $(config.messageElement);

            $.each(response.errors, function(type, fields) {
                switch (type) {
                    case 'user':
                        $(config.registrationFields).prepend(config.messageElement);
                        $.each(fields, function(label, errorText) {
                            var $field = $('.' + label, $form),
                            $message = $('.message', $field),
                            $input = $('input', $field);

                            if (!$message.length) {
                                $field.append(messageText);
                                $message = $('.message', $field);
                            }
                            // Show error message
                            $message.html('<span class="error" for="' + $input.attr('id') + '">' + errorText + '</span>');
                            // Enable field
                            $input.addClass('error').removeProp('disabled');
                            // Add error class to parent field and display the field
                            $field.addClass('error').show(config.animationDuration);
                        });
                        // Focus first error field
                        $('.input.error:first input').focus();
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
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find('input').prop('disabled', 'disabled');

            setPageIdentifier();
            setExpiryDate();

            // Initialise validation plugin
            $.p3.validation($form, {
                jsonURL: config.validationRulesURL,
                params: query.parameters,
                submitHandler: function(form) {
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

}(jQuery, Modernizr));