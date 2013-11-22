/**!
 * @name            p3.autofill.js
 * @fileOverview    Automatically fill form fields from GET parameters
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.5
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  $.p3.request
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

    _p3.autofill = function(el, options) {

        var $el = $(el),
            config = $.extend(true, defaults, options),
            url = w.location.href.split('#')[0];

        // Populate form fields from GET variables
        $.each($.p3.request(url).parameters, function(field, value) {
            if (value.indexOf(config.delimiter) > 0) {
                var $checkboxes = $(':checkbox[name="' + field + '"]', $el);
                $.each(value.split(config.delimiter), function(i, val) {
                    $checkboxes.filter('[value="' + val + '"]').prop('checked', true);
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