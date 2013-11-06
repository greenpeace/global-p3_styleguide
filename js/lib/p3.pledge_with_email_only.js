/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 *
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.3.1
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

    // lightweight, fast hash
    // https://code.google.com/p/tiny-sha1/downloads/detail?name=tinySHA1.r4.js&can=2&q=
    function SHA1(s){function U(a,b,c){while(0<c--)a.push(b)}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i++){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j++){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))))}

    _p3.pledge_with_email_only = function(el, options) {
        var config = $.extend(true, defaults, options || {}),
        $el = $(el),
        $form = ($el.is('form')) ? $el : $('form', $el),
        $emailField = $(config.emailField),
        $submit = $('input[type=submit]', $form),
        // Keep track of emails we've tested against the signer check endpoint
        checkedUserEmails = [],
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
                    query.parameters.email = $emailField.val();
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
                console.warn('$.p3.pledge_with_email_only :: No expiry date set');
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
                    console.log('$.p3.pledge_with_email_only :: signercheck API response success');

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
                            throw new Error('$.p3.pledge_with_email_only :: Invalid page: '+ query.parameters.page);
                            break;
                            // Errors 6 through 12 are not relevant to this operation
                        case 13:
                            // This user has already signed this pledge
                            console.log('$.p3.pledge_with_email_only :: User has already signed this pledge');
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
                            console.log('$.p3.pledge_with_email_only :: New user, show all fields');
                            showAllFormFields();
                            break;
                        case 16:
                            // User exists, but is missing required fields
                            console.warn('$.p3.pledge_with_email_only :: User exists, but is missing fields');
                            showMissingFields(response.user);
                            break;
                        default:
                            console.warn('Unhandled error code: ' + error.code);
                        }
                    });
                }

            }).fail(function() {
                if (!config.disableOnError) {
                    console.warn('$.p3.pledge_with_email_only :: Failed to load JSON, all form inputs re-enabled');
                    showAllFormFields();
                    $submit.removeProp('disabled').removeClass('disabled');
                } else {
                    throw new Error('$.p3.pledge_with_email_only.js :: Signer API request failed');
                }
            });
        },
        submitForm = function (hash) {
//            console.log('Submitting form with hash ' + hash);
            $(window).trigger('submit_' + hash);
        },
        /**
         * @param   {obj} JSON response.user property
         */
        showMissingFields = function(fields) {
            console.log('$.p3.pledge_with_email_only :: showMissingFields');
            $.each(fields, function(label) {
                if (fields[label] === false) {
                    var $field = $('div.'+label, $form),
                    $input = $(':input', $field);

                    if ($input) {
                        // Enable field
                        $input.removeProp('disabled');

                        // Display the field
                        $field.show(config.animationDuration);
                    } else {
                        console.warn('$.p3.pledge_with_email_only :: ' + label + ' not found');
                    }
                }

            });
        },
        hideFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find(':input').prop('disabled', 'disabled');
        },
        showAllFormFields = function () {
            $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').show(config.animationDuration).find(':input').removeProp('disabled');
        },
        init = function() {
            // Hide unwanted form elements
            hideFormFields();

            setPageIdentifier();
            setExpiryDate();

            // Intercept form submission by the enter key
            $(':input', $form).keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    $(this).blur();
                    $submit.focus().click();
                    return false;
                }
            });

            $submit.click( function (e) {
                // Initialise user parameter with email form field
                setUserIdentifier();

                if (query.parameters.user) {
                    // Generate a unique email identifier
                    var hash = SHA1(query.parameters.user);

                    if (checkedUserEmails[hash] && checkedUserEmails[hash].checked) {
//                        console.log('Already tested this email');
                        $(window).trigger('submit_' + hash);
                    } else {
//                        console.log('Haven\'t tested this email yet...');
                        // Haven't checked this email, so prevent form submission
                        e.preventDefault();

                        // listen for successful API check
                        $(window).on('submit_' + hash, function () {
                            // submit the form
                            $form.submit();
                        });

                        // test the API for this email
                        checkEmail(hash);
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
                    disableOnError: config.disableOnError,
                    submitHandler: function (f) {
                        if ($form.valid()) {
                            f.submit();
                            return true;
                        }
                    }
                });
            }

        };


        M.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: init
        });

        $.p3 = _p3;
    };

}(jQuery, Modernizr));