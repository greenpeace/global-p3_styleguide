/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 * @name            p3.pledge_with_email_only.js
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.3.6
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="https://github.com/greenpeace/client-code-styleguide/blob/master/js/v03/p3.validation.js">p3.validation.js</a>
 *                  p3.request.js,
 *                  p3.selectors.js
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
        /* Use p3.validation plugin to validate the form */
        validateForm:           true,
        /* Endpoint for form validation rules, passed to $.p3.validation */
        validationRulesURL:     'https://www.greenpeace.org/api/p3/pledge/config.json',
        /* Duration to animate the display of hidden missing fields
         * Set to 0 to disable */
        animationDuration:      350,
        /* Disable form input if an error occurs */
        disableOnError:         false,
        /* GET variables to be added to both the signer check and form validation requests */
        params:                 {},
        showSummary:            false,
        messageElement:         '<div class="message"></div>'
    };

    // Custom selector to match country codes to country names
    $.expr[":"].p3_empty = function(el) {
        var $el = $(el);
        if ($el.attr('name') === undef) {
            return false;
        }
        return $el.val() === '';
    };

    _p3.pledge_with_email_only = function(el, options) {
        var config = $.extend(true, defaults, options || {}),
        $el = $(el),
        $form = ($el.is('form')) ? $el : $('form', $el),
        $emailField = $(config.emailField),
        $submit = $('input[type=submit]', $form),
        // Keep track of emails we've tested against the signer check endpoint
        checkedUserEmails = [],
        request = $.p3.request(config.signerCheckURL),
        prefix = '$.p3.pledge_with_email_only :: ',
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
            if (query.parameters.expire === undef) {
                console.warn(prefix + 'No expiry date set');
            }
        },
        /**
         * Performs the json query against signer check endpoint
         * @returns     {boolean} True if user can pledge using only email address, false if not
         */
        checkEmail = function(hash) {

            // Disable form input until we've obtained signer check status
            $submit.prop('disabled', 'disabled').addClass('disabled');

            checkedUserEmails[hash] = {
                checked: false
            };

            $.getJSON(query.url, query.parameters, function(response) {
                // Mark this email as having been tested against the endpoint
                checkedUserEmails[hash].checked = true;

                // Re-enable form submit
                $submit.removeProp('disabled').removeClass('disabled');

                if (response.status === 'success') {
                    // User can sign using email only
                    console.log(prefix + 'signercheck API response success');

                    // Hide and disable unnecessary fields, in case they were
                    // previously displayed for a different email
                    hideFormFields();

                    // and then submit the form
                    submitForm(hash);
                } else {
                    // This user cannot sign with email only

                    // Error handling
                    $.each(response.errors, function (i, error) {
                        switch (error.code) {
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            // Errors 1 through 5 indicate an invalid page
                            throw new Error(prefix + 'Invalid page: '+ query.parameters.page);
                            // Errors 6 through 12 are not relevant to this operation
                        case 13:
                            // This user has already signed this pledge
                            console.log(prefix + 'User has already signed this pledge');
                            var $emailContainer = $emailField.parents('.email:first'),
                            $message = $('.message', $emailContainer);

                            if (!$message.length) {
                                // Message container doesn't exist, so add it
                                $emailContainer.append(config.messageElement);
                                $message = $('.message', $emailContainer);
                            }
                            $message.append('<span class="error" for="' + $emailField.attr('id') + '">' + error.pledge.unique + '</span>');
                            $emailField.addClass('error');
                            break;
                        case 15:
                            // User does not exist
                            console.log(prefix + 'New user, show all fields');
                            $('.first-time', $form).show(config.animationDuration);
                            showAllFormFields();
                            break;
                        case 16:
                            // User exists, but is missing required fields
                            console.warn(prefix + 'User exists, but is missing fields');
                            $('.first-time', $form).html('<p>Welcome back!<br/>We just need a little more information for this pledge</p>').show(config.animationDuration);
                            showMissingFields(response.user);
                            break;
                        default:
                            console.warn('Unhandled error code: ' + error.code);
                        }
                    });
                }

            }).fail(function() {
                if (!config.disableOnError) {
                    console.warn(prefix + 'Failed to load JSON, all form inputs re-enabled');
                    showAllFormFields();
                    $submit.removeProp('disabled').removeClass('disabled');
                } else {
                    throw new Error('$.p3.pledge_with_email_only.js :: Signer API request failed');
                }
            });
        },
        /* Executes the email-specific form submission event */
        submitForm = function (hash) {
//            console.log('Submitting form with hash ' + hash);
            $(window).trigger('submit_' + hash);
        },
        /**
         * @param   {obj} JSON response.user property
         */
        showMissingFields = function(fields) {
            console.log(prefix + 'showMissingFields');
            $.each(fields, function(label) {
                if (fields[label] === false) {
                    var $field = $('div:classNoCase("' + label + '")', $form),
                    $input = $(':input', $field);

                    if ($input) {
                        // Enable field
                        $input.removeProp('disabled');

                        // Display the field
                        $field.show(config.animationDuration);
                    } else {
                        console.warn(prefix + '' + label + ' not found');
                    }
                }

            });
        },
        /* Hides all form fields except email,
         * also resets invalid state */
        hideFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find(':input').removeClass('error').prop('disabled', 'disabled');
        },
        /* Shows all form fields */
        showAllFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').show(config.animationDuration).find(':input').removeProp('disabled');
        },
        /* Main application chunk, executed once Modernizr is satisfied */
        init = function() {
            // Hide unwanted form elements
            hideFormFields();

            setPageIdentifier();
            setExpiryDate();

            // Intercept form submission on regular fields by the enter key
            $(':input[type!=submit]', $form).keypress(function (e) {
                if (e.which === 13) {
                    var $this = $(this);

                    if ($this.is('textarea')) {
                        return true;
                    } else  {
                        e.preventDefault();
                        $(this).blur();
                        $submit.focus().click();
                        return false;
                    }

                }
            });

            $submit.click( function (e) {
                // Initialise user parameter with email form field
                setUserIdentifier();

                if (query.parameters.user) {

                    if (checkedUserEmails[query.parameters.user] && checkedUserEmails[query.parameters.user].checked) {
//                        console.log('Already tested this email');
                        $(window).trigger('submit_' + query.parameters.user);
                    } else {
//                        console.log('Haven\'t tested this email yet...');
                        // Haven't checked this email, so prevent form submission
                        e.preventDefault();

                        hideFormFields();

                        if ($emailField.valid()) {
                            // listen for successful API check
                            $(window).on('submit_' + query.parameters.user, function () {
                                // submit the form
                                $form.submit();
                            });

                            // test the API for this email
                            checkEmail(query.parameters.user);
                        } else {
                            $form.submit();
                        }
                    }
                } else {
                    // Skip the theatrics if there's no email address
                    $form.submit();
                }

            });

            if (config.validateForm) {
                // Initialise validation plugin
                $.p3.validation($form, {
                    jsonURL: config.validationRulesURL,
                    params: query.parameters,
                    debug:true,
                    showSummary: config.showSummary,
                    disableOnError: config.disableOnError
                });
            }

        };
        console.log(typeof M);

        M.load({
            test: window.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: init
        });

        $.p3 = _p3;
    };

}(jQuery, Modernizr));
