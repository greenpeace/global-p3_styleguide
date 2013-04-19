/* File Created: December 18, 2012 */

//Provide JavaScript replacements for older browsers that don't support the latest html5/css3 features.

//Add a JavaScript datePicker replacement.
//http://html5doctor.com/using-modernizr-to-detect-html5-features-and-provide-fallbacks/

    Modernizr.load({
        test: Modernizr.inputtypes.date,
        nope: ['http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',
          'css/backwards-compatibility/ui-lightness/jquery-ui-1.9.2.custom.min.css'],
        complete: function () {
            $('input[type=date]').datepicker({
                dateFormat: 'yy-mm-dd'
            });
        }
    });

    

//Add place holder support
    Modernizr.load({
        test: Modernizr.input.placeholder,
        nope: ['js/backwards-compatibility/placeholder.js',
          'css/backwards-compatibility/placeholder.css'],        
        
    });



//Add validation for fields that don't support the 'required' attribute.
