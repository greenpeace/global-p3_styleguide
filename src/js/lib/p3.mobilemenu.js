/**!
 * Provides the submenu navigation for the mobilemenu.
 *
 * @copyright       Copyright 2013
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.2.0
 * @author          <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>, matchMedia support
 * @example         $.p3.mobilemenu('#main-nav', [options]);
 */
/* global jQuery */

(function ( $ ) {
    var _p3 = $.p3 || {};

    _p3.mobilemenu = function( element, options ) {

        var defaults = {
            // These are the defaults.
            // iconContainer: '',
            // closeContainer: '',
            // mobileMenuOpenClass: 'mobilemenu-open',
            breakPointWidth: 768,
            init: function() {},
            // beforeOpen: function() {},
            // beforeClose: function() {},
            // afterOpen: function() {},
            // afterClose: function() {},
            onSwitchToMobile: function() {},
            onSwitchToDesktop: function() {}
        };

        // merge options and defaults to settings
        var settings = $.extend({}, defaults, options );

        // save myself
        _p3.mobilemenu.$menu = $(element);

        // initialize the mobilemenu
        $(window).load(function() {
            initializeSubmenus();
        });

        // init callback
        settings.init.call(_p3.mobilemenu.$menu, settings);

        var px = parseInt(settings.breakPointWidth, 10);

        // if window.matchMedia support
        if (px && matchMedia) {
            var mq = window.matchMedia("(min-width: " + px + "px)");
            mq.addListener(breakPointCallback);
            breakPointCallback(mq);
        }

        // breakpoint callback:
        // fires callbacks when switching to/from mobile
        // (works only on browsers with media queries)
        function breakPointCallback(mq) {
            if (mq.matches) {
                _p3.mobilemenu.mobile = false;
                _p3.mobilemenu.$menu.removeClass('mobilemenu');
                settings.onSwitchToDesktop.call(_p3.mobilemenu.$menu, settings);
            }
            else {
                _p3.mobilemenu.mobile = true;
                _p3.mobilemenu.$menu.addClass('mobilemenu');
                settings.onSwitchToMobile.call(_p3.mobilemenu.$menu, settings);
            }
        }

        // - add class to every li which has an submenu
        // - create a link clone inside the submenu (for actually triggering the
        //   page request and not the menu navigation)
        // - create back link
        function initializeSubmenus() {
          var $submenus = $('ul ul', _p3.mobilemenu.$menu);
          var $menuItems = $('li:not(.nav-back, .mobilemenu-linkclone)', _p3.mobilemenu.$menu);
          _p3.mobilemenu.$menu.addClass('mobilemenu-js');

          $menuItems.each(function() {
              var $item = $(this);
              var $link, $linkClone, $submenu;

              if ($item.find('ul').length > 0) {
                  $item.addClass('has-submenu');

                  $link = $item.children('a');
                  $linkClone = $link.clone(false);
                  $submenu = $item.find('ul').first();
                  $linkClone.prependTo($submenu).wrap('<li class="mobilemenu-clone">');
                  $('<li class="mobilemenu-back"><a href="#">back</a></li>').prependTo($submenu);
              }
          });
        }

        // forward and back handler on clicks
        function forwardHandler(e) {
            e.preventDefault();
            e.stopPropagation();

            $(e.currentTarget).blur();

            $(e.currentTarget).closest('ul').addClass('out-left').removeClass('in-left');
            $(e.currentTarget).parent().find('ul').first().addClass('in-left');
        }
        function backHandler(e) {
            e.preventDefault();
            e.stopPropagation();

            $(e.currentTarget).blur();

            var $self = $(e.currentTarget).closest('ul');
            $self.addClass('out-left').removeClass('in-left out-left');
            $self.parent().closest('ul').addClass('in-left').removeClass('out-left');
        }

        _p3.mobilemenu.$menu.on('click', '.mobilemenu-back', backHandler);
        _p3.mobilemenu.$menu.on('click', '.has-submenu > a', forwardHandler);

    };

    $.p3 = _p3;
}( jQuery ));

