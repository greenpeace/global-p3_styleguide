// Avoid `console` errors in browsers that lack a console.
(function() {
    'use strict';
    var method,
    noop = function() {},
    methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'],
    l = methods.length,
    console = (window.console = window.console || {});

    while (l--) {
        method = methods[l];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


(function($) {
    'use strict';
    var pledgeJSON = 'js/v03/json_testing/pledges.json';
    
    $(document).ready(function() {
        $.p3.validation('#action-form-pledgeName', {
            jsonURL: 'js/v03/json_testing/rules.json'
        });
        
        $.p3.pledge_counter('#action-counter', {
            jsonURL: pledgeJSON,
            uuid: '550e8402-e29b-41d4-a716-446655444563'
        });
        
    });

}(jQuery));