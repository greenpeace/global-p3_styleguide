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
    'use strict';

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