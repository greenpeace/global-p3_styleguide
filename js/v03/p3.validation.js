/**!
 * @name p3.Validation
 * @fileOverview Validates form data agains XRegExp rules obtained remotely
 * @author <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version 0.1
 * @example
 * $.p3.counter('#action-form'[, options]);
 */
/* global Modernizr, XRegExp */
(function($) {
    'use strict';
    
    var _p3 = $.p3 || {},
    defaults = {
        jsonURL: 'https://www.greenpeace.org/api/p3/pledge/config.json',
        showSummary: true,
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
        errorElement: 'span',
        errorPlacement: function (error, element) {
            $(element).parent().find('div.message').html(error);
        }        
    };
    
    _p3.validation = function(el, config) {

        config = $.extend(true, defaults, config || {});
        
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
                    $el = $(el);
                    
                    $.extend(true, config, data || {});

                    // Foreach data.tests ...
                    $.each(config.tests, function (name, regexp) {
                        // Don't trust the user entered data
                        try {
                            // Create a new validator method
                            $.validator.addMethod(name, function(value, element) {
                                console.log('Testing '+value+' against '+regexp);
                                var reg = new XRegExp(regexp);
                                return this.optional(element) || reg.test(value);
                            });     
                            console.log("Added test '" +name + "': '" + regexp + "'");
                        } catch(err) {
//                            console.log("Failed to add test '" + name + "' with regex '" + regexp + "'");
                        }
                                                
                    });
                    
                    // Add message div to required fields
                    // if it doesn't already exist in template
                    $el.find('div.input.required').each( function () {
                        var $this = $(this);

                        if (!$this.find('div.message').length) {
                            $this.append(messageDiv);
                        }
                        
                    });                   
                        
                    // And finally go ahead and validate the form
                    $el.validate(config);

                }).error(function() {
                    // Failed to obtain JSON, fallback to html5 validation
                    console.log('JSON failed to load: ' + config.jsonURL);

                    //$('input[type=submit]',el).attr('disabled','disabled').addClass('disabled');
                });
            }
        });
    };
    
    // Overwrite previous namespaced object
    $.p3 = _p3;

}(jQuery));