;
(function($) {
    
    $(document).ready(function() {
        $.p3.validation('#action-form-pledgeName', {
            jsonURL: 'js/v03/json_testing/rules.json'
        });
    });

}(jQuery));