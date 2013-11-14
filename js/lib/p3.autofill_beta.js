/**!
 * @name            p3.autofill.js
 *                  Case insensitive fields?
 * @fileOverview    Automatically fill form fields from GET parameters
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.4 beta
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

    var _p3 = $.p3 || {},
        defaults = {
            // checkbox field value delimiter
            delimiter:  '|'
        };


    $.expr[':'].nameNoCase = function(a, i, m){
         return $(a).prop('name').toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
    $.expr[':'].selectNoCase = function(a, i, m){
         return $('option', a).prop('value').toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
    $.expr[':'].valueNoCase = function(a, i, m){
         return $(a).val().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    _p3.autofill = function(el, options) {

        var $el = $(el),
            config = $.extend(true, defaults, options),
            url = w.location.href.split('#')[0];

        // Populate form fields from GET variables
        $.each($.p3.request(url).parameters, function(field, value) {
            if (value.indexOf(config.delimiter) > 0) {
                var $checkboxes = $(':checkbox[name="' + field + '"]', $el);
                $.each(value.split(config.delimiter), function (i, val) {
                    $checkboxes.filter('[value="' + val + '"]').prop('checked', true);
                });
            } else {
                //
                $(':radio[name="' + field + '"]', $el).filter('[value="' + value + '"]').prop('checked', true);
                // :input matches all input, textarea, select and button
                $(':input[name="' + field + '"]', $el).val(value);
                // select options use value = fieldname
                $(':input[value="' + field + '"]', $el).val(value);
            }

        });
    };

    $.p3 = _p3;

}(jQuery, this));