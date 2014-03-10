/**!
 *
 * @name            p3.pledge_counter.js
 * @fileOverview    Greenpeace Pledge Signing Counter for Action Template v0.3
 *                  Animated pledge percentage bar & text,
 *                  Can be event driven or directly invoked, which
 *                  enables reusing the JSON with another plugin (eg Recent Signers)
 * @version         0.3.3
 * @author          Ray Walker <hello@raywalker.it>
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 *                  $.p3.request
 * @example         $.p3.counter('#action-counter'[, options]);
 *
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M, window, document) {
    'use strict';

    var _p3 = $.p3 || {},
    defaults = {
        meterElement:       '.completed',               /* Selector for the bar to animated */
        meterWrapper:       '#action-counter-graphical',/* Selector for the bar wrap element */
        countElement:       '.count',                   /* Selector for the current count text to update (within the wrapper element) */
        totalElement:       '.total',                   /* Selector for the pledge total target text to update (within the wrapper element) */
        fetchFrequency:     30000,                      /* time to wait to fetch next value from server (in milliseconds) */
        updateSpeed:        25,                         /* this is the value update speed (in milliseconds). Change this value to make animation faster or slower */
        initialAnimationTotalDuration: 2500,            /* change this value to set the total duration of the first fetch animation (how many milliseconds takes
                                                           the progress bar from 0 to the current value */
        dataElement:        'body',                     /* Element where the pledge JSON is stored */
        dataNamespace:      'pledgeData',               /* Namespace to use for stored JSON - change this if using multiple counters per page */
        externalTrigger:    true,                       /* set to true to delay execution until externally triggered by event */
        fetchDataEvent:     'pledgeCounterFetch',       /* trigger this event to fetch JSON data from the endpoint */
        fetchCompleteEvent: 'fetchPledgeDataComplete',  /* trigger this event if you have fetched data externally and just want to parse and update display */
        jsonURL:            'https://secured.greenpeace.org/international/en/api/v2/pledges/',
        params:             {},                         /* object containing GET parameters to pass to p3.request */
        timeout:            30000,                       /* milliseconds to wait for API request */
        abortOnError:       false                       /* stop processing if there is an error */
    };

    _p3.pledge_counter = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
        $meter = $(config.meterElement, el),
        $count = $(config.countElement, el),
        $total = $(config.totalElement, el),
        paused = false,
        currentValue = 0,
        step = 0,
        progress = {
            count: 0,
            target: 0
        },
        request = $.p3.request(config.jsonURL),
        prefix = '$.p3.pledge_counter :: ',
        updateProgress = function () {
            if (paused) {
                // We're already updating, come back later
                setTimeout( function() {
                    updateProgress();
                }, config.fetchFrequency);
                return;
            }
            paused = true;

            var value = progress.count;

            if (value < currentValue) {
                currentValue = 0;
            }
            step = Math.ceil((value * config.updateSpeed) / config.initialAnimationTotalDuration, 0);
            if (step <= 0) {
                step = 1;
            }
            $count.text(addCommas(progress.count))  ;
            $total.text(addCommas(progress.target));

            animateProgress();
        },
        animateProgress = function () {
//            console.log(progress.count + ' / ' + progress.target + ' step: ' + initialStep);

            if (currentValue >= progress.count * 1.0) {
                paused = false;
                // Restart the process to check for live changes
                if (!config.externalTrigger) {
                    setTimeout(fetchJSON, config.fetchFrequency);
                }
                return;
            }

            if (currentValue + step < progress.count){
                currentValue += step;
            } else {
                currentValue = progress.count;
            }

            var percent = currentValue / progress.target * 100;

            if (percent > 100) {
                percent = 100;
            }

            if (M.csstransforms) {
                $meter.css({
                    width: percent + '%'
                }).html(addCommas(currentValue) + '&nbsp;');
            } else {
                $meter.animate({
                    width: percent + '%'
                }, (config.updateSpeed - 5 >= 0) ? config.updateSpeed : 0, function () {
                    $meter.html(addCommas(currentValue) + '&nbsp;');
                });
            }

            setTimeout(animateProgress, config.updateSpeed);
        },
        addCommas = function (number) {
            var nStr = number + '',
            x = nStr.split('.'),
            x1 = x[0],
            x2 = x.length > 1 ? '.' + x[1] : '',
            rgx = /(\d+)(\d{3})/;

            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },
        parsePledgeData = function () {
            // read data from parameter or element
            var data = $(config.dataElement).data(config.dataNamespace);

            if (!data || data.status === 'error' || !data.pledges[0].action) {
                if (config.abortOnError) {
                    throw new Error(prefix + 'Errors in pledge data:', data);
                } else {
                    return;
                }
            }

            progress.count = data.pledges[0].action.count;
            progress.target = data.pledges[0].action.target;

            if (isNaN(progress.count) || isNaN(progress.target)) {
                // doesn't exist, or wrong format
                console.warn(prefix + 'Progress data not found or not valid, attempting to continue');
                return false;
            }

            $(config.meterWrapper).show();

            // Display results
            updateProgress();
        },
        fetchJSON = function () {
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
            }).fail(function(e) {
                var message = prefix + 'Failed to load "' + request.url + '"';

                if (config.abortOnError) {
                    throw new Error(message, e);
                } else {
                    console.warn(message, e);
                }
            }).always(function() {
                $.event.trigger(config.fetchCompleteEvent);
            });
        };

        // initialise
        M.load({
            test: window.JSON,
            nope: [
                'dist/js/compat/json.min.js'
            ],
            complete: function() {
                if (M.csstransforms) {
                    $meter.css({"transition-duration": config.updateSpeed + "ms"});
                }

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
                if (config.externalTrigger === false) {
                    $.event.trigger(config.fetchDataEvent);
                }

            }
        });

    };

    // Overwrite p3 namespace if no errors
    $.p3 = _p3;

}(jQuery, Modernizr, this, document));