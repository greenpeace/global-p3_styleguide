// ** Built automatically in Grunt, do not edit **
'use strict';

// Source: src/js/lib/p3.autofill.js
/**!
 * @name            p3.autofill.js
 * @fileOverview    Automatically fill form fields from GET parameters
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.6
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  $.p3.request,
 *                  $.p3.selectors
 * @example         $.p3.autofill('#action-form');
 *
 */
/* global jQuery */
(function($, w) {
var _p3 = $.p3 || ($.p3 = {}),
        defaults = {
            // checkbox value delimiter
            delimiter: '|'
        };

    _p3.autofill = function(el, options) {

        var $el = $(el),
            config = $.extend(true, defaults, options),
            url = w.location.href.split('#')[0];

        // Populate form fields from GET variables
        $.each($.p3.request(url).parameters, function(field, value) {
            if (value.indexOf(config.delimiter) > 0) {
                var $checkboxes = $(':checkbox:nameNoCase("' + field + '")', $el);
                $.each(value.split(config.delimiter), function(i, val) {
                    $checkboxes.filter(':valueNoCase("' + val + '")').prop('checked', true);
                });
            } else {
                //
                $(':radio:nameNoCase("' + field + '")', $el).filter(':valueNoCase("' + value + '")').prop('checked', true);
                // :input matches all input, textarea, select and button
                $(':input:nameNoCase("' + field + '")', $el).val(value);
                // select options use value = fieldname
                $(':input:selectNoCase("' + field + '")', $el).val(value);
            }
        });
    };

}(jQuery, this));

// Source: src/js/lib/p3.console.js
/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 */
(function() {
    if (!window.console) {
        window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var m = [
        "log", "info", "warn", "error", "debug", "trace", "dir", "group",
        "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
        "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];

    function noop() {}

    // define undefined methods as noops to prevent errors
    for (var i = 0; i < m.length; i++) {
        if (!window.console[m[i]]) {
                window.console[m[i]] = noop;
        }
    }
})();

// Source: src/js/lib/p3.form_tracking.js
/**!
 * Track Form Abandonment through Google Analytics
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.3
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>,
 *                  Google Analytics tracking script
 * @example         $.p3.form_tracking('#action-form');
 */
/* global jQuery, _gaq */

(function($, w, d, undef) {
var _p3 = $.p3 || ($.p3 = {}),
        pre = '$.p3.form_tracking :: ',
        G = (typeof w._gaq === 'undefined') ? [] : w._gaq;

    _p3.form_tracking = function(el) {
        var $el = $(el),
            $input = $el.is(':input') ? $el : $(':input', $el),
            formName = $el.closest('form').attr('id') || d.title;

        // Check google analytics is defined
        if (!G.length) {
            console.warn(pre + 'Google Analytics not found');
        }

        // Found a form, so monitor
        $input.blur(function() {
            var $this = $(this),
            fieldName = $this.attr('name');

            // If this field has a name
            if (fieldName !== undef) {
                // And it has a value
                if ($input.val().length > 0) {
                    // Track an input event
                    G.push(['_trackEvent', formName, 'completed', fieldName]);
                } else {
                    // Or track a skip event
                    G.push(['_trackEvent', formName, 'skipped', fieldName]);
                }
            }
        });
    };

}(jQuery, this, document));


// Source: src/js/lib/p3.mobilesearchform.js
/**!
 * Moves the search form in the mobile menu (and back on desktop).
 *
 * @copyright       Copyright 2013
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1.0
 * @author          <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.5+</a>, window.matchMedia
 * @example         $.p3.mobilesearchform(pixel);
 */
/* global jQuery */

(function ( $, w ) {
    var _p3 = $.p3 || {};

    _p3.mobilesearchform = function( pixel ) {

        // default for our only option
        if (!pixel) {
            pixel = 768;
        }

        var px = parseInt(pixel, 10);

        // if window.matchMedia support
        if (typeof w.matchMedia !== 'undefined' && px) {
            var mq = w.matchMedia("(min-width: " + px + "px)");
            mq.addListener(moveSearchForm);
            moveSearchForm(mq);
        }

        // mobile menu: move the seach form into #main-nav (when it
        // becomes the mobile menu) and move it back when switching to
        // desktop
        // (works only on browsers with media queries)
        function moveSearchForm(mq) {
            var searchForm;

            if (mq.matches) {
                // move search form back into tools menu
                searchForm = $('#main-nav .search-form').detach();
                $('.heading-first .tools').append(searchForm);
            }
            else {
                // move search form into mobile menu
                searchForm =  $('.heading-first .tools .search-form').detach();
                $('#nav').before(searchForm);
            }
        }

    };

    $.p3 = _p3;

}( jQuery, this ));



// Source: src/js/lib/p3.narrow.js
/**!
 * Adds classes to an element (body by default) based on document width
 *
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.2
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>,
 *                  based on original work by
 *                  <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.1.4+</a>
 * @example         $.p3.narrow([options]);
 */
/* global jQuery */

(function($, w, d) {
var _p3 = $.p3 || {},
        defaults = {
            /* Selector or object to which the classes are added */
            el: 'body',
            /* Class names and their breakpoints */
            sizes: {
                threetwo:   320,
                four:       400,
                five:       500,
                six:        600,
                sixfive:    650,
                seven:      700,
                sevensome:  768,
                eightfive:  850,
                nine:       900,
                tablet:     480,
                desktop:    1024,
                wide:       1350,
                large:      1600
            },
            // Apply changes on resize
            onResize: true,
            // Apply changes on initialisation
            onLoad: true,
            // Throttle resize event timer in milliseconds
            delay: 100
        };

    _p3.narrow = function(options) {
        var config = $.extend(true, defaults, options || {}),
            $window = $(w),
            $el = $(config.el),
            wait = false;

        /**
         * Returns the size of the document plus scrollbars
         * @returns {int}
         */
        function getWidth() {
            if (typeof w.innerWidth === 'number') {
                // Non-IE
                return w.innerWidth;
            } else if (d.documentElement && d.documentElement.clientWidth) {
                // IE 6+ in 'standards compliant mode'
                return d.documentElement.clientWidth;
            }
        }

        /**
         * Assigns classes to the target element
         */
        function checkNarrow() {
            var classString = '',
                width = getWidth();

            // For each configured breakpoint
            $.each(config.sizes, function(cls, size) {
                // If the document is larger or equal to this size
                if (width >= size) {
                    // Add this classname to the element
                    classString += ' ' + cls;
                } else {
                    // Remove this class
                    $el.removeClass(cls);
                }
            });

            // Apply new classes
            $el.addClass(classString);
        }

        /**
         * Executes callback no more than once per interval
         *
         * @param {function}    callback
         * @param {int}         interval
         * @returns {undefined}
         */
        function throttle(callback, interval) {
            if (wait) {
                return;
            }

            wait = true;

            setTimeout(function() {
                wait = false;
            }, interval);

            callback();
        }

        if (config.onResize) {
            $window.resize(function() {
                throttle(checkNarrow, config.delay);
            });
        }

        if (config.onLoad) {
            $window.ready(checkNarrow);
        }
    };

    $.p3 = _p3;

}(jQuery, this, document));


// Source: src/js/lib/p3.pledge_counter.js
/**!
 *
 * @name            p3.pledge_counter.js
 * @fileOverview    Greenpeace Pledge Signing Counter for Action Template v0.3
 *                  Animated pledge percentage bar & text,
 *                  Can be event driven or directly invoked, which
 *                  enables reusing the JSON with another plugin (eg Recent Signers)
 * @version         0.3.4
 * @author          Ray Walker <hello@raywalker.it>
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  $.p3.request
 * @example         $.p3.counter('#action-counter'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M, window, document) {
var _p3 = $.p3 || {},
    defaults = {
        meterElement:       '.completed',               /* Selector for the bar to animated */
        meterWrapper:       '#action-counter-graphical',/* Selector for the bar wrap element */
        countElement:       '.count',                   /* Selector for the current count text to update (within the wrapper element) */
        totalElement:       '.total',                   /* Selector for the pledge total target text to update (within the wrapper element) */
        fetchFrequency:     30000,                      /* time to wait to fetch next value from server (in milliseconds) */
        updateSpeed:        25,                         /* this is the value update speed (in milliseconds). Change this value to make animation faster or slower */
        initialAnimationTotalDuration: 2500,            /* change this value to set the total duration of the first fetch animation (how many milliseconds takes
                                                           the progress bar from 0 to the current value */
        dataElement:        'body',                     /* Element where the pledge JSON is stored */
        dataNamespace:      'pledgeData',               /* Namespace to use for stored JSON - change this if using multiple counters per page */
        externalTrigger:    true,                       /* set to true to delay execution until externally triggered by event */
        fetchDataEvent:     'pledgeCounterFetch',       /* trigger this event to fetch JSON data from the endpoint */
        fetchCompleteEvent: 'fetchPledgeDataComplete',  /* trigger this event if you have fetched data externally and just want to parse and update display */
        jsonURL:            'https://secured.greenpeace.org/international/en/api/v2/pledges/',
        params:             {},                         /* object containing GET parameters to pass to p3.request */
        timeout:            30000,                       /* milliseconds to wait for API request */
        abortOnError:       false                       /* stop processing if there is an error */
    };

    _p3.pledge_counter = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
        $meter = $(config.meterElement, el),
        $count = $(config.countElement, el),
        $total = $(config.totalElement, el),
        paused = false,
        currentValue = 0,
        step = 0,
        progress = {
            count: 0,
            target: 0
        },
        request = $.p3.request(config.jsonURL),
        prefix = '$.p3.pledge_counter :: ',
        updateProgress = function () {
            if (paused) {
                // We're already updating, come back later
                setTimeout( function() {
                    updateProgress();
                }, config.fetchFrequency);
                return;
            }
            paused = true;

            var value = progress.count;

            if (value < currentValue) {
                currentValue = 0;
            }
            step = Math.ceil((value * config.updateSpeed) / config.initialAnimationTotalDuration, 0);
            if (step <= 0) {
                step = 1;
            }
            $count.text(addCommas(progress.count));
            $total.text(addCommas(progress.target));

            animateProgress();
        },
        animateProgress = function () {
//            console.log(progress.count + ' / ' + progress.target + ' step: ' + initialStep);

            if (currentValue >= +progress.count) {
                // Finished
                paused = false;
                // If we fetch from the API
                if (!config.externalTrigger) {
                    // Restart the process to check for live changes
                    setTimeout(fetchJSON, config.fetchFrequency);
                }
                return;
            }

            if (+(currentValue + step) < +progress.count){
                currentValue += +step;
            } else {
                currentValue = +progress.count;
            }

            var percent = currentValue / progress.target * 100;

            if (percent > 100) {
                percent = 100;
            }

            if (M.csstransforms) {
                $meter.css({
                    width: percent + '%'
                }).html(addCommas(currentValue) + '&nbsp;');
            } else {
                $meter.animate({
                    width: percent + '%'
                }, (config.updateSpeed - 5 >= 0) ? config.updateSpeed : 0, function () {
                    $meter.html(addCommas(currentValue) + '&nbsp;');
                });
            }

            setTimeout(animateProgress, config.updateSpeed);
        },
        addCommas = function (number) {
            var nStr = number + '',
            x = nStr.split('.'),
            x1 = x[0],
            x2 = x.length > 1 ? '.' + x[1] : '',
            rgx = /(\d+)(\d{3})/;

            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        parsePledgeData = function () {
            // read data from parameter or element
            var data = $(config.dataElement).data(config.dataNamespace);

            if (!data || data.status === 'error' || !data.pledges[0].action) {
                if (config.abortOnError) {
                    throw new Error(prefix + 'Errors in pledge data:', data);
                } else {
                    return;
                }
            }

            progress.count = data.pledges[0].action.count;
            progress.target = data.pledges[0].action.target;

            if (isNaN(progress.count) || isNaN(progress.target)) {
                // doesn't exist, or wrong format
                console.warn(prefix + 'Progress data not found or not valid, attempting to continue');
                return false;
            }

            $(config.meterWrapper).show();

            // Display results
            updateProgress();
        },
        fetchJSON = function () {
            var params = $.extend(true, request.parameters, config.params);

            // http://stackoverflow.com/questions/20565330/ajax-call-for-json-fails-in-ie
            $.support.cors = true;

            $.ajax({
                url: request.url,
                timeout: config.timeout,
                dataType: 'json',
                data: params
            }).success(function(json) {
                $(config.dataElement).data(config.dataNamespace, json);
            }).fail(function(e) {
                var message = prefix + 'Failed to load "' + request.url + '"';

                if (config.abortOnError) {
                    throw new Error(message, e);
                } else {
                    console.warn(message, e);
                }
            }).always(function() {
                $.event.trigger(config.fetchCompleteEvent);
            });
        };

        // initialise
        M.load({
            test: window.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: function() {
                if (M.csstransforms) {
                    $meter.css({"transition-duration": config.updateSpeed + "ms"});
                }

                // Event driven fetch and processing means we can decouple data
                // from this plugin, allowing us to reuse the data without
                // performing multiple requests
                $(document).on(config.fetchDataEvent, function() {
                    fetchJSON();
                });

                $(document).on(config.fetchCompleteEvent, function() {
                    parsePledgeData();
                });

                // Trigger listen event unless configured to listen externally
                if (config.externalTrigger === false) {
                    $.event.trigger(config.fetchDataEvent);
                }

            }
        });

    };

    // Overwrite p3 namespace if no errors
    $.p3 = _p3;

}(jQuery, Modernizr, this, document));

// Source: src/js/lib/p3.pledge_with_email_only.js
/**!
 * Greenpeace Email-only Pledge Signing for Action Template v0.3
 * @name            p3.pledge_with_email_only.js
 * @fileOverview    Checks if visitor can sign in using only an email address
 *                  Prompts for missing fields
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.4.2
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
(function($, M, global, undef) {
var _p3 = $.p3 || {},
        defaults = {
            /* Selector for the email input field */
            emailField: '#UserEmail',
            /* Valid options: 'email', 'uuid' (uuid not yet implemented) */
            identifyUserBy: 'email',
            /* Selector for the registration fields */
            registrationFields: '#action-form-register',
            /* Selector(s) for the fields we DO NOT want to hide */
            exceptionFields: '#action-form-message, #action-smallprints',
            /* Endpoint URL to check if the user can sign using only email address */
            signerCheckURL: 'https://secured.greenpeace.org/international/en/api/v2/pledges/signercheck/',
            /* Use p3.validation plugin to validate the form */
            validateForm: true,
            /* Endpoint for form validation rules, passed to $.p3.validation */
            validationRulesURL: 'https://secured.greenpeace.org/international/en/api/v2/pledges/validation/',
            /* Duration to animate the display of hidden missing fields
             * Set to 0 to disable */
            animationDuration: 350,
            /* Disable form input if an error occurs */
            disableOnError: false,
            /* GET variables to be added to both the signer check and form validation requests */
            params: {},
            showSummary: false,
            messageElement: '<div class="message"></div>',
            debug: false
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
            $form,
            $emailField = $(config.emailField),
            $submit,
            originalSubmit,
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
                if (query.parameters.page === undef && query.parameters.action === undef) {
                    throw new Error(prefix + 'Page or Action identifier not found');
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
                        throw new Error(prefix + 'uuid not implemented');
                    default:
                        throw new Error(prefix + 'config.identifyUserBy: ' + config.identifyUserBy + ' invalid');
                }

                return query.parameters.user;
            },
            /**
             * Shows a console warning if the expiry parameter is not set
             */
            setExpiryDate = function() {
                if (query.parameters.expire === undef) {
                    console.warn(prefix + 'No expiry date set');
                }
            },
            disableSubmit = function () {
                // Disable form input until we've obtained signer check status
                $submit.prop('disabled', true).addClass('disabled').prop('value', 'Please wait...');
            },
            enableSubmit = function () {
                $submit.removeClass('disabled').removeProp('disabled').prop('value', originalSubmit);
            },
            /**
             * Performs the json query against signer check endpoint
             * @returns     {boolean} True if user can pledge using only email address, false if not
             */
            checkEmail = function(hash) {
                var deferred = $.Deferred();

                checkedUserEmails[hash] = {
                    checked: false,
                    valid: false
                };

                $.getJSON(query.url, query.parameters, function(response) {
                    // Mark this email as having been tested against the endpoint
                    checkedUserEmails[hash].checked = true;

                    if (response.status === 'success') {
                        // User can sign using email only
                        checkedUserEmails[hash].valid = true;

                        deferred.resolve();

                    } else {
                        // This user cannot sign with email only

                        // Error handling
                        switch (response.error.code) {
                            case 1:
                                throw new Error(prefix + 'Invalid Key');
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                                // Errors 1 through 5 indicate an invalid page
                                console.error(response.error);
                                throw new Error(prefix + 'Invalid parameters: ', query.parameters);
                                // Errors 6 through 12 are not relevant to this operation

                            case 13:
                                // This user has already signed this pledge
                                var $emailContainer = $emailField.parents('.email:first'),
                                    $message = $('.message', $emailContainer);

                                if (!$message.length) {
                                    // Message container doesn't exist, so add it
                                    $emailContainer.append(config.messageElement);
                                    $message = $('.message', $emailContainer);
                                }

                                checkedUserEmails[hash].valid = false;

                                $message.append('<span class="error" for="' + $emailField.attr('id') + '">' + response.error.message + '</span>');
                                $emailField.addClass('error');
                                break;

                            case 15:
                                // User does not exist
                                $('.first-time', $form).show(config.animationDuration);
                                checkedUserEmails[hash].valid = true;
                                showAllFormFields();
                                break;

                            case 16:
                                // User exists, but is missing required fields
                                checkedUserEmails[hash].valid = true;
                                $('.first-time', $form).html('<p>Welcome back!<br/>We just need a little more information for this pledge</p>').show(config.animationDuration);
                                showMissingFields(response.user);
                                break;

                            default:
                                // Haven't actually checked this email after all
                                console.warn('Unhandled error code: ' + response.error.code, response.error);

                                checkedUserEmails[hash].checked = false;
                        }

                        deferred.reject();
                    }

                }).fail(function() {
                    if (!config.disableOnError) {
                        console.warn(prefix + 'Failed to load JSON, all form inputs re-enabled');
                        showAllFormFields();
                        $submit.removeClass('disabled');
                    } else {
                        throw new Error('$.p3.pledge_with_email_only.js :: Signer API request failed');
                    }

                    deferred.reject();
                });

                return deferred.promise();
            },
            /* Executes the email-specific form submission event */
            submitForm = function(status) {
                if (status && config.debug) {
                    console.log(prefix + status);
                }
                $form.submit();

            },
            /**
             * @param   {obj} fields JSON response.user property
             */
            showMissingFields = function(fields) {
//            console.log(prefix + 'showMissingFields');
                $.each(fields, function(label, val) {
                    var $field = $('div:classNoCase("' + label + '")', $form),
                        $input = $(':input', $field);

                    if ($input.length) {
                        // API returns { field: false } on missing fields
                        if (val === false) {

                            // Enable field
                            $input.removeProp('disabled');

                            // Display the field
                            $field.show(config.animationDuration);
                        } else {
                            $input.prop('disabled', true);
                            $input[0].disabled = true;

                        }
                    } else {
                        console.warn(prefix + '' + label + ' not found');
                    }


                });
            },
            /* Hides all form fields except email,
             * also resets invalid state */
            hideFormFields = function() {
                $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').hide().find(':input').removeClass('error').prop('disabled', 'disabled');
            },
            /* Shows all form fields */
            showAllFormFields = function() {
                $(config.registrationFields + ' > :not(' + config.exceptionFields + ', #action-submit-full)').show(config.animationDuration).find(':input').removeProp('disabled');
            },
            /* Main application chunk, executed once Modernizr is satisfied */
            init = function() {
                // Hide unwanted form elements
                hideFormFields();

                setPageIdentifier();
                setExpiryDate();

                $submit.click(function(e) {

                    if ($submit.hasClass('disabled')) {
                        console.log(prefix + 'Submit is disabled');
                        return false;
                    }

                    disableSubmit();

                    // Initialise user parameter with email form field
                    var user = setUserIdentifier();

                    if (!user) {
                        console.warn(prefix + 'No email specified');
                        hideFormFields();
                        submitForm();
                        enableSubmit();
                        return false;
                    }

                    if (checkedUserEmails[user] && checkedUserEmails[user].checked) {
                        if (checkedUserEmails[user].valid) {
                            submitForm(prefix + 'Resubmit valid email address');
                        } else {
                            setTimeout(function() {
                                $emailField.parent().find('.error').show(config.animationDuration);
                            }, config.animationDuration);
                        }
                        enableSubmit();
                    } else {
                        // Haven't checked this email, so prevent form submission
                        e.preventDefault();

                        // Hide any form fields that may have been shown as
                        // a result of a previous signer_check
                        hideFormFields();

                        // Check if this looks like a valid email address
                        if ($emailField.valid()) {

                            // Test the API for this email
                            $.when(checkEmail(user)).then(function() {
                                // This user can submit via email only
                                submitForm('Can submit via email only, pledging ...');
                            }, function() {
                                // Fail, so re-enable form submit
                                enableSubmit();
                            });

                        } else {
                            // Not a valid email address, so pass through
                            // to jquery.validation plugin
                            submitForm(prefix + "Doesn't look like a valid email address");

                            // And re-enable submission for retry attempts
                            enableSubmit();
                        }
                    }

                });

                if (config.validateForm) {
                    // Initialise validation plugin
                    $.p3.validation($form, {
                        jsonURL: config.validationRulesURL,
                        params: query.parameters,
                        debug: true,
                        showSummary: config.showSummary,
                        disableOnError: config.disableOnError
                    });
                }

                // Intercept form submission on regular form fields by the enter key
                $(':input[type!=submit]', $form).keypress(function(e) {
                    if (e.which === 13) {
                        var $this = $(this);

                        if ($this.is('textarea')) {
                            return true;
                        }

                        e.preventDefault();
                        $submit.focus().click();
                        return false;

                    }
                });

            };

        // Fix for strange form structure
        if ($el.is('form')) {
            $form = $el;
        } else if ($('form', el).length) {
            $form = $('form', el);
        } else {
            $form = $('form').first();
        }

        if (!$form) {
            throw new Error(prefix + 'form not found');
        }

        $submit = $('input[type=submit][value!=search]', $form);

        originalSubmit = $submit.prop('value');

        M.load({
            test: global.JSON,
            nope: [
                'js/compat/json.min.js'
            ],
            complete: init
        });

        $.p3 = _p3;
    };

}(jQuery, Modernizr, this));


// Source: src/js/lib/p3.recent_signers.js
/**!
 * Animated Recent Signers for Greenpeace Action Template v0.3
 * @name            p3.recent_signers.js
 * @fileOverview    Displays the most recent pledge signers, queued and
 *                  animated
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.3.2
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.recent_signers('#action-recent-signers'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */

(function($, M, window, document) {
var _p3 = $.p3 || {},
        defaults = {
            jsonURL: 'https://secured.greenpeace.org/international/en/api/v2/pledges/',
            /* parameters to be added to the request url */
            params: {},
            /* Force UTC timezone if no time zone data is returned */
            mangleTime: true,
            /* selects which element holds the time data attribute */
            timeSelector: '.since',
            /* selects which attribute contains timestamps */
            timeDataAttr: 'data-since',
            /* selector for the country dropdown to map country codes to names
             * set to false to force sourcing information from JSON instead */
            countrySelector: '#UserCountry',
            /* source country information from a JSON file */
            countryJSON: 'json/countries/countries_en.json',
            /* set to true to delay execution until externally triggered by event */
            externalTrigger: false,
            /* element to store returned pledge data */
            dataElement: 'body',
            /* name of data object to store pledge data */
            dataNamespace: 'pledgeData',
            /* trigger this event to fetch JSON data from the endpoint */
            fetchDataEvent: 'recentSignersFetch',
            /* trigger this event if you have fetched data externally and just
             * want to parse and update display */
            fetchCompleteEvent: 'fetchPledgeDataComplete',
            /* delay in milliseconds between signer check updates */
            updateInterval: 30000,
            /* interval between users added to the recent signer list from last
             * update */
            userQueueInterval: 750,
            /* maximum number of users to display at once, excess users are hidden
             * and then removed from the DOM */
            maxUsers: 5,
            /* number of times to check the server for new signers after the first
             * set to 0 to disable updates */
            maxRefreshes: 30,
            /* milliseconds to wait for the API request */
            timeout: 30000,
            /* stop processing if there is an error */
            abortOnError: false
        };

    $.timeago.settings.strings = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "%d seconds",
        minute: "a minute",
        minutes: "%d minutes",
        hour: "an hour",
        hours: "%d hours",
        day: "a day",
        days: "%d days",
        month: "a month",
        months: "%d months",
        year: "a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
    };

    _p3.recent_signers = function(el, options) {
        var config = $.extend(true, defaults, options),
            $el = $(el),
            $ul = false,
            request = $.p3.request(config.jsonURL),
            users = [],
            countries = [],
            timer = false,
            refreshNum = 0,
            prefix = '$.p3.recent_signers :: ',
            pledgeQueue = {
                running: false,
                delay: config.userQueueInterval,
                actions: [],
                step: function() {
                    if (pledgeQueue.actions.length) {
                        try {
                            pledgeQueue.actions.pop()();
                        } catch (e) {
                            console.error(e);
                        }
                    } else {
                        pledgeQueue.running = false;
                    }
                },
                run: function() {
                    pledgeQueue.running = true;
                    if (pledgeQueue.actions.length) {
                        pledgeQueue.step();
                        setTimeout(pledgeQueue.run, pledgeQueue.delay);
                    } else {
                        pledgeQueue.running = false;
                    }
                }
            },
            fetchJSON = function() {
                if (pledgeQueue.running) {
                    // Still executing last update, restart timer
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fetchJSON();
                    }, config.updateInterval);
                    // and exit
                    return false;
                }

                var params = $.extend(true, request.parameters, config.params);

                // http://stackoverflow.com/questions/20565330/ajax-call-for-json-fails-in-ie
                $.support.cors = true;

                $.ajax({
                    url: request.url,
                    timeout: config.timeout,
                    dataType: 'json',
                    data: params
                }).success(function(json) {
                    $(config.dataElement).data(config.dataNamespace, json);
                }).fail(function(e1) {
                    var message = prefix + 'Failed to load "' + request.url + '"';

                    if (config.abortOnError) {
                        throw new Error(message, e1);
                    }
                }).always(function() {
                    $.event.trigger(config.fetchCompleteEvent);
                });
            },
            parsePledgeData = function() {
                var jsonData = $(config.dataElement).data(config.dataNamespace);

                // Add fetch first, since array is popped not shifted,
                // because we're adding pledges from oldest to newest, but the
                // data is sorted newest to oldest
                if (!config.externalTrigger && refreshNum++ < config.maxRefreshes) {
                    pledgeQueue.actions.push(function() {
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            $.event.trigger(config.fetchDataEvent);
                        }, config.updateInterval);
                    });
                }

                if (!jsonData || jsonData.status === 'error') {
                    if (config.abortOnError) {
                        throw new Error(prefix + 'JSON data invalid');
                    } else {
                        // Trigger next fetch and stop parsing
                        pledgeQueue.run();
                        return;
                    }
                }

                $.each(jsonData.pledges, function(i, pledge) {

                    if (users[pledge.user.id]) {
                        // Already added, exit $.each
                        return false;
                    } else {
                        // Store this ID
                        users[pledge.user.id] = true;
                    }

                    if (pledge.user.dont_display_name === true) {
                        // Skip to next pledge ...
                        console.warn(prefix + 'pledge.user.dont_display_name is true');
                        return true;
                    }

                    pledgeQueue.actions.push(function() {
                        // Enqueue this user
                        showUser(pledge);
                    });

                });

                // Update existing timestamps
                pledgeQueue.actions.push(function() {
                    updateTimeStamps();
                });

                // Show all pledges in the queue
                pledgeQueue.run();

            },

            /**
             * Retrieves human readable time string from timestamp
             * Forces UTC if no timezone identifier is found
             * @param {string} timestamp
             * @returns {string}
             */
            getTimeString = function(time) {
                if (time) {
                    var t = $.trim(time);
                    if (config.mangleTime) {
                        // Assume timezone is UTC if trimmed string includes a space
                        if (t.match(/\s/)) {
                            // Convert to ISO8601 standard timestamp
                            t = t.replace(/\s/, 'T') + 'Z';
                        }
                    }
                    return $.timeago(t);
                }
            },
            parseCountryData = function() {
                var deferred = $.Deferred(),
                    size = 0;

                if (config.countrySelector) {
                    // Parse the country element for code => name pairs
                    $.each($(config.countrySelector + ' option'), function (i, option) {

                        var $option = $(option),
                            val = $option.val();

                        if (val) {
                            // Force uppercase (not lowercase)
                            countries[val.toUpperCase()] = $option.text();
                            size++;
                        }
                    });

                    if (size > 0) {
                        // Happy with that.
                        deferred.resolve();
                        return deferred.promise();
                    } else {
                        // No countries found in the selector element
                        console.warn(prefix + 'No countries found in ' + config.countrySelector);
                        if (config.abortOnError) {
                            // Exit here with a failure
                            deferred.reject('Aborting', countries);
                            return deferred.promise();
                        }
                        // Continue with an attempt to read the country data from JSON
                    }
                }

                if (config.countryJSON) {
                    // fetch JSON country data
                    $.ajax({
                        url: config.countryJSON,
                        timeout: config.timeout,
                        dataType: 'json'
                    }).success( function(data) {
                        countries = data;
                        deferred.resolve();
                    }).fail(function (e) {
                        deferred.reject('Error fetching JSON from ' + config.countryJSON, e);
                    });
                }

                return deferred.promise();
            },
            getCountryString = function(country) {
                var string = countries.hasOwnProperty(country.toUpperCase()) ? countries[country.toUpperCase()] : false;

                if (string) {
                    return string;
                } else {
                    console.error(prefix + 'Country not found for code ' + country);
                    return country;
                }
            },
            showUser = function(pledge) {
                var user = pledge.user,
                    timestamp = pledge.created,
                    timeCreated = getTimeString(timestamp),
                    country = user.country,
                    countryString = getCountryString(user.country),
                    firstname = user.firstname || '',
                    lastname = user.lastname || '',
                    $li = $('<li style="display:none"> </li>');

                $li.append('<span class="since" data-since="' + timestamp + '">' + timeCreated + '</span>')
                    .append('<span class="icon flag ' + country + '"></span>')
                    .append('<span class="name">' + firstname + ' ' + lastname + '</span>')
                    .append(' <span class="country">' + countryString + '</span>');

                // Add to DOM
                $ul.prepend($li);

                // And show
                $li.show(350);

                // Remove any excess users
                if (config.maxUsers && $('li', $ul).length > config.maxUsers) {
                    $('li:last', $ul).hide(350, function () {
                        this.remove();
                    });
                }
            },
            updateTimeStamps = function() {
                $(config.timeSelector, $ul).each(function() {
                    var $this = $(this);
                    $this.text(getTimeString($this.attr(config.timeDataAttr)));
                });
            };

        // initialise and run

        if (config.updateInterval < 5000) {
            // Update interval sanity check
            config.updateInterval = 5000;
        }

        $ul = $('ul:first', $el);
        if (!$ul.length) {
            $ul = $('<ul></ul>');
            $el.append($ul);
        }

        M.load({
            test: window.JSON,
            nope: [
                'js/compat/json.min.js'
            ],
            complete: function() {
                // parseCountryData() may rely on an AJAX call,
                // so we defer processing the rest of the application
                var promise = parseCountryData();

                promise.done(function () {
                    // Successfuly parsed Countries, we can now register events

                    // Apply human readable string to existing timestamps
                    updateTimeStamps();

                    // Event driven fetch and processing means we can decouple data
                    // from this plugin, allowing us to reuse the data without
                    // performing multiple requests

                    $(document).on(config.fetchDataEvent, function() {
                        fetchJSON();
                    });

                    $(document).on(config.fetchCompleteEvent, function() {
                        parsePledgeData();
                    });

                    // Trigger listen event unless configured to listen externally
                    if (!config.externalTrigger) {
                        $.event.trigger(config.fetchDataEvent);
                    }
                });

                promise.fail(function(message, error) {
                    // An error occurred parsing the countries list
                    console.error(message, error);
                });
            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this, document));


// Source: src/js/lib/p3.remember_me_cookie.js
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
        secure:             (window.location.protocol === 'https' || document.location.protocol === 'https' ) ? true : false,
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


// Source: src/js/lib/p3.request.js
/**!
 * $.p3.request
 *
 * Query string parser, returns the url and an object
 * containing the GET parameters in key: value format
 *
 * Required in most $.p3 libraries
 *
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @requires        <a href="http://jquery.com/">jQuery</a>
 * @usage           $.p3.request('http://fish.com?type=salmon');
 * @version         0.1
 * @param           {string} url jQuery
 * @returns         {object} { url: 'http://fish.com', parameters: { type: 'salmon' } }
 */
(function($) {
var _p3 = $.p3 || {};

    _p3.request = function(url) {
        var request = {
          url: false,
          parameters: false
        },
        parts = [],
        getRequestParams = function() {
            var params = {};

            if (parts[1]) {
                parts[1].split(/[&;]/g).forEach(function (param) {
                    var q = param.split(/\=/);
                    if (q.length > 1 && q[0].length && q[1].length) {
                        params[q[0]] = q[1];
                    }
                });
            }
            return params;
        },
        getRequestURL = function() {
            return (parts[0].length) ? parts[0] : url;
        };

        if (url) {
          parts = url.split('?');
        } else {
          return request;
        }

        request.url = getRequestURL();
        request.parameters = getRequestParams();

        return request;
    };

    $.p3 = _p3;

}(jQuery));



// Source: src/js/lib/p3.selectors.js
/**!
 * @name            p3.selectors.js
 * @fileOverview    Selection of utility selectors for use in p3 plugins
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.1
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>
 */
/* global jQuery */

(function ($) {
    $.expr[':'].classNoCase = function(a, i, m) {
        var cls = $(a).attr('class'),
            search = m[3];
        if (!search || !cls) {
            return false;
        }
        return cls.toUpperCase().indexOf(search.toUpperCase()) >= 0;
    };

    $.expr[':'].nameNoCase = function(a, i, m) {
        var name = $(a).attr('name'),
            search = m[3];
        if (!search || !name) {
            return false;
        }
        return name.toUpperCase().indexOf(search.toUpperCase()) >= 0;
    };

    $.expr[':'].selectNoCase = function(a, i, m) {
        var v = $('option', a).val() || '',
            search = m[3];
        if (!search || !v.length) {
            return false;
        }
        return v.toUpperCase().indexOf(search.toUpperCase()) >= 0;
    };

    $.expr[':'].valueNoCase = function(a, i, m) {
        var v = $(a).val() || '',
            search = m[3];
        if (!search || !v.length) {
            return false;
        }
        return v.toUpperCase().indexOf(search.toUpperCase()) >= 0;
    };
}(jQuery));

// Source: src/js/lib/p3.social_sharing.js
/**!
 * Social Private Sharing for Greenpeace Action Template v0.3
 *
 * @name            p3.social_sharing.js
 * @fileOverview    Enables social sharing without compromising privacy,
 *                  Obtains share counts from JSON endpoint
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.2.0
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.social_sharing('#action-social-share'[, options]);
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global jQuery, Modernizr */

(function($, M, w) {
var _p3 = $.p3 || {},
        prefix = ' :: $.p3.social_sharing :: ',
        defaults = {
            pageURL: false,
            popup: {
                top: 200,
                left: 100,
                width: 650,
                height: 380
            },
            networks: {
                facebook: {
                    enabled: true,
                    url: 'http://www.facebook.com/sharer.php?u=__REFERRER__',
                    count: 0
                },
                twitter: {
                    enabled: true,
                    url: 'https://twitter.com/intent/tweet?original_referer=__REFERRER__&source=tweetbutton&text=__TITLE__&url=__REFERRER__&via=__ACCOUNT__',
                    count: 0,
                    title: false,
                    account: 'greenpeace'
                },
                google: {
                    enabled: true,
                    url: 'https://plus.google.com/share?url=__REFERRER__',
                    count: 0
                },
                linkedin: {
                    enabled: true,
                    url: 'https://www.linkedin.com/cws/share?url=__REFERRER__&original_referer=__REFERRER__',
                    count: 0
                },
                pinterest: {
                    enabled: true,
                    url: 'http://pinterest.com/pin/create/button/?url=__REFERRER__&media=__IMAGE__&description=__DESCRIPTION__',
                    count: 0,
                    image: false,
                    description: false
                }
            },
            precision: 1,
            api: 'https://www.greenpeace.org/api/p3/pledge/social.json'
        };

    _p3.social_sharing = function(el, options) {

        var config  = $.extend(true, defaults, options || {}),
            $el     = $(el);

        function addCommas(int) {
            var nStr = int + '',
                x = nStr.split('.'),
                x1 = x[0],
                x2 = (x.length > 1 && (x[1] * 1.0) > 0 && int < 100) ? '.' + x[1].replace(/0+$/, "") : '',
                rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        function humanise(int) {

            int = int * 1.0;

            // Smaller than 10k doesn't overflow container
            if (int < 10000) {
                return addCommas(int);
            }

            var ordinals = ["", "K", "M", "G", "T", "P", "E"],
                n = int,
                ord = 0;

            while (n > 1000) {
                n /= 1000;
                ord++;
            }

            return addCommas((n.toFixed(config.precision)) * 1.0) + ordinals[ord];
        }

        function init() {

            if (config.pageURL === false) {
                console.warn(prefix + 'page referrer URL is not set, using "' + w.location.href + '"');
                config.pageURL = w.location.href;
            }

            $.each(config.networks, function(network, data) {
                if (data.enabled !== false) {
                    var $a = $('a.' + network, $el),
                        $counter = $('span', $a.prev()) || false,
                        url = data.url;

                    switch (network) {
                        case 'pinterest':
                            if (data.image === false) {
//                            throw new Error('Pinterest sharing requires an image');
                                console.warn(prefix + 'Pinterest sharing requires an image.');
                                data.image = '';
                            }
                            if (data.description === false) {
//                                throw new Error('Pinterest sharing requires a description');
                                console.warn(prefix + 'Pinterest sharing requires a description.');
                                data.description = document.title;
                            }
                            url = url.replace('__IMAGE__', encodeURIComponent(data.image));
                            url = url.replace('__DESCRIPTION__', encodeURIComponent(data.description));
                            break;
                        case 'twitter':
                            if (data.title === false) {
//                                throw new Error('Twitter sharing requires a title');
                                console.warn(prefix + 'Twitter sharing requires a title.');
                                data.title = document.title;
                            }
                            url = url.replace('__TITLE__', encodeURIComponent(data.title));
                            url = url.replace('__ACCOUNT__', encodeURIComponent(data.account));
                            break;
                        default:
                            break;
                    }

                    url = url.replace(/__REFERRER__/g, encodeURIComponent(config.pageURL));

                    $a.attr({
                        href: url,
                        target: '_blank'
                    }).click(function(e) {

                        e.preventDefault();

                        w.open(url, 'Share this page', 'left=' + config.popup.left + ',top=' + config.popup.top + ',width=' + config.popup.width + ',height=' + config.popup.height + ',toolbar=0,resizable=1');

                    });

                    // Set counter to humanised number
                    if ($counter) {
                        $counter.text(humanise(data.count));
                    }
                } // else { console.log(network + ' disabled'); }
            });

        }

        if (config.api) {
            // load data from JSON endpoint
            M.load({
                test: w.JSON,
                nope: [
                    'dist/js/compat/json.min.js'
                ],
                complete: function() {
                    $.getJSON(config.api, function(json) {
                        $.extend(true, config, json);

                        if (json.status === 'success') {
                            init();
                        } else {
                            console.warn(json);
                            throw new Error(prefix + 'Status: ' + json.status + ': server reported a problem');
                        }

                    }).fail(function() {
                        throw new Error(prefix + 'Failed to load JSON: "' + config.api + '"');
                    });

                }
            });
        } else {
            // Just parse what we've got
            init();
        }


    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));


// Source: src/js/lib/p3.validation.js

/**!
 * @name            p3.validation.js
 *
 * @fileOverview    Wrapper over the jquery.validation.js plugin for Greenpeace
 *                  Action Template v03
 *                  Validates form data against XRegExp rules, optionally
 *                  obtained via remote API
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.4.0
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="http://xregexp.com/">XRegExp</a>,
 *                  <a href="http://jqueryvalidation.org/">jQuery Validate</a>,
 *                  $.p3.request,
 *                  $.p3.selectors
 * @example         $.p3.validation('#action-form'[, options]);
 *
 */
/* global jQuery, Modernizr, XRegExp */
(function($, M, w) {
var _p3 = $.p3 || {}, // Extends existing $.p3 namespace
    defaults = {
        /* the API endpoint to obtain configuration and rules from
         * set to false to disable remote API call and only use initialisation
         * parameters
         */
        jsonURL: 'https://www.greenpeace.org/api/p3/pledges',
        /* Add default validation rules here */
        rules: {},
        /* Add custom regular expressions to use in rules here
         * see also: http://xregexp.com/
         * and: http://xregexp.com/plugins/#unicode
         */
        tests: {
            // Matches all unicode alphanumeric characters, including accents
            // plus . , - ' /
            // Note for end users: when overriding or creating tests,
            // character strings must be double escaped: \\ instead of \
            // http://stackoverflow.com/questions/16572123/javascript-regex-invalid-range-in-character-class
            alphaPlus: "^[\\p{L}\\p{N}\\.\\-\\'\\,\\’\\s\\/]+$",
            numeric: "^\\p{N}+$",
            alpha: "^\\p{L}+$",
            // Match a url with or without www.
            // http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
            url: "^((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)$"
        },
        /* attempt to submit the form automatically */
        autoSign: false,
        /* validate the form each time a field loses focus */
        onfocusout: false,
        /* validate the form each time keyup is received when a field has focus */
        onkeyup: false,
        /* Show errors in a catch-all container instead of per-field */
        showSummary: false,
        /* Selector for the summary field */
        summarySelector: '.errorSummary',
        /* Error summary container */
        summaryElement: '<div class="errorSummary message"></div>',
        /* Forbid form submission if there's an error receiving JSON or
         * when in parsing */
        disableOnError: false,
        /* Error element to use instead of jquery.validate default <label> */
        errorElement: 'span',
        /* Overrides jquery.validate default positioning */
        errorPlacement: function(error, element) {
            var $el = $(element),
            name = $el.prop('name').toUpperCase();
            $el.parents(':classNoCase(' + name + ')').find('div.message').html(error);
        },
        /* Query string parameters to include in validation request */
        params: {},
        /* Duration of animation effects, set to 0 to disable */
        animationDuration: 250,
        /* Message container appended to each form field container */
        messageElement: '<div class="message"></div>'
    };

    // Adds validation rule where field value must not equal parameter, eg
    // rules: { fish: { valueNotEquals: 'salmon' } }
    $.validator.addMethod("valueNotEquals", function(value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");

    _p3.validation = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
        request = $.p3.request(config.jsonURL),
        query = {
            url: request.url,
            // Merge request GET variables from all configuration sources: json > parameters > defaults
            parameters: $.extend(true, request.parameters, config.params)
        },
        getVars = $.p3.request(w.location.href).parameters,
        $el = $(el),
        $form,
        messageDiv = config.messageElement,
        prefix = '$.p3.validation.js :: ',
        enableForm = function () {
            $(':input', $form).removeProp('disabled').removeClass('disabled');
        },
        disableForm = function () {
            $(':input', $form).prop('disabled', 'disabled').addClass('disabled');
        },
        /* the main action function, called after the API request completes */
        validate = function () {
            // Store configuration for reference by validation plugin handlers
//            $form.data('config',config);

            if (config.disableOnError) {
                disableForm();
            }

            if (config.showSummary) {
                // Add the summary element if it doesn't already exist
                if (!$(config.summarySelector, $el).length) {
                    $el.prepend(config.summaryElement);
                }

                var $summaryElement = $(config.summarySelector).first();

                // Disable errorPlacement handler
                config.errorPlacement = function () {};

                // Configure validation error handler to display one message only
                config.invalidHandler = function(e, validator) {
                    var errors = validator.numberOfInvalids(),
                        message;

                        if (errors === 1) {
                            message = 'Oops, there was a problem on 1 field.<br/>It has been highlighted below';
                        } else {
                            message = 'Oops, there was a problem on ' + errors + ' fields.<br/>They have been highlighted below';
                        }

                        setTimeout(function () {
                            $summaryElement.html('<span class="error">' + message + '</span>');
                            $summaryElement.show(config.animationDuration);
                        },100);
//                        $('body').animate({'scrollTop': $form.offset().offsetTop + 500 }, config.animationDuration);
                };

                // Hide the summary element when the form is validated again
                $(':input[type=submit]',$form).on('click', function () {
                    $summaryElement.hide().html('');
                });

            }

            // Add any custom tests
            $.each(config.tests, function(name, regexp) {
                // Don't trust the user entered config
                try {
                    // Create a new validator method
                    $.validator.addMethod(name, function(value, element) {
                        var reg = new XRegExp(regexp, 'i');
                        return this.optional(element) || reg.test(value);
                    });
                } catch (e) {
                    console.warn(prefix + "Failed to add test '" + name + "' with regex '" + regexp + "'");
                    console.warn(e);
                }
            });

            // Add message div to required fields
            // if it doesn't already exist in template
            $(':input', $form).each(function() {
                var $this = $(this),
                name = $this.prop('name'),
                $parent = name ? $this.parents(':classNoCase(' + name + ')').first() : false;
                if ($parent) {
                    if (!$parent.find('div.message').length) {
                        $parent.append(messageDiv);
                    }
                } else {
                    if (!$this.is('[type=submit]')) {
                        console.warn(prefix + '"' + name + '" field parent not found');
                    }
                }
            });

            enableForm();

            // Initialise the jQuery.validate plugin
            $form.validate(config);

            // Submit the form if auto_sign is true
            if (config.autoSign || getVars.auto_sign === 'true' || getVars.auto_sign === '1') {

                if ($.p3.pledge_with_email_only) {
                    // trigger a submit click, instead of form submission event
                    // because there may be other events intercepting form submission
                    $('input[type=submit][value!=search]', $form).click();
                } else {
                    $form.submit();
                }
            }
        };

        // Fix for strange form structure
        if ($el.is('form')) {
            $form = $el;
        } else if ($('form', el).length) {
            $form = $('form', el);
        } else {
            $form = $('form').first();
        }

        if (!$form) {
            throw new Error(prefix + 'form not found');
        }


        if (query.url) {
            // Only check for JSON browser object if we intend to use the
            // JSON endpoint, and if it appears to be a valid URL
            M.load({
                test: w.JSON,
                nope: [
                    'js/compat/json.min.js'
                ],
                complete: function() {
                    // http://stackoverflow.com/questions/20565330/ajax-call-for-json-fails-in-ie
                    $.support.cors = true;

                    // Fetch rules from remote service
                    $.getJSON(query.url, query.parameters, function(data) {
                        // Success, extend configuration with remote data
                        config = $.extend(true, config, data);
                    }).fail(function() {
                        // Failed to obtain JSON
                        console.warn(prefix + 'JSON failed to load from: ' + config.jsonURL);

                        if (config.disableOnError) {
                            // Disable validation plugin if can't load JSON
                            disableForm();
                            throw new Error(prefix + 'Form input disabled');
                        } else {
                            // Else try to continue with existing rules...
                            console.warn(prefix + 'Attempting to continuing regardless...');
                        }
                    }).complete( function () {
                        // Perform validation
                        validate();
                    });
                }
            });
        } else {
            // Perform validation using existing rules
            validate();
        }
    };

    // Overwrite previous namespaced object
    $.p3 = _p3;

}(jQuery, Modernizr, this));
