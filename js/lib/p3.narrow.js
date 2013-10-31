/*
 * This file is a fallback to the narrow.js in our starterkits.
 * The size classes (.four, .five, ...) are used by the layout.less file
 *
 * This file can be overriden by any derivates (starterkits).
 */
function checkNarrow(){
    var size = {
        threetwo: 320,
        four: 400,
        five: 500,
        six: 600,
        sixfive: 650,
        seven: 700,
        sevensome: 768,
        eightfive: 850,
        nine: 900,
        tablet: 480,
        desktop: 1024,
        wide: 1350,
        large: 1600
    };
    jQuery.each(size, function(cls, size) {
        if (jQuery(window).innerWidth(true) >= size) {
            jQuery('body').addClass(cls);
        } else {
            jQuery('body').removeClass(cls);
        }
    });
}

jQuery(window).resize(checkNarrow);
jQuery(window).ready(checkNarrow);

