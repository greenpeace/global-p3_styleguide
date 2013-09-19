;
(function($) {
    var pledgeJSON = 'js/v03/json_testing/pledges.json';
    
    $(document).ready(function() {
        $.p3.validation('#action-form-pledgeName', {
            jsonURL: 'js/v03/json_testing/rules.json'
        });
        
        var counter = $.p3.pledge_counter('#action-counter', {
            jsonURL: pledgeJSON,
//            eventDriven: true,
            uuid: '550e8402-e29b-41d4-a716-446655444563'
        });
        
//        $.getJSON(pledgeJSON, function (json) {
//            $(counter.config.dataElement).data(counter.config.dataNamespace, json);
//            counter.fetchComplete();
//        });
        
    });

}(jQuery));