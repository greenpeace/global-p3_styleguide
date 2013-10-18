
(function($) {
  $(window).load(function() {
    // generate buttons hidden
    $('.heading-first .logo').parent().append('<a href="#" id="mobilemenu-icon">Men&uuml;</a>');
    $('#main-nav').prepend('<a href="#" id="mobilemenu-close">close</a>');
    $('#mobilemenu-icon').hide();
    $('#mobilemenu-close').hide();

    // initialize main-menu
    // setMainMenuActiveState();

    if (!$('body').hasClass('sevensome')) {
      $('#mobilemenu-icon').show();
      $('#mobilemenu-close').show();
    }

    $('#mobilemenu-icon,  #mobilemenu-close').click(function(e) {
      var mainMenu = $('#main-nav');
      var mainMenuWidth = mainMenu.innerWidth();
      $('ul ul', mainMenu).hide();
      if (mainMenu.is(':visible')) {
        $('body').animate({right: '0px'}, 300, function() {
          mainMenu.hide();
          $('body').removeClass('mobilemenu-open');
          // setMainMenuActiveState();
          // $('#mobilemenu-close').hide();
        });
      } else {
        // mainMenu.css({right: '-50000px'});
        setMainMenuMinHeight($('body').innerHeight());
        mainMenu.css({right: '-' + mainMenuWidth + 'px'}).show();
        $('body').animate({right: mainMenuWidth + 'px'}, 300, function() {
          $('body').addClass('mobilemenu-open');
          // setMainMenuActiveState();
        });
      }
      $(this).blur();
      e.preventDefault();
      return false;
    });

    // if the link clicked has a ul.menu sibling (i.e. a submenu)
    // we want to show the submenu
    $('html').on('click', '.mobilemenu-open #main-nav li a', function(e) {
      var ul = $(this).siblings('ul');
      var holder = $(this).siblings('.drop-holder');
      if (holder.length > 0) {
        ul = $('.drop-content > ul', holder);
      }
      if (ul.length > 0) {
        if (ul.is(':visible')) {
          ul.hide();
        } else {
          ul.show();
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // reset the visibility when we hit the breakpoint 'desktop'
    $(window).resize(function() {
      var _mobilemenu = $.mobilemenu || {};

      var mainMenu = $('#main-nav');
      var mobileMenuClose = $('#mobilemenu-close');
      var mobileMenuIcon = $('#mobilemenu-icon');

      // % on padding will change the main-nav size --> recalc
      if($('body').hasClass('mobilemenu-open')) {
        var mainMenuWidth = mainMenu.innerWidth();
        $('body').css({right: mainMenuWidth + 'px'});
        mainMenu.css({right: '-' + mainMenuWidth + 'px'});
        setMainMenuMinHeight($('body').innerHeight());
      }

      // we switch from mobile/tablet to desktop
      if (!_mobilemenu.breakpoint_passed && $('body').hasClass('sevensome')) {
        $('body').css({right: '0px'});
        mainMenu.show();
        mobileMenuClose.hide();
        mobileMenuIcon.hide();
        mainMenu.css({minHeight: '0px'});
        $('body').removeClass('mobilemenu-open');
        // reset the display, i.e. remove the element style
        // otherwise the dropdown css in header.css will not work properly
        // after the mobilemenu was used
        $('ul ul', mainMenu).css('display', '');
        $('.drop-holder', mainMenu).css('display', '');

        _mobilemenu.breakpoint_passed = true;
      }
      // we switch from desktop to tablet/mobile
      if (_mobilemenu.breakpoint_passed && !$('body').hasClass('sevensome')) {
        mainMenu.hide();
        mobileMenuClose.show();
        mobileMenuIcon.show();
        $('body').css({right: '0px'});
        $('body').removeClass('mobilemenu-open');
        $('ul ul', mainMenu).show();
        _mobilemenu.breakpoint_passed = false;
      }

      $.mobilemenu = _mobilemenu;
    });

    function setMainMenuActiveState() {
      var mobileMenu = $('#main-nav');
      var mainMenu = $('#main-nav');
      var mainMenuIcon = $('#mobilemenu-icon');
      if(mobileMenu.is(':visible')) {
        mainMenuIcon.addClass('active');
      } else {
        mainMenuIcon.removeClass('active');
      }
    }

    function setMainMenuMinHeight(pixel) {
      var mainMenu = $('#main-nav');
      var paddingTop = parseInt(mainMenu.css('padding-top'), 10);
      var paddingBottom = parseInt(mainMenu.css('padding-bottom'), 10);
      mainMenu.css({minHeight: (pixel - paddingTop - paddingBottom) + 'px', maxHeight: (pixel - paddingTop - paddingBottom) + 'px', overflow: 'auto'});
    }
  });
})(jQuery);
