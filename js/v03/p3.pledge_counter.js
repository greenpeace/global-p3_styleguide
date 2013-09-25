/**!
 * 
 * 
 * @fileOverview    Greenpeace Pledge Signing Counter for Action Template v0.3
 *                  Animated pledge percentage bar & text, 
 *                  Can be event driven or directly invoked, enabling the JSON
 *                  data to be reused with another plugin (eg Recent Signers)                                   
 * @version         0.1
 * @author          Ray Walker <hello@raywalker.it>
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>
 * @example         $.p3.counter('#action-counter'[, options]);
 * 
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global Modernizr */
(function($, M) {
    'use strict';
    
    var _p3 = $.p3 || {},
    defaults = {
        uuid: false,                                    /* Use this to specify the UUID of the pledge in the returned JSON, 
                                                         * else the script will search the passed element for a data-pledge-uuid attribute and use that, 
                                                         * and if both are null, it will default to processing the first pledge it finds */
        meterElement:       '.completed',               /* Selector for the bar to animated */
        textElement:        '#action-counter-textual',  /* Selector for the text to update, eg 100 have joined so far. The target is 200 */
        fetchFrequency:     30000,                      /* time to wait to fetch next value from server (in milliseconds) */
        updateSpeed:        25,                         /* this is the value update speed (in milliseconds). Change this value to make animation faster or slower */
        initialAnimationTotalDuration: 2500,            /* change this value to set the total duration of the first fetch animation (how many milliseconds takes
                                                           the progress bar from 0 to the current value */
        dataElement:        'body',                     /* Element where the pledge JSON is stored */
        dataNamespace:      'pledgeCounter',            /* Namespace to use for stored JSON - change this if using multiple counters per page */
        eventDriven:        false,                      /* set to true to trigger update externally */
        fetchDataEvent:     'fetchPledgeData',          /* trigger this event to fetch JSON data from the endpoint */
        fetchCompleteEvent: 'fetchPledgeDataComplete',  /* trigger this event if you have fetched data externally and just want to parse and update display */
        jsonURL:            'https://www.greenpeace.org/api/p3/pledge/config.json'
    };
    
    _p3.pledge_counter = function(el, options) {
        
        var config = $.extend(true, defaults, options || {}),
        $meter = $(config.meterElement, el),
        $text = $(config.textElement, el),
        pledgeIdentifier = config.uuid || $(el).attr('data-pledge-uuid'),
        paused = false,
        currentValue = 0,
        step = 0,
        progress = {
            count: 0,
            target: 0
        },
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
            $text.text(addCommas(progress.count) + ' have joined so far. The target is ' + addCommas(progress.target) + '.');
            
            animateProgress();
        },
        animateProgress = function () {
//            console.log(progress.count + ' / ' + progress.target + ' step: ' + initialStep);

            if (currentValue >= progress.count * 1.0) {
                paused = false;
                // Restart the process to check for live changes
//                if (config.eventDriven) {
//                    setTimeout( function () {
//                        $(window).trigger(config.fetchDataEvent);
//                    }, config.fetchFrequency);                  
//                } else {
//                    setTimeout(fetchJSON, config.fetchFrequency);
//                }                
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
        parsePledgeData = function (json) {
            var jsonData = ("undefined" === json) ? $(config.dataElement).data(config.dataNamespace) : json;
            
            if (pledgeIdentifier) {
                var found = false;
//                console.log(pledgeIdentifier);
                $.each(jsonData.pledges, function(i, data) {
                    if(data.uuid === pledgeIdentifier) {
//                        console.log('Pledge found ' + data.uuid);
                        progress.count = data.action.count;
                        progress.target = data.action.target;        
                        found = true;
                        return false;
                    }
                });
                if (!found) {
                    throw new Error('Pledge not found: ' + pledgeIdentifier);
                }
            } else {
                progress.count = jsonData.pledges[0].action.count;
                progress.target = jsonData.pledges[0].action.target;
            }            
            
            updateProgress();
        },
        fetchJSON = function () {
            $.ajaxSetup ({
                // Disable caching of AJAX responses
                cache: false
            });
            
            $.getJSON(config.jsonURL, function(json) {
                parsePledgeData(json);
            });
        };
        
        // initialise
        M.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                if (M.csstransforms) {
                    $meter.css({"transition-duration": config.updateSpeed + "ms"});
                }
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
        
        return {
            config: config,
            parseJSON: parsePledgeData,
            fetchJSON: fetchJSON
        };
        
    };    
    
    // Overwrite p3 namespace if no errors
    $.p3 = _p3;
    
}(jQuery, Modernizr));