/**!
 * Adds classes to an element (body by default) based on document width
 *
 * @copyright       Copyright 2013
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1.0
 * @author          <a href="http://www.more-onion.com/">More Onion</a>
 * @requires        <a href="http://jquery.com/">jQuery 1.7+</a>
 * @example         $.p3.mobilemenu('#main-nav', [options]);
 */
/* global jQuery */

(function ( $ ) {
  var _p3 = $.p3 || {};

  _p3.mobilemenu = function( element, options ) {
    var breakPointPassed;

    // merge options and defaults to settings
    var settings = $.extend({}, $.p3.mobilemenu.defaults, options );

    // save myself
    _p3.mobilemenu.$menu = $(element);
    // variable usable in custom callbacks
    _p3.mobilemenu.breakPointClass = settings.breakPointClass;
    _p3.mobilemenu.breakPointWidth = settings.breakPointWidth;

    // generate buttons hidden
    if (settings.createIcon) {
      _p3.mobilemenu.$icon = $('<a href="#">' + settings.iconText + '</a>').attr(settings.iconAttributes);
      $(settings.iconContainer).append(_p3.mobilemenu.$icon);
      _p3.mobilemenu.$icon.hide();
    }
    if (settings.createIcon) {
      _p3.mobilemenu.$close = $('<a href="#">' + settings.closeText + '</a>').attr(settings.closeAttributes);
      _p3.mobilemenu.$menu.prepend(_p3.mobilemenu.$close);
      _p3.mobilemenu.$close.hide();
    }

    // collapse submenus
    if (settings.collapseSubMenus) {
      $('ul ul', _p3.mobilemenu.$menu).hide();
    }

    // init callback
    settings.init.call();

    // initialize the mobilemenu
    $(window).load(function() {
      // show icons on mobile version
      if (!settings.breakPointTest()) {
        _p3.mobilemenu.$icon.show();
        _p3.mobilemenu.$close.show();
      }
    });

    // reset the visibility when we hit the breakpoint 'desktop'
    $(window).resize(function() {

      var mobileMenu = _p3.mobilemenu.$menu;
      var $body = $('body');
      var position = {};

      // % on padding will change the main-nav size --> recalc
      if (settings.adaptFullHeightOnResize) {
        if ($body.hasClass(settings.mobileMenuOpenClass)) {
          var mobileMenuWidth = mobileMenu.innerWidth();
          setMainMenuMinHeight($body.innerHeight());

          if (settings.shiftBodyAside) {
            position[settings.animationFromDirection] = mobileMenuWidth + 'px';
            $body.css(position);
            position[settings.animationFromDirection] = '-' + mobileMenuWidth + 'px';
            mobileMenu.css(position);
          }
        }
      }

      // make sure icon and close button are visible when on mobile
      if (!breakPointPassed && !settings.breakPointTest()) {
        _p3.mobilemenu.$icon.show();
        _p3.mobilemenu.$close.show();
      }
      // we switch from mobile/tablet to desktop
      if (!breakPointPassed && settings.breakPointTest()) {
        _p3.mobilemenu.$icon.hide();
        _p3.mobilemenu.$close.hide();
        mobileMenu.show();

        $body.removeClass(settings.mobileMenuOpenClass);

        // reset element style on mobilemenu caused from mobilemenu init
        if (settings.collapseSubMenus || settings.collapsibleSubMenus) {
          $('ul ul', mobileMenu).css('display', '');
        }

        if (settings.shiftBodyAside) {
          position[settings.animationFromDirection] = '0px';
          $body.css(position);
        }

        breakPointPassed = true;
        // fire callback
        settings.onSwitchToDesktop.call();
      }
      // we switch from desktop to tablet/mobile
      if (breakPointPassed && !settings.breakPointTest()) {
        _p3.mobilemenu.$icon.show();
        _p3.mobilemenu.$close.show();
        mobileMenu.hide();

        // reset element style on mobilemenu caused from mobilemenu init
        if (settings.collapseSubMenus) {
          $('ul ul', mobileMenu).hide();
        }

        breakPointPassed = false;
        // fire callback
        settings.onSwitchToMobile.call();
      }

      // reset position object
      position = {};
    });

    // define click handler
    var clickHandler = function (e) {
      var mobileMenu = e.data.self;
      var mobileMenuWidth = mobileMenu.innerWidth();
      var $body = $('body');
      var animation = {};

      if (mobileMenu.is(':visible')) {
        e.data.settings.beforeClose.call(e.data.self);

        if (settings.shiftBodyAside) {
          animation[settings.animationFromDirection] = '0px';
          $body.animate(animation, settings.animationDuration, function() {
            mobileMenu.hide();
            $body.removeClass(e.data.settings.mobileMenuOpenClass);

            e.data.settings.afterClose.call(e.data.self);
          });
        }
        else {
          animation[settings.animationFromDirection] = '-' + mobileMenuWidth + 'px';
          mobileMenu.animate(animation, settings.animationDuration, function() {
            mobileMenu.hide();
            $body.removeClass(e.data.settings.mobileMenuOpenClass);

            e.data.settings.afterClose.call(e.data.self);
          });
        }
        // reset to prevent unexpected reuse of former values
        animation = {};
      } else {
        e.data.settings.beforeOpen.call(e.data.self);

        if (settings.adaptFullHeightOnResize) {
          setMainMenuMinHeight($body.innerHeight());
        }
        if (settings.shiftBodyAside) {
          animation[settings.animationFromDirection] = '-' + mobileMenuWidth + 'px';
          mobileMenu.css(animation).show();
          animation[settings.animationFromDirection] = mobileMenuWidth + 'px';
          $body.addClass(e.data.settings.mobileMenuOpenClass).animate(animation, settings.animationDuration, function() {
            e.data.settings.afterOpen.call(e.data.self);
          });
        }
        else {
          animation[settings.animationFromDirection] = '-' + mobileMenuWidth + 'px';
          mobileMenu.css(animation).show();
          $body.addClass(e.data.settings.mobileMenuOpenClass);
          animation[settings.animationFromDirection] = '0px';
          mobileMenu.animate(animation, settings.animationDuration, function() {
            e.data.settings.afterOpen.call(e.data.self);
          });
        }
        // reset to prevent unexpected reuse of former values
        animation = {};
      }

      $(this).blur();
      e.preventDefault();
      return false;
    };

    // bind click handler 
    _p3.mobilemenu.$icon.on('click', {self: _p3.mobilemenu.$menu, settings: settings}, clickHandler);
    _p3.mobilemenu.$close.on('click', {self: _p3.mobilemenu.$menu, settings: settings}, clickHandler);

    // collapsible links/submenus in mobilemenu
    // if the link clicked has a ul.menu sibling (i.e. a submenu)
    // we want to show the submenu
    if (settings.collapsibleSubMenus) {
      $('html').on('click', '.mobilemenu-open #main-nav li a .submenu-icon', function(e) {
        var $a =$(this).parent();
        var $li = $a.closest('li');

        var $ul = $a.siblings('ul');
        if ($ul.length < 1) {
          $ul = $li.find('ul').first();
        }

        if ($ul.is(':visible')) {
          $ul.hide();
          $li.removeClass('submenu-open');
        } else {
          $ul.show();
          $li.addClass('submenu-open');
        }

        // lose focus
        $a.blur();
        // stop propagation - we do not want to follow link when click on submenu-icon
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // private utility function
    function setMainMenuMinHeight(pixel) {
      var mobileMenu = _p3.mobilemenu.$menu;
      var paddingTop = parseInt(mobileMenu.css('padding-top'), 10);
      var paddingBottom = parseInt(mobileMenu.css('padding-bottom'), 10);
      mobileMenu.css({minHeight: (pixel - paddingTop - paddingBottom) + 'px', maxHeight: (pixel - paddingTop - paddingBottom) + 'px', overflow: 'auto'});
    }
  };

  // returns true when on desktop, i.e. breakpoint was passed
  _p3.mobilemenu.breakPointPassedTestByClass = function () {
    var classToTestFor = _p3.mobilemenu.breakPointClass;
    return $('body').hasClass(classToTestFor);
  };

  // returns true when on desktop, i.e. breakpoint was passed
  _p3.mobilemenu.breakPointPassedTestByWidth = function () {
    var width;
    var breakpointToTest = parseInt(_p3.mobilemenu.breakPointWidth, 10);

    // TODO integrate with p3.narrow.js
    // (the code below is copied from p3.narrow.js)
    if (typeof window.innerWidth === 'number') {
      // Non-IE
      width = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      // IE 6+ in 'standards compliant mode'
      width = document.documentElement.clientWidth;
    }

    return (width >= breakpointToTest) ? true : false;
  };

  _p3.mobilemenu.defaults = {
    // These are the defaults.
    createIcon: true,
    iconText: 'Menu',
    iconContainer: '',
    iconAttributes: { id: 'mobilemenu-icon' },
    createClose: true,
    closeText: 'close',
    closeContainer: '',
    closeAttributes: { id: 'mobilemenu-close' },
    mobileMenuOpenClass: 'mobilemenu-open',
    breakPointClass: 'sevensome',
    adaptFullHeightOnResize: true,
    animationDuration: 300,
    animationFromDirection: 'right',
    shiftBodyAside: true,
    collapseSubMenus: true,
    collapsibleSubMenus: true,
    breakPointWidth: 768,
    breakPointTest: _p3.mobilemenu.breakPointPassedTestByWidth,
    init: function() {},
    beforeOpen: function() {},
    beforeClose: function() {},
    afterOpen: function() {},
    afterClose: function() {},
    onSwitchToMobile: function() {},
    onSwitchToDesktop: function() {}
  };

  $.p3 = _p3;
}( jQuery ));

