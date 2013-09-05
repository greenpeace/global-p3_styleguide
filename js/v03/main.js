;
(function($) {
    
    $(document).ready(function() {
        $.p3.validation('#action-form-pledgeName', {
            jsonURL: 'http://dev.raywalker.it:81/gp/rules.json'
        });
    });

}(jQuery));