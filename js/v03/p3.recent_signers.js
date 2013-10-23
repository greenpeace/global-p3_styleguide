/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "1 day ago").
 *
 * @name timeago
 * @version 1.3.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function d(){var c=e(this),d=b.settings;return isNaN(c.datetime)||(0==d.cutoff||g(c.datetime)<d.cutoff)&&a(this).text(f(c.datetime)),this}function e(c){if(c=a(c),!c.data("timeago")){c.data("timeago",{datetime:b.datetime(c)});var d=a.trim(c.text());b.settings.localeTitle?c.attr("title",c.data("timeago").datetime.toLocaleString()):!(d.length>0)||b.isTime(c)&&c.attr("title")||c.attr("title",d)}return c.data("timeago")}function f(a){return b.inWords(g(a))}function g(a){return(new Date).getTime()-a.getTime()}a.timeago=function(b){return b instanceof Date?f(b):"string"==typeof b?f(a.timeago.parse(b)):"number"==typeof b?f(new Date(b)):f(a.timeago.datetime(b))};var b=a.timeago;a.extend(a.timeago,{settings:{refreshMillis:6e4,allowFuture:!1,localeTitle:!1,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"a minute",minutes:"%d minutes",hour:"an hour",hours:"%d hours",day:"a day",days:"%d days",month:"a month",months:"%d months",year:"a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(b){function k(d,e){var f=a.isFunction(d)?d(e,b):d,g=c.numbers&&c.numbers[e]||e;return f.replace(/%d/i,g)}var c=this.settings.strings,d=c.prefixAgo,e=c.suffixAgo;this.settings.allowFuture&&0>b&&(d=c.prefixFromNow,e=c.suffixFromNow);var f=Math.abs(b)/1e3,g=f/60,h=g/60,i=h/24,j=i/365,l=45>f&&k(c.seconds,Math.round(f))||90>f&&k(c.minute,1)||45>g&&k(c.minutes,Math.round(g))||90>g&&k(c.hour,1)||24>h&&k(c.hours,Math.round(h))||42>h&&k(c.day,1)||30>i&&k(c.days,Math.round(i))||45>i&&k(c.month,1)||365>i&&k(c.months,Math.round(i/30))||1.5>j&&k(c.year,1)||k(c.years,Math.round(j)),m=c.wordSeparator||"";return void 0===c.wordSeparator&&(m=" "),a.trim([d,l,e].join(m))},parse:function(b){var c=a.trim(b);return c=c.replace(/\.\d+/,""),c=c.replace(/-/,"/").replace(/-/,"/"),c=c.replace(/T/," ").replace(/Z/," UTC"),c=c.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(c)},datetime:function(c){var d=b.isTime(c)?a(c).attr("datetime"):a(c).attr("title");return b.parse(d)},isTime:function(b){return"time"===a(b).get(0).tagName.toLowerCase()}});var c={init:function(){var c=a.proxy(d,this);c();var e=b.settings;e.refreshMillis>0&&setInterval(c,e.refreshMillis)},update:function(c){a(this).data("timeago",{datetime:b.parse(c)}),d.apply(this)},updateFromDOM:function(){a(this).data("timeago",{datetime:b.parse(b.isTime(this)?a(this).attr("datetime"):a(this).attr("title"))}),d.apply(this)}};a.fn.timeago=function(a,b){var d=a?c[a]:c.init;if(!d)throw new Error("Unknown function name '"+a+"' for timeago");return this.each(function(){d.call(this,b)}),this},document.createElement("abbr"),document.createElement("time")});


/**!
 * Animated Recent Signers for Greenpeace Action Template v0.3
 * INCOMPLETE
 * @fileOverview    Displays the most recent pledge signers, queued and
 *                  animated
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.0.1
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.recent_signers('#action-recent-signers'[, options]);
 * @todo            COUNTRY CODES:  Spec indicates signer country name, data is not available from JSON
 *                  EVENT DRIVEN DATA UPDATES:  trigger fetches & parsing externally
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */

(function($, M, window, undef) {
    'use strict';

    var _p3 = $.p3 || {},
    defaults = {
        jsonURL: 'https://www.greenpeace.org/api/p3/pledge/pledges.json',
        params: {},
        eventDriven: false,
        fetchDataEvent:     'fetchPledgeData',           /* trigger this event to fetch JSON data from the endpoint */
        fetchCompleteEvent: 'fetchPledgeDataComplete',   /* trigger this event if you have fetched data externally and just want to parse and update display */
        updateInterval: 5000,
        userQueueInterval: 750,
        maxUsers: 8
    };

    // countries json: https://gist.github.com/Goles/3196253/raw/1c2b972438c88480b23bdb44c0469bc56010d470/CountryCodes.json

    _p3.recent_signers = function(el, options) {
        var config = $.extend(true, defaults, options),
        $el = $(el),
        $ul = false,
        request = $.p3.request(config.jsonURL),
        users = [],
        timer = false,
        pledgeQueue = {
            running: false,
            delay: config.userQueueInterval,
            actions: [],
            callback: function () {},
            step: function () {
                if (pledgeQueue.actions.length) {
                    try {
                        pledgeQueue.actions.pop()();
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    pledgeQueue.running = false;
                }
            },
            run: function () {
                pledgeQueue.running = true;
                if (pledgeQueue.actions.length) {
                    pledgeQueue.step();
                    setTimeout(pledgeQueue.run, pledgeQueue.delay);
                } else {
                    pledgeQueue.running = false;
                    pledgeQueue.callback();
                }
            }
        },
        fetchJSON = function () {
            if (pledgeQueue.running) {
                // Still executing last update, restart timer
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fetchJSON();
                }, config.updateInterval);
                // and exit
                return false;
            }

            var params = $.extend(true, request.parameters, config.params);

            $.getJSON(request.url, params, function(json) {
                parsePledgeData(json);
            }).error( function (e) {
                throw new Error(e);
            });
        },
        parsePledgeData = function (json) {
            var jsonData = (undef === json) ? $(config.dataElement).data(config.dataNamespace) : json;

            // Add fetch first, since array is popped not shifted
            pledgeQueue.actions.push(function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fetchJSON();
                }, config.updateInterval);
            });

            $.each(jsonData.pledges, function (i, pledge) {

                if (pledge.user.dont_display_name === true) {
                    // Skip to next pledge ...
                    return true;
                }

                if (users[pledge.user.id]) {
                    // Already added, exit $.each
                    return false;
                } else {
                    // Store this ID
                    users[pledge.user.id] = true;
                }

                pledgeQueue.actions.push(function() {
                    showUser(pledge.user);
                });

            });

            // Update existing timestamps
            pledgeQueue.actions.push(function () {
                updateTimeStamps();
            });
            // Show all pledges
            pledgeQueue.run();

        },
        getTimeString = function (time) {
            if (time) {
                return $.timeago(time);
            }
        },
        getCountryString = function (country) {
//            console.log('TODO: country name by code');
            return country;
        },
        showUser = function (user) {
            var $li = $('<li style="display:none">\n\
                <span class="since" data-since="'+user.created+'">'+getTimeString(user.created)+'</span>\n\
                <span class="icon flag '+user.country+'"></span>\n\
                <span class="name">'+user.firstname + ' ' + user.lastname + '</span>\n\
                <span class="country">'+getCountryString(user.country)+'</span>\n\
                </li>');

            // Add to DOM
            $ul.prepend($li);

            // And show
            $li.show(350);

            // Remove any excess users
            if (config.maxUsers && $('li', $ul).length > config.maxUsers) {
                $('li:last', $ul).hide(350).remove();
            }
        },
        updateTimeStamps = function () {
            $('.since', $ul).each(function () {
                var $this = $(this);
                $this.text(getTimeString($this.attr('data-since')));
            });
        };

        if (config.updateInterval < 5000) {
            // Update interval sanity check
            config.updateInterval = 5000;
        }

        $ul = $('ul:first', $el);
        if (!$ul.length) {
            $ul = $('<ul></ul>');
            $el.append($ul);
        }

        // initialise
        M.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                if (config.eventDriven) {
                    // Event driven fetch and processing means we can decouple data
                    // from this plugin, allowing us to reuse the data without
                    // performing multiple requests
                    $(window).on(config.fetchDataEvent, function() {
                        // trigger this event to initiate a fetch
                        fetchJSON();
                    });

                    $(window).on(config.fetchCompleteEvent, function() {
                        // trigger this event if the JSON has already been fetched and is ready to parse
                        parsePledgeData();
                    });
                } else {
                    fetchJSON();
                }
            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));