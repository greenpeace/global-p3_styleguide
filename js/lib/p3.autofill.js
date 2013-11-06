
/**!
 * @name            p3.autofill.js
 *
 * @fileOverview    Automatically fill form fields from GET parameters
 * @author          <a href="mailto:hello@raywalker.it">Ray Walker</a>
 * @version         0.0.2
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

    var _p3 = $.p3 || {};

    _p3.autofill = function(el) {

        var $el = $(el);

        // Populate form fields from GET variables
        $.each($.p3.request(w.location.href).parameters, function(field, value) {
            value = value.replace('#','');
            $(':radio[name="' + field + '"]', $el).filter('[value="' + value + '"]').prop('checked', true);
            $(':input[name="' + field + '"]', $el).val(value);
            $(':input[value="' + field + '"]', $el).val(value);
        });
    };

    $.p3 = _p3;

}(jQuery, this));