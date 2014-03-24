/**!
 * Animated Recent Signers for Greenpeace Action Template v0.3
 * @name            p3.recent_signers.js
 * @fileOverview    Displays the most recent pledge signers, queued and
 *                  animated
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.3.1
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.recent_signers('#action-recent-signers'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */

(function($, M, window, document) {
    'use strict';

    var _p3 = $.p3 || {},
        defaults = {
            jsonURL: 'https://secured.greenpeace.org/international/en/api/v2/pledges/',
            /* parameters to be added to the request url */
            params: {},
            /* Force UTC timezone if no time zone data is returned */
            mangleTime: true,
            /* selects which element holds the time data attribute */
            timeSelector: '.since',
            /* selects which attribute contains timestamps */
            timeDataAttr: 'data-since',
            /* selector for the country dropdown to map country codes to names
             * set to false to force sourcing information from JSON instead */
            countrySelector: '#UserCountry',
            /* source country information from a JSON file */
            countryJSON: 'countries/countries_en.json',
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
            /* milliseconds to wait for the API request */
            timeout: 30000,
            /* stop processing if there is an error */
            abortOnError: false
        };

    $.timeago.settings.strings = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "%d seconds",
        minute: "a minute",
        minutes: "%d minutes",
        hour: "an hour",
        hours: "%d hours",
        day: "a day",
        days: "%d days",
        month: "a month",
        months: "%d months",
        year: "a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
    };

    _p3.recent_signers = function(el, options) {
        var config = $.extend(true, defaults, options),
            $el = $(el),
            $ul = false,
            request = $.p3.request(config.jsonURL),
            users = [],
            countries = [],
            timer = false,
            refreshNum = 0,
            prefix = '$.p3.recent_signers :: ',
            pledgeQueue = {
                running: false,
                delay: config.userQueueInterval,
                actions: [],
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

                // http://stackoverflow.com/questions/20565330/ajax-call-for-json-fails-in-ie
                $.support.cors = true;

                $.ajax({
                    url: request.url,
                    timeout: config.timeout,
                    dataType: 'json',
                    data: params
                }).success(function(json) {
                    $(config.dataElement).data(config.dataNamespace, json);
                }).fail(function(e1) {
                    var message = prefix + 'Failed to load "' + request.url + '"';

                    if (config.abortOnError) {
                        throw new Error(message, e1);
                    }
                }).always(function() {
                    $.event.trigger(config.fetchCompleteEvent);
                });
            },
            parsePledgeData = function() {
                var jsonData = $(config.dataElement).data(config.dataNamespace);

                // Add fetch first, since array is popped not shifted,
                // because we're adding pledges from oldest to newest, but the
                // data is sorted newest to oldest
                if (!config.externalTrigger && refreshNum++ < config.maxRefreshes) {
                    pledgeQueue.actions.push(function() {
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            $.event.trigger(config.fetchDataEvent);
                        }, config.updateInterval);
                    });
                }

                if (!jsonData || jsonData.status === 'error') {
                    if (config.abortOnError) {
                        throw new Error(prefix + 'JSON data invalid');
                    } else {
                        // Trigger next fetch and stop parsing
                        pledgeQueue.run();
                        return;
                    }
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
             * Forces UTC if no timezone identifier is found
             * @param {string} timestamp
             * @returns {string}
             */
            getTimeString = function(time) {
                if (time) {
                    if (config.mangleTime) {
                        // Assume timestamp is UTC if trimmed string includes a space
                        time = $.trim(time).replace(/\s/,'Z');
                    }
                    return $.timeago(time);
                }
            },
            parseCountryData = function() {
                var deferred = $.Deferred(),
                    size = 0;

                if (config.countrySelector) {
                    // Parse the country element for code => name pairs
                    $.each($(config.countrySelector + ' option'), function (i, option) {

                        var $option = $(option),
                            val = $option.val();

                        if (val) {
                            // Force uppercase (not lowercase)
                            countries[val.toUpperCase()] = $option.text();
                            size++;
                        }
                    });

                    if (size > 0) {
                        // Happy with that.
                        deferred.resolve();
                        return deferred.promise();
                    } else {
                        // No countries found in the selector element
                        console.warn(prefix + 'No countries found in ' + config.countrySelector);
                        if (config.abortOnError) {
                            // Exit here with a failure
                            deferred.reject('Aborting', countries);
                            return deferred.promise();
                        }
                        // Continue with an attempt to read the country data from JSON
                    }
                }

                if (config.countryJSON) {
                    // fetch JSON country data
                    $.ajax({
                        url: config.countryJSON,
                        timeout: config.timeout,
                        dataType: 'json'
                    }).success( function(data) {
                        countries = data;
                        deferred.resolve();
                    }).fail(function (e) {
                        deferred.reject('Error fetching JSON from ' + config.countryJSON, e);
                    });
                }

                return deferred.promise();
            },
            getCountryString = function(country) {
                var string = countries.hasOwnProperty(country.toUpperCase()) ? countries[country.toUpperCase()] : false;

                if (string) {
                    return string;
                } else {
                    console.error(prefix + 'Country not found for code ' + country);
                    return country;
                }
            },
            showUser = function(user) {
                var timestamp = user.created || '',
                    timeCreated = getTimeString(timestamp),
                    country = user.country,
                    countryString = getCountryString(user.country),
                    firstname = user.firstname || '',
                    lastname = user.lastname || '',
                    $li = $('<li style="display:none"> </li>');

                $li.append('<span class="since" data-since="' + timestamp + '">' + timeCreated + '</span>')
                    .append('<span class="icon flag ' + country + '"></span>')
                    .append('<span class="name">' + firstname + ' ' + lastname + '</span>')
                    .append(' <span class="country">' + countryString + '</span>');

                // Add to DOM
                $ul.prepend($li);

                // And show
                $li.show(350);

                // Remove any excess users
                if (config.maxUsers && $('li', $ul).length > config.maxUsers) {
                    $('li:last', $ul).hide(350, function () {
                        this.remove();
                    });
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
                'js/compat/json.min.js'
            ],
            complete: function() {
                // parseCountryData() may rely on an AJAX call,
                // so we defer processing the rest of the application
                var promise = parseCountryData();

                promise.done(function () {
                    // Successfuly parsed Countries, we can now register events

                    // Apply human readable string to existing timestamps
                    updateTimeStamps();

                    // Event driven fetch and processing means we can decouple data
                    // from this plugin, allowing us to reuse the data without
                    // performing multiple requests

                    $(document).on(config.fetchDataEvent, function() {
                        fetchJSON();
                    });

                    $(document).on(config.fetchCompleteEvent, function() {
                        parsePledgeData();
                    });

                    // Trigger listen event unless configured to listen externally
                    if (!config.externalTrigger) {
                        $.event.trigger(config.fetchDataEvent);
                    }
                });

                promise.fail(function(message, error) {
                    // An error occurred parsing the countries list
                    console.error(message, error);
                });
            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this, document));
