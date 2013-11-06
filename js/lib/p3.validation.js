
/**!
 * @name            p3.validation.js
 *
 * @fileOverview    Wrapper over the jquery.validation.js plugin for Greenpeace
 *                  Action Template v03
 *                  Validates form data against XRegExp rules, optionally
 *                  obtained via remote API
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.2.6
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  <a href="http://xregexp.com/">XRegExp</a>
 *                  <a href="http://jqueryvalidation.org/">jQuery Validate</a>
 *                  $.p3.request
 * @example         $.p3.validation('#action-form'[, options]);
 *
 */
/* global jQuery, Modernizr, XRegExp */
(function($, M, w) {
    'use strict';

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
            alphaPlus: "^[\\p{L}\\p{N}\\.\\-\\'\\,\\/]+$",
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
        // Not implemented
        /* @todo Enable optional error summary area */
        showSummary: false,
        // Forbid form submission if there's an error receiving JSON or
        // when in parsing
        disableOnError: false,
        // Error element to use instead of jquery.validate default <label>
        errorElement: 'span',
        // Overrides jquery.validate default positioning
        errorPlacement: function(error, element) {
            var $el = $(element),
            name = $el.prop('name');
            $el.parents('.' + name).first().find('div.message').html(error);
        },
        // Query string parameters to include in validation request
        params: {},
        // Message container appended to each form field container
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
        // Merge request GET variables from all configuration sources: json > parameters > defaults
        query = {
            url: request.url,
            parameters: $.extend(true, request.parameters, config.params)
        },
        getVars = $.p3.request(w.location.href).parameters,
        $el = $(el),
        $form = $el.is('form') ? $el : $('form', el),
        messageDiv = config.messageElement,
        enableForm = function () {
            $(':input', $form).removeProp('disabled').removeClass('disabled');
        },
        disableForm = function () {
            $(':input', $form).prop('disabled', 'disabled').addClass('disabled');
        },
        /* the main action function, called after the getJSON completes */
        validate = function () {
            if (config.disableOnError) {
                disableForm();
            }

            if (config.showSummary) {
                console.warn('$.p3.validation.js :: showSummary not yet implemented');
                // Add the summary element
//                config.summaryElement = $('.errorSummary', el).length ? $('.errorSummary', el) : $(el).prepend('<div class="errorSummary"></div>');
            }

            // Add any custom tests
            $.each(config.tests, function(name, regexp) {
                // Don't trust the user entered config
                try {
                    // Create a new validator method
                    $.validator.addMethod(name, function(value, element) {
                        var reg = new XRegExp(regexp);
                        return this.optional(element) || reg.test(value);
                    });
                } catch (err) {
//                            console.log("Failed to add test '" + name + "' with regex '" + regexp + "'");
                }
            });

            // Add message div to required fields
            // if it doesn't already exist in template
            $(':input', $form).each(function() {
                var $this = $(this),
                name = $this.prop('name'),
                $parent = name ? $this.parents('.' + name).first() : false;
                if ($parent) {
                    if (!$parent.find('div.message').length) {
                        $parent.append(messageDiv);
                    }
                } else {
                    console.warn('$.p3.pledge_with_email_only :: "' + name + '" field parent not found');
                }
            });

            enableForm();

            // Initialise the jQuery.validate plugin
            $form.validate(config);

            // Submit the form if auto_sign is true
            if (config.autoSign || getVars.auto_sign == true) { // Yes i do mean == instead of === (allows either auto_sign=1 or auto_sign=true)

                if ($.p3.pledge_with_email_only) {
                    // trigger a submit click, instead of form submission event
                    // because there may be other events intercepting form submission
                    $('input[type=submit]', $form).click();
                } else {
                    $form.submit();
                }
            }
        };



        if (query.url) {
            // Only check for JSON browser object if we intend to use the
            // JSON endpoint, and if it appears to be a valid URL
            M.load({
                test: w.JSON,
                nope: [
                    'js/v03/lib/json.min.js'
                ],
                complete: function() {
                    // Fetch rules from remote service
                    $.getJSON(query.url, query.parameters, function(data) {
                        // Success, extend configuration with remote data
                        config = $.extend(true, config, data);
                    }).fail(function() {
                        // Failed to obtain JSON
                        console.warn('$.p3.validation :: WARNING :: JSON failed to load from: ' + config.jsonURL);

                        if (config.disableOnError) {
                            // Disable validation plugin if can't load JSON
                            disableForm();
                            throw new Error('$.p3.validation :: Form input disabled');
                        } else {
                            // Else try to continue with existing rules...
                            console.warn('$.p3.validation :: Attempting to continuing regardless...');
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