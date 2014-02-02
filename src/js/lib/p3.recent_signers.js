/**!
 * Animated Recent Signers for Greenpeace Action Template v0.3
 * @name            p3.recent_signers.js
 * @fileOverview    Displays the most recent pledge signers, queued and
 *                  animated
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.2.0
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.recent_signers('#action-recent-signers'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */

(function($, M, window) {
    'use strict';

    var _p3 = $.p3 || {},
        defaults = {
            jsonURL: 'https://secured.greenpeace.org/international/en/api/v2/pledges/',
            /* parameters to be added to the request url */
            params: {},
            /* selects which element holds the time data attribute */
            timeSelector: '.since',
            /* selects which attribute contains timestamps */
            timeDataAttr: 'data-since',
            /* selector for the country dropdown to map country codes to names */
            countrySelector: '#UserCountry',
            /* set to true to delay execution until externally triggered by event */
            externalTrigger: false,
            /* element to store returned pledge data */
            dataElement: 'body',
            /* name of data object to store pledge data */
            dataNamespace: 'pledgeData',
            /* trigger this event to fetch JSON data from the endpoint */
            fetchDataEvent: 'recentSignersFetch',
            /* trigger this event if you have fetched data externally and just
             * want to parse and update display */
            fetchCompleteEvent: 'fetchPledgeDataComplete',
            /* delay in milliseconds between signer check updates */
            updateInterval: 30000,
            /* interval between users added to the recent signer list from last
             * update */
            userQueueInterval: 750,
            /* maximum number of users to display at once, excess users are hidden
             * and then removed from the DOM */
            maxUsers: 5,
            /* number of times to check the server for new signers after the first
             * set to 0 to disable updates */
            maxRefreshes: 30,
            /* stop processing if there is an error */
            abortOnError: false
        };

    _p3.recent_signers = function(el, options) {
        var config = $.extend(true, defaults, options),
            $el = $(el),
            $ul = false,
            request = $.p3.request(config.jsonURL),
            users = [],
            timer = false,
            refreshNum = 0,
            prefix = '$.p3.recent_signers :: ',
            pledgeQueue = {
                running: false,
                delay: config.userQueueInterval,
                actions: [],
                callback: function() {
                },
                step: function() {
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
                run: function() {
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
            fetchJSON = function() {
                if (pledgeQueue.running) {
                    // Still executing last update, restart timer
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        fetchJSON();
                    }, config.updateInterval);
                    // and exit
                    return false;
                }

                var params = $.extend(true, request.parameters, config.params);

                $.getJSON(request.url, params, function(json) {
                    $(config.dataElement).data(config.dataNamespace, json);
                }).fail(function() {
                    var message = prefix + 'Failed to load JSON from "' + request.url + '"';

                    if (config.abortOnError) {
                        throw new Error(message);
                    } else {
                        console.warn(message);
                    }
                }).complete(function() {
                    $(window).trigger(config.fetchCompleteEvent);
                });

            },
            parsePledgeData = function() {
                // Load from the parameter if set,
                // else load from the data stored in an element if eventDriven
                var jsonData = $(config.dataElement).data(config.dataNamespace);

                if (!jsonData) {
                    if (config.abortOnError) {
                        throw new Error(prefix + 'JSON data invalid');
                    } else {
                        return;
                    }
                }

                // Add fetch first, since array is popped not shifted
                if (refreshNum++ < config.maxRefreshes && !config.externalTrigger) {
                    pledgeQueue.actions.push(function() {
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            $(window).trigger(config.fetchDataEvent);
                        }, config.updateInterval);
                    });
                }

                $.each(jsonData.pledges, function(i, pledge) {

                    if (users[pledge.user.id]) {
                        // Already added, exit $.each
                        return false;
                    } else {
                        // Store this ID
                        users[pledge.user.id] = true;
                    }

                    if (pledge.user.dont_display_name === true) {
                        // Skip to next pledge ...
                        console.warn(prefix + 'pledge.user.dont_display_name is true');
                        return true;
                    }

                    pledgeQueue.actions.push(function() {
                        // Enqueue this user
                        showUser(pledge.user);
                    });

                });

                // Update existing timestamps
                pledgeQueue.actions.push(function() {
                    updateTimeStamps();
                });

                // Show all pledges in the queue
                pledgeQueue.run();

            },
            /**
             * Retrieves human readable time string from timestamp
             * @param {string} timestamp
             * @returns {string}
             */
            getTimeString = function(time) {
                if (time) {
                    return $.timeago(time);
                }
            },
            getCountryString = function(country) {
                var string = $(config.countrySelector + ' option:valueNoCase(' + country + ')').text();
                return string ? string : config.abortOnError ? '' : country;
            },
            showUser = function(user) {
                var $li = $('<li style="display:none"><span class="since" data-since="' +
                    user.created + '">' + getTimeString(user.created) + '</span><span class="icon flag ' + user.country +
                    '"></span><span class="name">' + user.firstname +
                    ' ' + user.lastname + '</span> <span class="country">' +
                    getCountryString(user.country) + '</span></li>');

                // Add to DOM
                $ul.prepend($li);

                // And show
                $li.show(350);

                // Remove any excess users
                if (config.maxUsers && $('li', $ul).length > config.maxUsers) {
                    $('li:last', $ul).hide(350).remove();
                }
            },
            updateTimeStamps = function() {
                $(config.timeSelector, $ul).each(function() {
                    var $this = $(this);
                    $this.text(getTimeString($this.attr(config.timeDataAttr)));
                });
            };

        // initialise and run

        if (config.updateInterval < 5000) {
            // Update interval sanity check
            config.updateInterval = 5000;
        }

        $ul = $('ul:first', $el);
        if (!$ul.length) {
            $ul = $('<ul></ul>');
            $el.append($ul);
        }

        M.load({
            test: window.JSON,
            nope: [
                'js/vendor/json.min.js'
            ],
            complete: function() {
                // Apply human readable string to existing timestamps
                updateTimeStamps();

                // Event driven fetch and processing means we can decouple data
                // from this plugin, allowing us to reuse the data without
                // performing multiple requests

                $(window).on(config.fetchDataEvent, function() {
                    fetchJSON();
                });

                $(window).on(config.fetchCompleteEvent, function() {
                    parsePledgeData();
                });

                // Trigger listen event unless configured to listen externally
                if (!config.externalTrigger) {
                    $(window).trigger(config.fetchDataEvent);
                }
            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));
