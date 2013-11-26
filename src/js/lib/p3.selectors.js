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