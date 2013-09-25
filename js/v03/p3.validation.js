/**!
 * p3.validation.js
 * 
 * @fileOverview Wrapper over the jquery.validation.js plugin for Greenpeace 
 *               Action Template v03.
 *               Validates form data against XRegExp rules obtained via JSON endpoint
 * @author      <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version     0.1
 * @copyright	Copyright 2013, Greenpeace International
 * @license	MIT License (opensource.org/licenses/MIT)
 * @requires    <a href="http://jquery.com/">jQuery 1.7+</a>,
 *              <a href="http://modernizr.com/">Modernizr</a>,
 *              <a href="http://xregexp.com/">XRegExp</a>
 *              <a href="http://jqueryvalidation.org/">jQuery Validate</a>
 * @example     $.p3.validation('#action-form'[, options]);
 * 
 */
/* global Modernizr, XRegExp */
(function($) {
    'use strict';
    
    var _p3 = $.p3 || {}, // Extends existing $.p3 namespace
    defaults = {
        jsonURL: 'https://www.greenpeace.org/api/p3/pledge/config.json',        
        tests: {
            // Matches all unicode alphanumeric characters, including accents
            // plus . , - ' / 
            // Note for end users: when overriding or creating tests,
            // character strings must be double escaped: \\ instead of \
            // http://stackoverflow.com/questions/16572123/javascript-regex-invalid-range-in-character-class
            alphaPlus: "^[\\p{L}\\p{N}\\.\\-\\'\\,\\/]+$",
            numeric: "^\\p{N}+$",
            alpha: "^\\p{L}+$"
        },   
       // Not implemented
        showSummary: false,
        // Enable HTML5 fallback if the JSON query fails
        fallbackHTML5: true,
        // Error element to use instead of jquery.validate default <label>
        errorElement: 'span',
        // Overrides jquery.validate default positioning
        errorPlacement: function (error, element) {
            $(element).parent().find('div.message').html(error);
        }
    };
    
    _p3.validation = function(el, options) {

        var config = $.extend(true, defaults, options || {});
        
        if (config.showSummary) {
            config.summaryElement = $('.errorSummary',el).length ? $('.errorSummary',el) : $(el).prepend('<div class="errorSummary"></div>');
        }
        
        Modernizr.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                $.getJSON(config.jsonURL, function(data) {
                    var messageDiv = '<div class="message"></div>',                    
                    $el = $(el),
                    $form = $el.is('form') ? $el : $('form',el);
                    
                    $.extend(true, config, data || {});
                    // Foreach data.tests ...
                    $.each(config.tests, function (name, regexp) {
                        // Don't trust the user entered data
                        try {
                            // Create a new validator method
                            $.validator.addMethod(name, function(value, element) {
//                                console.log('Testing '+value+' against '+regexp);
                                var reg = new XRegExp(regexp);
                                return this.optional(element) || reg.test(value);
                            });     
//                            console.log("Added test '" +name + "': '" + regexp + "'");
                        } catch(err) {
//                            console.log("Failed to add test '" + name + "' with regex '" + regexp + "'");
                        }
                                                
                    });
                    
                    // Add message div to required fields
                    // if it doesn't already exist in template
                    $form.find('div.input.required').each( function () {
                        var $this = $(this);

                        if (!$this.find('div.message').length) {
                            $this.append(messageDiv);
                        }
                        
                    });                   
                    // And finally go ahead and validate the form
                    $form.validate(config);

                }).error(function() {
                    // Failed to obtain JSON, fallback to html5 validation
                    console.log('WARNING: JSON failed to load from: ' + config.jsonURL);
                    if (config.fallbackHTML5) {
                        console.log('WARNING: Using native HTML5 validation');
                    } else {                        
                        $('input[type=submit]',el).attr('disabled','disabled').addClass('disabled');
                        throw new Error('Form input disabled');
                    }
                });
            }
        });
    };
    
    // Overwrite previous namespaced object
    $.p3 = _p3;

}(jQuery));