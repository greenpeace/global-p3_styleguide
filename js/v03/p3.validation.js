// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'];
    var l = methods.length;
    var console = (window.console = window.console || {});

    while (l--) {
        method = methods[l];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Validation plugin 0.1
;
(function($) {
    var _p3 = $.p3 || {},
    defaults = {
        jsonURL: 'https://www.greenpeace.org/api/p3/pledge/config.json',
        tests: {
            // Matches all alphanumeric characters, including accents plus . , - ' / 
            // Note for end users: when overriding or creating tests,
            // character strings must be doulbe escaped: \\ instead of \
            // http://stackoverflow.com/questions/16572123/javascript-regex-invalid-range-in-character-class
            alphaPlus: /^[A-Za-z\u00C0-\u017F\d\.\-\'\,\/]*$/,
            numeric: /^[\d]*$/,
            alpha: /^[\w]*$/
        }
    }

    _p3.validation = function(el, config) {

        config = $.extend(true, defaults, config || {});

        Modernizr.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                $.getJSON(config.jsonURL, function(data) {
                    
                    $.extend(true, config, data || {});

                    // Foreach data.tests ...
                    $.each(config.tests, function (name, regexp) {
                        // Don't trust the user entered data
                        try {
                            // Create a new validator method
                            $.validator.addMethod(name, function(value, element) {
//                                console.log('Testing '+value+' against '+regexp);
                                var reg = new RegExp(regexp);
                                return this.optional(element) || reg.test(value);
                            });     
//                            console.log("Added test '" +name + "': '" + regexp + "'");
                        } catch(err) {
//                            console.log("Failed to add test '" + name + "' with regex '" + regexp + "'");
                        }
                                                
                    });
                    
                    $(el).validate(config);

                }).error(function() {
                    // Failed to obtain JSON, fallback to html5 validation
                    console.log('JSON failed to load: ' + config.jsonURL);

                    //$('input[type=submit]',el).attr('disabled','disabled').addClass('disabled');
                });
            }
        });
    }
    
    // Overwrite previous namespaced object
    $.p3 = _p3;

}(jQuery));