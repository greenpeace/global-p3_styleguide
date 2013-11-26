'use strict';
// Source: src/js/vendor/jquery.cookie-1.3.1.min.js
/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function c(a){if(e.raw)return a;try{return decodeURIComponent(a.replace(b," "))}catch(c){}}function d(a){0===a.indexOf('"')&&(a=a.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),a=c(a);try{return e.json?JSON.parse(a):a}catch(b){}}var b=/\+/g,e=a.cookie=function(b,f,g){if(void 0!==f){if(g=a.extend({},e.defaults,g),"number"==typeof g.expires){var h=g.expires,i=g.expires=new Date;i.setDate(i.getDate()+h)}return f=e.json?JSON.stringify(f):String(f),document.cookie=[e.raw?b:encodeURIComponent(b),"=",e.raw?f:encodeURIComponent(f),g.expires?"; expires="+g.expires.toUTCString():"",g.path?"; path="+g.path:"",g.domain?"; domain="+g.domain:"",g.secure?"; secure":""].join("")}for(var j=b?void 0:{},k=document.cookie?document.cookie.split("; "):[],l=0,m=k.length;m>l;l++){var n=k[l].split("="),o=c(n.shift()),p=n.join("=");if(b&&b===o){j=d(p);break}b||void 0===(p=d(p))||(j[o]=p)}return j};e.defaults={},a.removeCookie=function(b,c){return void 0!==a.cookie(b)?(a.cookie(b,"",a.extend({},c,{expires:-1})),!0):!1}});


;// Source: src/js/vendor/jquery.dropdown.js
/*
 * jQuery dropdown: A simple dropdown plugin
 *
 * Inspired by Bootstrap: http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * Copyright 2013 Cory LaViska for A Beautiful Site, LLC. (http://abeautifulsite.net/)
 * Dual licensed under the MIT / GPL Version 2 licenses
 *
*/
if(jQuery) (function($) {
    
    $.extend($.fn, {
        dropdown: function(method, data) {
            
            switch( method ) {
                case 'hide':
                    hide();
                    return $(this);
                case 'attach':
                    return $(this).attr('data-dropdown', data);
                case 'detach':
                    hide();
                    return $(this).removeAttr('data-dropdown');
                case 'disable':
                    return $(this).addClass('dropdown-disabled');
                case 'enable':
                    hide();
                    return $(this).removeClass('dropdown-disabled');
            }
            
        }
    });
    
    function show(event) {
        
        var trigger = $(this),
            dropdown = $(trigger.attr('data-dropdown')),
            isOpen = trigger.hasClass('dropdown-open');
        
        // In some cases we don't want to show it
        if( trigger !== event.target && $(event.target).hasClass('dropdown-ignore') ) return;
        
        event.preventDefault();
        event.stopPropagation();
        hide();
        
        if( isOpen || trigger.hasClass('dropdown-disabled') ) return;
        
        // Show it
        trigger.addClass('dropdown-open');
        dropdown
            .data('dropdown-trigger', trigger)
            .show();
            
        // Position it
        position();
        
        // Trigger the show callback
        dropdown
            .trigger('show', {
                dropdown: dropdown,
                trigger: trigger
            });
        
    }
    
    function hide(event) {
        
        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;
        
        // Are we clicking anywhere in a dropdown?
        if( targetGroup && targetGroup.is('.dropdown') ) {
            // Is it a dropdown menu?
            if( targetGroup.is('.dropdown-list') ) {
                // Did we click on an option? If so close it.
                if( !targetGroup.is('a') ) return;
            } else {
                // Nope, it's a panel. Leave it open.
                return;
            }
        }
        
        // Hide any dropdown that may be showing
        $(document).find('.dropdown:visible').each( function() {
            var dropdown = $(this);
            dropdown
                .hide()
                .removeData('dropdown-trigger')
                .trigger('hide', { dropdown: dropdown });
        });
        
        // Remove all dropdown-open classes
        $(document).find('.dropdown-open').removeClass('dropdown-open');
        
    }
    
    function position() {
        
        var dropdown = $('.dropdown:visible').eq(0),
            trigger = dropdown.data('dropdown-trigger'),
            hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
            vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;
        
        if( dropdown.length === 0 || !trigger ) return;
        
        /* Position the dropdown
        dropdown
            .css({
                left: dropdown.hasClass('dropdown-anchor-right') ? 
                    trigger.offset().left - (dropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
                top: trigger.offset().top + trigger.outerHeight() + vOffset
            });
        */
    }
    
    $(document).on('click.dropdown', '[data-dropdown]', show);
    $(document).on('click.dropdown', hide);
    $(window).on('resize', position);
    
})(jQuery);

;// Source: src/js/vendor/jquery.timago-1.3.0.min.js
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "1 day ago").
 *
 * @name timeago
 * @version 1.3.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2013, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){function d(){var c=e(this),d=b.settings;return isNaN(c.datetime)||(0==d.cutoff||g(c.datetime)<d.cutoff)&&a(this).text(f(c.datetime)),this}function e(c){if(c=a(c),!c.data("timeago")){c.data("timeago",{datetime:b.datetime(c)});var d=a.trim(c.text());b.settings.localeTitle?c.attr("title",c.data("timeago").datetime.toLocaleString()):!(d.length>0)||b.isTime(c)&&c.attr("title")||c.attr("title",d)}return c.data("timeago")}function f(a){return b.inWords(g(a))}function g(a){return(new Date).getTime()-a.getTime()}a.timeago=function(b){return b instanceof Date?f(b):"string"==typeof b?f(a.timeago.parse(b)):"number"==typeof b?f(new Date(b)):f(a.timeago.datetime(b))};var b=a.timeago;a.extend(a.timeago,{settings:{refreshMillis:6e4,allowFuture:!1,localeTitle:!1,cutoff:0,strings:{prefixAgo:null,prefixFromNow:null,suffixAgo:"ago",suffixFromNow:"from now",seconds:"less than a minute",minute:"a minute",minutes:"%d minutes",hour:"an hour",hours:"%d hours",day:"a day",days:"%d days",month:"a month",months:"%d months",year:"a year",years:"%d years",wordSeparator:" ",numbers:[]}},inWords:function(b){function k(d,e){var f=a.isFunction(d)?d(e,b):d,g=c.numbers&&c.numbers[e]||e;return f.replace(/%d/i,g)}var c=this.settings.strings,d=c.prefixAgo,e=c.suffixAgo;this.settings.allowFuture&&0>b&&(d=c.prefixFromNow,e=c.suffixFromNow);var f=Math.abs(b)/1e3,g=f/60,h=g/60,i=h/24,j=i/365,l=45>f&&k(c.seconds,Math.round(f))||90>f&&k(c.minute,1)||45>g&&k(c.minutes,Math.round(g))||90>g&&k(c.hour,1)||24>h&&k(c.hours,Math.round(h))||42>h&&k(c.day,1)||30>i&&k(c.days,Math.round(i))||45>i&&k(c.month,1)||365>i&&k(c.months,Math.round(i/30))||1.5>j&&k(c.year,1)||k(c.years,Math.round(j)),m=c.wordSeparator||"";return void 0===c.wordSeparator&&(m=" "),a.trim([d,l,e].join(m))},parse:function(b){var c=a.trim(b);return c=c.replace(/\.\d+/,""),c=c.replace(/-/,"/").replace(/-/,"/"),c=c.replace(/T/," ").replace(/Z/," UTC"),c=c.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"),new Date(c)},datetime:function(c){var d=b.isTime(c)?a(c).attr("datetime"):a(c).attr("title");return b.parse(d)},isTime:function(b){return"time"===a(b).get(0).tagName.toLowerCase()}});var c={init:function(){var c=a.proxy(d,this);c();var e=b.settings;e.refreshMillis>0&&setInterval(c,e.refreshMillis)},update:function(c){a(this).data("timeago",{datetime:b.parse(c)}),d.apply(this)},updateFromDOM:function(){a(this).data("timeago",{datetime:b.parse(b.isTime(this)?a(this).attr("datetime"):a(this).attr("title"))}),d.apply(this)}};a.fn.timeago=function(a,b){var d=a?c[a]:c.init;if(!d)throw new Error("Unknown function name '"+a+"' for timeago");return this.each(function(){d.call(this,b)}),this},document.createElement("abbr"),document.createElement("time")});


;// Source: src/js/vendor/jquery.validate-1.12.0.js
/*!
 * jQuery Validation Plugin 1.12.0pre
 *
 * http://jqueryvalidation.org//
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {
    // http://jqueryvalidation.org/validate/
    validate: function( options ) {

        // if nothing is selected, return nothing; can't chain anyway
        if ( !this.length ) {
            if ( options && options.debug && window.console ) {
                console.warn( "Nothing selected, can't validate, returning nothing." );
            }
            return;
        }

        // check if a validator for this form was already created
        var validator = $.data( this[0], "validator" );
        if ( validator ) {
            return validator;
        }

        // Add novalidate tag if HTML5.
        this.attr( "novalidate", "novalidate" );

        validator = new $.validator( options, this[0] );
        $.data( this[0], "validator", validator );

        if ( validator.settings.onsubmit ) {

            this.validateDelegate( ":submit", "click", function( event ) {
                if ( validator.settings.submitHandler ) {
                    validator.submitButton = event.target;
                }
                // allow suppressing validation by adding a cancel class to the submit button
                if ( $(event.target).hasClass("cancel") ) {
                    validator.cancelSubmit = true;
                }

                // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                if ( $(event.target).attr("formnovalidate") !== undefined ) {
                    validator.cancelSubmit = true;
                }
            });

            // validate the form on submit
            this.submit( function( event ) {
                if ( validator.settings.debug ) {
                    // prevent form submit to be able to see console output
                    event.preventDefault();
                }
                function handle() {
                    var hidden;
                    if ( validator.settings.submitHandler ) {
                        if ( validator.submitButton ) {
                            // insert a hidden input as a replacement for the missing submit button
                            hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val( $(validator.submitButton).val() ).appendTo(validator.currentForm);
                        }
                        validator.settings.submitHandler.call( validator, validator.currentForm, event );
                        if ( validator.submitButton ) {
                            // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                            hidden.remove();
                        }
                        return false;
                    }
                    return true;
                }

                // prevent submit for invalid forms or custom submit handlers
                if ( validator.cancelSubmit ) {
                    validator.cancelSubmit = false;
                    return handle();
                }
                if ( validator.form() ) {
                    if ( validator.pendingRequest ) {
                        validator.formSubmitted = true;
                        return false;
                    }
                    return handle();
                } else {
                    validator.focusInvalid();
                    return false;
                }
            });
        }

        return validator;
    },
    // http://jqueryvalidation.org/valid/
    valid: function() {
        if ( $(this[0]).is("form")) {
            return this.validate().form();
        } else {
            var valid = true;
            var validator = $(this[0].form).validate();
            this.each(function() {
                valid = validator.element(this) && valid;
            });
            return valid;
        }
    },
    // attributes: space separated list of attributes to retrieve and remove
    removeAttrs: function( attributes ) {
        var result = {},
            $element = this;
        $.each(attributes.split(/\s/), function( index, value ) {
            result[value] = $element.attr(value);
            $element.removeAttr(value);
        });
        return result;
    },
    // http://jqueryvalidation.org/rules/
    rules: function( command, argument ) {
        var element = this[0];

        if ( command ) {
            var settings = $.data(element.form, "validator").settings;
            var staticRules = settings.rules;
            var existingRules = $.validator.staticRules(element);
            switch(command) {
            case "add":
                $.extend(existingRules, $.validator.normalizeRule(argument));
                // remove messages from rules, but allow them to be set separetely
                delete existingRules.messages;
                staticRules[element.name] = existingRules;
                if ( argument.messages ) {
                    settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
                }
                break;
            case "remove":
                if ( !argument ) {
                    delete staticRules[element.name];
                    return existingRules;
                }
                var filtered = {};
                $.each(argument.split(/\s/), function( index, method ) {
                    filtered[method] = existingRules[method];
                    delete existingRules[method];
                });
                return filtered;
            }
        }

        var data = $.validator.normalizeRules(
        $.extend(
            {},
            $.validator.classRules(element),
            $.validator.attributeRules(element),
            $.validator.dataRules(element),
            $.validator.staticRules(element)
        ), element);

        // make sure required is at front
        if ( data.required ) {
            var param = data.required;
            delete data.required;
            data = $.extend({required: param}, data);
        }

        return data;
    }
});

// Custom selectors
$.extend($.expr[":"], {
    // http://jqueryvalidation.org/blank-selector/
    blank: function( a ) { return !$.trim("" + $(a).val()); },
    // http://jqueryvalidation.org/filled-selector/
    filled: function( a ) { return !!$.trim("" + $(a).val()); },
    // http://jqueryvalidation.org/unchecked-selector/
    unchecked: function( a ) { return !$(a).prop("checked"); }
});

// constructor for validator
$.validator = function( options, form ) {
    this.settings = $.extend( true, {}, $.validator.defaults, options );
    this.currentForm = form;
    this.init();
};

// http://jqueryvalidation.org/jQuery.validator.format/
$.validator.format = function( source, params ) {
    if ( arguments.length === 1 ) {
        return function() {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.validator.format.apply( this, args );
        };
    }
    if ( arguments.length > 2 && params.constructor !== Array  ) {
        params = $.makeArray(arguments).slice(1);
    }
    if ( params.constructor !== Array ) {
        params = [ params ];
    }
    $.each(params, function( i, n ) {
        source = source.replace( new RegExp("\\{" + i + "\\}", "g"), function() {
            return n;
        });
    });
    return source;
};

$.extend($.validator, {

    defaults: {
        messages: {},
        groups: {},
        rules: {},
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusInvalid: true,
        errorContainer: $([]),
        errorLabelContainer: $([]),
        onsubmit: true,
        ignore: ":hidden",
        ignoreTitle: false,
        onfocusin: function( element, event ) {
            this.lastActive = element;

            // hide error label and remove error class on focus if enabled
            if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
                if ( this.settings.unhighlight ) {
                    this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
                }
                this.addWrapper(this.errorsFor(element)).hide();
            }
        },
        onfocusout: function( element, event ) {
            if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
                this.element(element);
            }
        },
        onkeyup: function( element, event ) {
            if ( event.which === 9 && this.elementValue(element) === "" ) {
                return;
            } else if ( element.name in this.submitted || element === this.lastElement ) {
                this.element(element);
            }
        },
        onclick: function( element, event ) {
            // click on selects, radiobuttons and checkboxes
            if ( element.name in this.submitted ) {
                this.element(element);
            }
            // or option elements, check parent select in that case
            else if ( element.parentNode.name in this.submitted ) {
                this.element(element.parentNode);
            }
        },
        highlight: function( element, errorClass, validClass ) {
            if ( element.type === "radio" ) {
                this.findByName(element.name).addClass(errorClass).removeClass(validClass);
            } else {
                $(element).addClass(errorClass).removeClass(validClass);
            }
        },
        unhighlight: function( element, errorClass, validClass ) {
            if ( element.type === "radio" ) {
                this.findByName(element.name).removeClass(errorClass).addClass(validClass);
            } else {
                $(element).removeClass(errorClass).addClass(validClass);
            }
        }
    },

    // http://jqueryvalidation.org/jQuery.validator.setDefaults/
    setDefaults: function( settings ) {
        $.extend( $.validator.defaults, settings );
    },

    messages: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        creditcard: "Please enter a valid credit card number.",
        equalTo: "Please enter the same value again.",
        maxlength: $.validator.format("Please enter no more than {0} characters."),
        minlength: $.validator.format("Please enter at least {0} characters."),
        rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
        range: $.validator.format("Please enter a value between {0} and {1}."),
        max: $.validator.format("Please enter a value less than or equal to {0}."),
        min: $.validator.format("Please enter a value greater than or equal to {0}.")
    },

    autoCreateRanges: false,

    prototype: {

        init: function() {
            this.labelContainer = $(this.settings.errorLabelContainer);
            this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
            this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
            this.submitted = {};
            this.valueCache = {};
            this.pendingRequest = 0;
            this.pending = {};
            this.invalid = {};
            this.reset();

            var groups = (this.groups = {});
            $.each(this.settings.groups, function( key, value ) {
                if ( typeof value === "string" ) {
                    value = value.split(/\s/);
                }
                $.each(value, function( index, name ) {
                    groups[name] = key;
                });
            });
            var rules = this.settings.rules;
            $.each(rules, function( key, value ) {
                rules[key] = $.validator.normalizeRule(value);
            });

            function delegate(event) {
                var validator = $.data(this[0].form, "validator"),
                    eventType = "on" + event.type.replace(/^validate/, "");
                if ( validator.settings[eventType] ) {
                    validator.settings[eventType].call(validator, this[0], event);
                }
            }
            $(this.currentForm)
                .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                    "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                    "[type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], " +
                    "[type='range'], [type='color'] ",
                    "focusin focusout keyup", delegate)
                .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

            if ( this.settings.invalidHandler ) {
                $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            }
        },

        // http://jqueryvalidation.org/Validator.form/
        form: function() {
            this.checkForm();
            $.extend(this.submitted, this.errorMap);
            this.invalid = $.extend({}, this.errorMap);
            if ( !this.valid() ) {
                $(this.currentForm).triggerHandler("invalid-form", [this]);
            }
            this.showErrors();
            return this.valid();
        },

        checkForm: function() {
            this.prepareForm();
            for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
                this.check( elements[i] );
            }
            return this.valid();
        },

        // http://jqueryvalidation.org/Validator.element/
        element: function( element ) {
            element = this.validationTargetFor( this.clean( element ) );
            this.lastElement = element;
            this.prepareElement( element );
            this.currentElements = $(element);
            var result = this.check( element ) !== false;
            if ( result ) {
                delete this.invalid[element.name];
            } else {
                this.invalid[element.name] = true;
            }
            if ( !this.numberOfInvalids() ) {
                // Hide error containers on last error
                this.toHide = this.toHide.add( this.containers );
            }
            this.showErrors();
            return result;
        },

        // http://jqueryvalidation.org/Validator.showErrors/
        showErrors: function( errors ) {
            if ( errors ) {
                // add items to error list and map
                $.extend( this.errorMap, errors );
                this.errorList = [];
                for ( var name in errors ) {
                    this.errorList.push({
                        message: errors[name],
                        element: this.findByName(name)[0]
                    });
                }
                // remove items from success list
                this.successList = $.grep( this.successList, function( element ) {
                    return !(element.name in errors);
                });
            }
            if ( this.settings.showErrors ) {
                this.settings.showErrors.call( this, this.errorMap, this.errorList );
            } else {
                this.defaultShowErrors();
            }
        },

        // http://jqueryvalidation.org/Validator.resetForm/
        resetForm: function() {
            if ( $.fn.resetForm ) {
                $(this.currentForm).resetForm();
            }
            this.submitted = {};
            this.lastElement = null;
            this.prepareForm();
            this.hideErrors();
            this.elements().removeClass( this.settings.errorClass ).removeData( "previousValue" );
        },

        numberOfInvalids: function() {
            return this.objectLength(this.invalid);
        },

        objectLength: function( obj ) {
            var count = 0;
            for ( var i in obj ) {
                count++;
            }
            return count;
        },

        hideErrors: function() {
            this.addWrapper( this.toHide ).hide();
        },

        valid: function() {
            return this.size() === 0;
        },

        size: function() {
            return this.errorList.length;
        },

        focusInvalid: function() {
            if ( this.settings.focusInvalid ) {
                try {
                    $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                    .filter(":visible")
                    .focus()
                    // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                    .trigger("focusin");
                } catch(e) {
                    // ignore IE throwing errors when focusing hidden elements
                }
            }
        },

        findLastActive: function() {
            var lastActive = this.lastActive;
            return lastActive && $.grep(this.errorList, function( n ) {
                return n.element.name === lastActive.name;
            }).length === 1 && lastActive;
        },

        elements: function() {
            var validator = this,
                rulesCache = {};

            // select all valid inputs inside the form (no submit or reset buttons)
            return $(this.currentForm)
            .find("input, select, textarea")
            .not(":submit, :reset, :image, [disabled]")
            .not( this.settings.ignore )
            .filter(function() {
                if ( !this.name && validator.settings.debug && window.console ) {
                    console.error( "%o has no name assigned", this);
                }

                // select only the first element for each name, and only those with rules specified
                if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
                    return false;
                }

                rulesCache[this.name] = true;
                return true;
            });
        },

        clean: function( selector ) {
            return $(selector)[0];
        },

        errors: function() {
            var errorClass = this.settings.errorClass.replace(" ", ".");
            return $(this.settings.errorElement + "." + errorClass, this.errorContext);
        },

        reset: function() {
            this.successList = [];
            this.errorList = [];
            this.errorMap = {};
            this.toShow = $([]);
            this.toHide = $([]);
            this.currentElements = $([]);
        },

        prepareForm: function() {
            this.reset();
            this.toHide = this.errors().add( this.containers );
        },

        prepareElement: function( element ) {
            this.reset();
            this.toHide = this.errorsFor(element);
        },

        elementValue: function( element ) {
            var type = $(element).attr("type"),
                val = $(element).val();

            if ( type === "radio" || type === "checkbox" ) {
                return $("input[name='" + $(element).attr("name") + "']:checked").val();
            }

            if ( typeof val === "string" ) {
                return val.replace(/\r/g, "");
            }
            return val;
        },

        check: function( element ) {
            element = this.validationTargetFor( this.clean( element ) );

            var rules = $(element).rules();
            var dependencyMismatch = false;
            var val = this.elementValue(element);
            var result;

            for (var method in rules ) {
                var rule = { method: method, parameters: rules[method] };
                try {

                    result = $.validator.methods[method].call( this, val, element, rule.parameters );

                    // if a method indicates that the field is optional and therefore valid,
                    // don't mark it as valid when there are no other rules
                    if ( result === "dependency-mismatch" ) {
                        dependencyMismatch = true;
                        continue;
                    }
                    dependencyMismatch = false;

                    if ( result === "pending" ) {
                        this.toHide = this.toHide.not( this.errorsFor(element) );
                        return;
                    }

                    if ( !result ) {
                        this.formatAndAdd( element, rule );
                        return false;
                    }
                } catch(e) {
                    if ( this.settings.debug && window.console ) {
                        console.log( "Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e );
                    }
                    throw e;
                }
            }
            if ( dependencyMismatch ) {
                return;
            }
            if ( this.objectLength(rules) ) {
                this.successList.push(element);
            }
            return true;
        },

        // return the custom message for the given element and validation method
        // specified in the element's HTML5 data attribute
        customDataMessage: function( element, method ) {
            return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
        },

        // return the custom message for the given element name and validation method
        customMessage: function( name, method ) {
            var m = this.settings.messages[name];
            return m && (m.constructor === String ? m : m[method]);
        },

        // return the first defined argument, allowing empty strings
        findDefined: function() {
            for(var i = 0; i < arguments.length; i++) {
                if ( arguments[i] !== undefined ) {
                    return arguments[i];
                }
            }
            return undefined;
        },

        defaultMessage: function( element, method ) {
            return this.findDefined(
                this.customMessage( element.name, method ),
                this.customDataMessage( element, method ),
                // title is never undefined, so handle empty string as undefined
                !this.settings.ignoreTitle && element.title || undefined,
                $.validator.messages[method],
                "<strong>Warning: No message defined for " + element.name + "</strong>"
            );
        },

        formatAndAdd: function( element, rule ) {
            var message = this.defaultMessage( element, rule.method ),
                theregex = /\$?\{(\d+)\}/g;
            if ( typeof message === "function" ) {
                message = message.call(this, rule.parameters, element);
            } else if (theregex.test(message)) {
                message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
            }
            this.errorList.push({
                message: message,
                element: element
            });

            this.errorMap[element.name] = message;
            this.submitted[element.name] = message;
        },

        addWrapper: function( toToggle ) {
            if ( this.settings.wrapper ) {
                toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
            }
            return toToggle;
        },

        defaultShowErrors: function() {
            var i, elements;
            for ( i = 0; this.errorList[i]; i++ ) {
                var error = this.errorList[i];
                if ( this.settings.highlight ) {
                    this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
                }
                this.showLabel( error.element, error.message );
            }
            if ( this.errorList.length ) {
                this.toShow = this.toShow.add( this.containers );
            }
            if ( this.settings.success ) {
                for ( i = 0; this.successList[i]; i++ ) {
                    this.showLabel( this.successList[i] );
                }
            }
            if ( this.settings.unhighlight ) {
                for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
                    this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
                }
            }
            this.toHide = this.toHide.not( this.toShow );
            this.hideErrors();
            this.addWrapper( this.toShow ).show();
        },

        validElements: function() {
            return this.currentElements.not(this.invalidElements());
        },

        invalidElements: function() {
            return $(this.errorList).map(function() {
                return this.element;
            });
        },

        showLabel: function( element, message ) {
            var label = this.errorsFor( element );
            if ( label.length ) {
                // refresh error/success class
                label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
                // replace message on existing label
                label.html(message);
            } else {
                // create label
                label = $("<" + this.settings.errorElement + ">")
                    .attr("for", this.idOrName(element))
                    .addClass(this.settings.errorClass)
                    .html(message || "");
                if ( this.settings.wrapper ) {
                    // make sure the element is visible, even in IE
                    // actually showing the wrapped element is handled elsewhere
                    label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                }
                if ( !this.labelContainer.append(label).length ) {
                    if ( this.settings.errorPlacement ) {
                        this.settings.errorPlacement(label, $(element) );
                    } else {
                        label.insertAfter(element);
                    }
                }
            }
            if ( !message && this.settings.success ) {
                label.text("");
                if ( typeof this.settings.success === "string" ) {
                    label.addClass( this.settings.success );
                } else {
                    this.settings.success( label, element );
                }
            }
            this.toShow = this.toShow.add(label);
        },

        errorsFor: function( element ) {
            var name = this.idOrName(element);
            return this.errors().filter(function() {
                return $(this).attr("for") === name;
            });
        },

        idOrName: function( element ) {
            return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
        },

        validationTargetFor: function( element ) {
            // if radio/checkbox, validate first element in group instead
            if ( this.checkable(element) ) {
                element = this.findByName( element.name ).not(this.settings.ignore)[0];
            }
            return element;
        },

        checkable: function( element ) {
            return (/radio|checkbox/i).test(element.type);
        },

        findByName: function( name ) {
            return $(this.currentForm).find("[name='" + name + "']");
        },

        getLength: function( value, element ) {
            switch( element.nodeName.toLowerCase() ) {
            case "select":
                return $("option:selected", element).length;
            case "input":
                if ( this.checkable( element) ) {
                    return this.findByName(element.name).filter(":checked").length;
                }
            }
            return value.length;
        },

        depend: function( param, element ) {
            return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
        },

        dependTypes: {
            "boolean": function( param, element ) {
                return param;
            },
            "string": function( param, element ) {
                return !!$(param, element.form).length;
            },
            "function": function( param, element ) {
                return param(element);
            }
        },

        optional: function( element ) {
            var val = this.elementValue(element);
            return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
        },

        startRequest: function( element ) {
            if ( !this.pending[element.name] ) {
                this.pendingRequest++;
                this.pending[element.name] = true;
            }
        },

        stopRequest: function( element, valid ) {
            this.pendingRequest--;
            // sometimes synchronization fails, make sure pendingRequest is never < 0
            if ( this.pendingRequest < 0 ) {
                this.pendingRequest = 0;
            }
            delete this.pending[element.name];
            if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
                $(this.currentForm).submit();
                this.formSubmitted = false;
            } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                $(this.currentForm).triggerHandler("invalid-form", [this]);
                this.formSubmitted = false;
            }
        },

        previousValue: function( element ) {
            return $.data(element, "previousValue") || $.data(element, "previousValue", {
                old: null,
                valid: true,
                message: this.defaultMessage( element, "remote" )
            });
        }

    },

    classRuleSettings: {
        required: {required: true},
        email: {email: true},
        url: {url: true},
        date: {date: true},
        dateISO: {dateISO: true},
        number: {number: true},
        digits: {digits: true},
        creditcard: {creditcard: true}
    },

    addClassRules: function( className, rules ) {
        if ( className.constructor === String ) {
            this.classRuleSettings[className] = rules;
        } else {
            $.extend(this.classRuleSettings, className);
        }
    },

    classRules: function( element ) {
        var rules = {};
        var classes = $(element).attr("class");
        if ( classes ) {
            $.each(classes.split(" "), function() {
                if ( this in $.validator.classRuleSettings ) {
                    $.extend(rules, $.validator.classRuleSettings[this]);
                }
            });
        }
        return rules;
    },

    attributeRules: function( element ) {
        var rules = {};
        var $element = $(element);
        var type = $element[0].getAttribute("type");

        for (var method in $.validator.methods) {
            var value;

            // support for <input required> in both html5 and older browsers
            if ( method === "required" ) {
                value = $element.get(0).getAttribute(method);
                // Some browsers return an empty string for the required attribute
                // and non-HTML5 browsers might have required="" markup
                if ( value === "" ) {
                    value = true;
                }
                // force non-HTML5 browsers to return bool
                value = !!value;
            } else {
                value = $element.attr(method);
            }

            // convert the value to a number for number inputs, and for text for backwards compability
            // allows type="date" and others to be compared as strings
            if ( /min|max/.test( method ) && ( type === null || /number|range|text/.test( type ) ) ) {
                value = Number(value);
            }

            if ( value ) {
                rules[method] = value;
            } else if ( type === method && type !== 'range' ) {
                // exception: the jquery validate 'range' method
                // does not test for the html5 'range' type
                rules[method] = true;
            }
        }

        // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
        if ( rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength) ) {
            delete rules.maxlength;
        }

        return rules;
    },

    dataRules: function( element ) {
        var method, value,
            rules = {}, $element = $(element);
        for (method in $.validator.methods) {
            value = $element.data("rule-" + method.toLowerCase());
            if ( value !== undefined ) {
                rules[method] = value;
            }
        }
        return rules;
    },

    staticRules: function( element ) {
        var rules = {};
        var validator = $.data(element.form, "validator");
        if ( validator.settings.rules ) {
            rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
        }
        return rules;
    },

    normalizeRules: function( rules, element ) {
        // handle dependency check
        $.each(rules, function( prop, val ) {
            // ignore rule when param is explicitly false, eg. required:false
            if ( val === false ) {
                delete rules[prop];
                return;
            }
            if ( val.param || val.depends ) {
                var keepRule = true;
                switch (typeof val.depends) {
                case "string":
                    keepRule = !!$(val.depends, element.form).length;
                    break;
                case "function":
                    keepRule = val.depends.call(element, element);
                    break;
                }
                if ( keepRule ) {
                    rules[prop] = val.param !== undefined ? val.param : true;
                } else {
                    delete rules[prop];
                }
            }
        });

        // evaluate parameters
        $.each(rules, function( rule, parameter ) {
            rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
        });

        // clean number parameters
        $.each(['minlength', 'maxlength'], function() {
            if ( rules[this] ) {
                rules[this] = Number(rules[this]);
            }
        });
        $.each(['rangelength', 'range'], function() {
            var parts;
            if ( rules[this] ) {
                if ( $.isArray(rules[this]) ) {
                    rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                } else if ( typeof rules[this] === "string" ) {
                    parts = rules[this].split(/[\s,]+/);
                    rules[this] = [Number(parts[0]), Number(parts[1])];
                }
            }
        });

        if ( $.validator.autoCreateRanges ) {
            // auto-create ranges
            if ( rules.min && rules.max ) {
                rules.range = [rules.min, rules.max];
                delete rules.min;
                delete rules.max;
            }
            if ( rules.minlength && rules.maxlength ) {
                rules.rangelength = [rules.minlength, rules.maxlength];
                delete rules.minlength;
                delete rules.maxlength;
            }
        }

        return rules;
    },

    // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
    normalizeRule: function( data ) {
        if ( typeof data === "string" ) {
            var transformed = {};
            $.each(data.split(/\s/), function() {
                transformed[this] = true;
            });
            data = transformed;
        }
        return data;
    },

    // http://jqueryvalidation.org/jQuery.validator.addMethod/
    addMethod: function( name, method, message ) {
        $.validator.methods[name] = method;
        $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
        if ( method.length < 3 ) {
            $.validator.addClassRules(name, $.validator.normalizeRule(name));
        }
    },

    methods: {

        // http://jqueryvalidation.org/required-method/
        required: function( value, element, param ) {
            // check if dependency is met
            if ( !this.depend(param, element) ) {
                return "dependency-mismatch";
            }
            if ( element.nodeName.toLowerCase() === "select" ) {
                // could be an array for select-multiple or a string, both are fine this way
                var val = $(element).val();
                return val && val.length > 0;
            }
            if ( this.checkable(element) ) {
                return this.getLength(value, element) > 0;
            }
            return $.trim(value).length > 0;
        },

        // http://jqueryvalidation.org/email-method/
        email: function( value, element ) {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
            return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
        },

        // http://jqueryvalidation.org/url-method/
        url: function( value, element ) {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
        },

        // http://jqueryvalidation.org/date-method/
        date: function( value, element ) {
            return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
        },

        // http://jqueryvalidation.org/dateISO-method/
        dateISO: function( value, element ) {
            return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
        },

        // http://jqueryvalidation.org/number-method/
        number: function( value, element ) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },

        // http://jqueryvalidation.org/digits-method/
        digits: function( value, element ) {
            return this.optional(element) || /^\d+$/.test(value);
        },

        // http://jqueryvalidation.org/creditcard-method/
        // based on http://en.wikipedia.org/wiki/Luhn/
        creditcard: function( value, element ) {
            if ( this.optional(element) ) {
                return "dependency-mismatch";
            }
            // accept only spaces, digits and dashes
            if ( /[^0-9 \-]+/.test(value) ) {
                return false;
            }
            var nCheck = 0,
                nDigit = 0,
                bEven = false;

            value = value.replace(/\D/g, "");

            // Basing min and max length on
            // http://developer.ean.com/general_info/Valid_Credit_Card_Types
            if ( value.length < 13 || value.length > 19 ) {
                return false;
            }

            for (var n = value.length - 1; n >= 0; n--) {
                var cDigit = value.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if ( bEven ) {
                    if ( (nDigit *= 2) > 9 ) {
                        nDigit -= 9;
                    }
                }
                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        },

        // http://jqueryvalidation.org/minlength-method/
        minlength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || length >= param;
        },

        // http://jqueryvalidation.org/maxlength-method/
        maxlength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || length <= param;
        },

        // http://jqueryvalidation.org/rangelength-method/
        rangelength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
            return this.optional(element) || ( length >= param[0] && length <= param[1] );
        },

        // http://jqueryvalidation.org/min-method/
        min: function( value, element, param ) {
            return this.optional(element) || value >= param;
        },

        // http://jqueryvalidation.org/max-method/
        max: function( value, element, param ) {
            return this.optional(element) || value <= param;
        },

        // http://jqueryvalidation.org/range-method/
        range: function( value, element, param ) {
            return this.optional(element) || ( value >= param[0] && value <= param[1] );
        },

        // http://jqueryvalidation.org/equalTo-method/
        equalTo: function( value, element, param ) {
            // bind to the blur event of the target in order to revalidate whenever the target field is updated
            // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
            var target = $(param);
            if ( this.settings.onfocusout ) {
                target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    $(element).valid();
                });
            }
            return value === target.val();
        },

        // http://jqueryvalidation.org/remote-method/
        remote: function( value, element, param ) {
            if ( this.optional(element) ) {
                return "dependency-mismatch";
            }

            var previous = this.previousValue(element);
            if (!this.settings.messages[element.name] ) {
                this.settings.messages[element.name] = {};
            }
            previous.originalMessage = this.settings.messages[element.name].remote;
            this.settings.messages[element.name].remote = previous.message;

            param = typeof param === "string" && {url:param} || param;

            if ( previous.old === value ) {
                return previous.valid;
            }

            previous.old = value;
            var validator = this;
            this.startRequest(element);
            var data = {};
            data[element.name] = value;
            $.ajax($.extend(true, {
                url: param,
                mode: "abort",
                port: "validate" + element.name,
                dataType: "json",
                data: data,
                success: function( response ) {
                    validator.settings.messages[element.name].remote = previous.originalMessage;
                    var valid = response === true || response === "true";
                    if ( valid ) {
                        var submitted = validator.formSubmitted;
                        validator.prepareElement(element);
                        validator.formSubmitted = submitted;
                        validator.successList.push(element);
                        delete validator.invalid[element.name];
                        validator.showErrors();
                    } else {
                        var errors = {};
                        var message = response || validator.defaultMessage( element, "remote" );
                        errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                        validator.invalid[element.name] = true;
                        validator.showErrors(errors);
                    }
                    previous.valid = valid;
                    validator.stopRequest(element, valid);
                }
            }, param));
            return "pending";
        }

    }

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

;// Source: src/js/vendor/jquery.validateDelegate.js
// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
        $.extend($.fn, {
                validateDelegate: function( delegate, type, handler ) {
                        return this.bind(type, function( event ) {
                                var target = $(event.target);
                                if ( target.is(delegate) ) {
                                        return handler.apply(target, arguments);
                                }
                        });
                }
        });
}(jQuery));/*
 */



;// Source: src/js/vendor/xregexp.js
/*!
 * XRegExp v2.0.0
 * (c) 2007-2012 Steven Levithan <http://xregexp.com/>
 * MIT License
 */

/**
 * XRegExp provides augmented, extensible JavaScript regular expressions. You get new syntax,
 * flags, and methods beyond what browsers support natively. XRegExp is also a regex utility belt
 * with tools to make your client-side grepping simpler and more powerful, while freeing you from
 * worrying about pesky cross-browser inconsistencies and the dubious `lastIndex` property. See
 * XRegExp's documentation (http://xregexp.com/) for more details.
 * @module xregexp
 * @requires N/A
 */
var XRegExp;

// Avoid running twice; that would reset tokens and could break references to native globals
XRegExp = XRegExp || (function (undef) {
/*--------------------------------------
 *  Private variables
 *------------------------------------*/

    var self,
        addToken,
        add,

// Optional features; can be installed and uninstalled
        features = {
            natives: false,
            extensibility: false
        },

// Store native methods to use and restore ("native" is an ES3 reserved keyword)
        nativ = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },

// Storage for fixed/extended native methods
        fixed = {},

// Storage for cached regexes
        cache = {},

// Storage for addon tokens
        tokens = [],

// Token scopes
        defaultScope = "default",
        classScope = "class",

// Regexes that match native regex syntax
        nativeTokens = {
            // Any native multicharacter token in default scope (includes octals, excludes character classes)
            "default": /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
            // Any native multicharacter token in character class scope (includes octals)
            "class": /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
        },

// Any backreference in replacement strings
        replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,

// Any character with a later instance in the string
        duplicateFlags = /([\s\S])(?=[\s\S]*\1)/g,

// Any greedy/lazy quantifier
        quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,

// Check for correct `exec` handling of nonparticipating capturing groups
        compliantExecNpcg = nativ.exec.call(/()??/, "")[1] === undef,

// Check for flag y support (Firefox 3+)
        hasNativeY = RegExp.prototype.sticky !== undef,

// Used to kill infinite recursion during XRegExp construction
        isInsideConstructor = false,

// Storage for known flags, including addon flags
        registeredFlags = "gim" + (hasNativeY ? "y" : "");

/*--------------------------------------
 *  Private helper functions
 *------------------------------------*/

/**
 * Attaches XRegExp.prototype properties and named capture supporting data to a regex object.
 * @private
 * @param {RegExp} regex Regex to augment.
 * @param {Array} captureNames Array with capture names, or null.
 * @param {Boolean} [isNative] Whether the regex was created by `RegExp` rather than `XRegExp`.
 * @returns {RegExp} Augmented regex.
 */
    function augment(regex, captureNames, isNative) {
        var p;
        // Can't auto-inherit these since the XRegExp constructor returns a nonprimitive value
        for (p in self.prototype) {
            if (self.prototype.hasOwnProperty(p)) {
                regex[p] = self.prototype[p];
            }
        }
        regex.xregexp = {captureNames: captureNames, isNative: !!isNative};
        return regex;
    }

/**
 * Returns native `RegExp` flags used by a regex object.
 * @private
 * @param {RegExp} regex Regex to check.
 * @returns {String} Native flags in use.
 */
    function getNativeFlags(regex) {
        //return nativ.exec.call(/\/([a-z]*)$/i, String(regex))[1];
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES6, included in AS3
               (regex.sticky     ? "y" : ""); // Proposed for ES6, included in Firefox 3+
    }

/**
 * Copies a regex object while preserving special properties for named capture and augmenting with
 * `XRegExp.prototype` methods. The copy has a fresh `lastIndex` property (set to zero). Allows
 * adding and removing flags while copying the regex.
 * @private
 * @param {RegExp} regex Regex to copy.
 * @param {String} [addFlags] Flags to be added while copying the regex.
 * @param {String} [removeFlags] Flags to be removed while copying the regex.
 * @returns {RegExp} Copy of the provided regex, possibly with modified flags.
 */
    function copy(regex, addFlags, removeFlags) {
        if (!self.isRegExp(regex)) {
            throw new TypeError("type RegExp expected");
        }
        var flags = nativ.replace.call(getNativeFlags(regex) + (addFlags || ""), duplicateFlags, "");
        if (removeFlags) {
            // Would need to escape `removeFlags` if this was public
            flags = nativ.replace.call(flags, new RegExp("[" + removeFlags + "]+", "g"), "");
        }
        if (regex.xregexp && !regex.xregexp.isNative) {
            // Compiling the current (rather than precompilation) source preserves the effects of nonnative source flags
            regex = augment(self(regex.source, flags),
                            regex.xregexp.captureNames ? regex.xregexp.captureNames.slice(0) : null);
        } else {
            // Augment with `XRegExp.prototype` methods, but use native `RegExp` (avoid searching for special tokens)
            regex = augment(new RegExp(regex.source, flags), null, true);
        }
        return regex;
    }

/*
 * Returns the last index at which a given value can be found in an array, or `-1` if it's not
 * present. The array is searched backwards.
 * @private
 * @param {Array} array Array to search.
 * @param {*} value Value to locate in the array.
 * @returns {Number} Last zero-based index at which the item is found, or -1.
 */
    function lastIndexOf(array, value) {
        var i = array.length;
        if (Array.prototype.lastIndexOf) {
            return array.lastIndexOf(value); // Use the native method if available
        }
        while (i--) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }

/**
 * Determines whether an object is of the specified type.
 * @private
 * @param {*} value Object to check.
 * @param {String} type Type to check for, in lowercase.
 * @returns {Boolean} Whether the object matches the type.
 */
    function isType(value, type) {
        return Object.prototype.toString.call(value).toLowerCase() === "[object " + type + "]";
    }

/**
 * Prepares an options object from the given value.
 * @private
 * @param {String|Object} value Value to convert to an options object.
 * @returns {Object} Options object.
 */
    function prepareOptions(value) {
        value = value || {};
        if (value === "all" || value.all) {
            value = {natives: true, extensibility: true};
        } else if (isType(value, "string")) {
            value = self.forEach(value, /[^\s,]+/, function (m) {
                this[m] = true;
            }, {});
        }
        return value;
    }

/**
 * Runs built-in/custom tokens in reverse insertion order, until a match is found.
 * @private
 * @param {String} pattern Original pattern from which an XRegExp object is being built.
 * @param {Number} pos Position to search for tokens within `pattern`.
 * @param {Number} scope Current regex scope.
 * @param {Object} context Context object assigned to token handler functions.
 * @returns {Object} Object with properties `output` (the substitution string returned by the
 *   successful token handler) and `match` (the token's match array), or null.
 */
    function runTokens(pattern, pos, scope, context) {
        var i = tokens.length,
            result = null,
            match,
            t;
        // Protect against constructing XRegExps within token handler and trigger functions
        isInsideConstructor = true;
        // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
        try {
            while (i--) { // Run in reverse order
                t = tokens[i];
                if ((t.scope === "all" || t.scope === scope) && (!t.trigger || t.trigger.call(context))) {
                    t.pattern.lastIndex = pos;
                    match = fixed.exec.call(t.pattern, pattern); // Fixed `exec` here allows use of named backreferences, etc.
                    if (match && match.index === pos) {
                        result = {
                            output: t.handler.call(context, match, scope),
                            match: match
                        };
                        break;
                    }
                }
            }
        } catch (err) {
            throw err;
        } finally {
            isInsideConstructor = false;
        }
        return result;
    }

/**
 * Enables or disables XRegExp syntax and flag extensibility.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setExtensibility(on) {
        self.addToken = addToken[on ? "on" : "off"];
        features.extensibility = on;
    }

/**
 * Enables or disables native method overrides.
 * @private
 * @param {Boolean} on `true` to enable; `false` to disable.
 */
    function setNatives(on) {
        RegExp.prototype.exec = (on ? fixed : nativ).exec;
        RegExp.prototype.test = (on ? fixed : nativ).test;
        String.prototype.match = (on ? fixed : nativ).match;
        String.prototype.replace = (on ? fixed : nativ).replace;
        String.prototype.split = (on ? fixed : nativ).split;
        features.natives = on;
    }

/*--------------------------------------
 *  Constructor
 *------------------------------------*/

/**
 * Creates an extended regular expression object for matching text with a pattern. Differs from a
 * native regular expression in that additional syntax and flags are supported. The returned object
 * is in fact a native `RegExp` and works with all native methods.
 * @class XRegExp
 * @constructor
 * @param {String|RegExp} pattern Regex pattern string, or an existing `RegExp` object to copy.
 * @param {String} [flags] Any combination of flags:
 *   <li>`g` - global
 *   <li>`i` - ignore case
 *   <li>`m` - multiline anchors
 *   <li>`n` - explicit capture
 *   <li>`s` - dot matches all (aka singleline)
 *   <li>`x` - free-spacing and line comments (aka extended)
 *   <li>`y` - sticky (Firefox 3+ only)
 *   Flags cannot be provided when constructing one `RegExp` from another.
 * @returns {RegExp} Extended regular expression object.
 * @example
 *
 * // With named capture and flag x
 * date = XRegExp('(?<year>  [0-9]{4}) -?  # year  \n\
 *                 (?<month> [0-9]{2}) -?  # month \n\
 *                 (?<day>   [0-9]{2})     # day   ', 'x');
 *
 * // Passing a regex object to copy it. The copy maintains special properties for named capture,
 * // is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property (set to
 * // zero). Native regexes are not recompiled using XRegExp syntax.
 * XRegExp(/regex/);
 */
    self = function (pattern, flags) {
        if (self.isRegExp(pattern)) {
            if (flags !== undef) {
                throw new TypeError("can't supply flags when constructing one RegExp from another");
            }
            return copy(pattern);
        }
        // Tokens become part of the regex construction process, so protect against infinite recursion
        // when an XRegExp is constructed within a token handler function
        if (isInsideConstructor) {
            throw new Error("can't call the XRegExp constructor within token definition functions");
        }

        var output = [],
            scope = defaultScope,
            tokenContext = {
                hasNamedCapture: false,
                captureNames: [],
                hasFlag: function (flag) {
                    return flags.indexOf(flag) > -1;
                }
            },
            pos = 0,
            tokenResult,
            match,
            chr;
        pattern = pattern === undef ? "" : String(pattern);
        flags = flags === undef ? "" : String(flags);

        if (nativ.match.call(flags, duplicateFlags)) { // Don't use test/exec because they would update lastIndex
            throw new SyntaxError("invalid duplicate regular expression flag");
        }
        // Strip/apply leading mode modifier with any combination of flags except g or y: (?imnsx)
        pattern = nativ.replace.call(pattern, /^\(\?([\w$]+)\)/, function ($0, $1) {
            if (nativ.test.call(/[gy]/, $1)) {
                throw new SyntaxError("can't use flag g or y in mode modifier");
            }
            flags = nativ.replace.call(flags + $1, duplicateFlags, "");
            return "";
        });
        self.forEach(flags, /[\s\S]/, function (m) {
            if (registeredFlags.indexOf(m[0]) < 0) {
                throw new SyntaxError("invalid regular expression flag " + m[0]);
            }
        });

        while (pos < pattern.length) {
            // Check for custom tokens at the current position
            tokenResult = runTokens(pattern, pos, scope, tokenContext);
            if (tokenResult) {
                output.push(tokenResult.output);
                pos += (tokenResult.match[0].length || 1);
            } else {
                // Check for native tokens (except character classes) at the current position
                match = nativ.exec.call(nativeTokens[scope], pattern.slice(pos));
                if (match) {
                    output.push(match[0]);
                    pos += match[0].length;
                } else {
                    chr = pattern.charAt(pos);
                    if (chr === "[") {
                        scope = classScope;
                    } else if (chr === "]") {
                        scope = defaultScope;
                    }
                    // Advance position by one character
                    output.push(chr);
                    ++pos;
                }
            }
        }

        return augment(new RegExp(output.join(""), nativ.replace.call(flags, /[^gimy]+/g, "")),
                       tokenContext.hasNamedCapture ? tokenContext.captureNames : null);
    };

/*--------------------------------------
 *  Public methods/properties
 *------------------------------------*/

// Installed and uninstalled states for `XRegExp.addToken`
    addToken = {
        on: function (regex, handler, options) {
            options = options || {};
            if (regex) {
                tokens.push({
                    pattern: copy(regex, "g" + (hasNativeY ? "y" : "")),
                    handler: handler,
                    scope: options.scope || defaultScope,
                    trigger: options.trigger || null
                });
            }
            // Providing `customFlags` with null `regex` and `handler` allows adding flags that do
            // nothing, but don't throw an error
            if (options.customFlags) {
                registeredFlags = nativ.replace.call(registeredFlags + options.customFlags, duplicateFlags, "");
            }
        },
        off: function () {
            throw new Error("extensibility must be installed before using addToken");
        }
    };

/**
 * Extends or changes XRegExp syntax and allows custom flags. This is used internally and can be
 * used to create XRegExp addons. `XRegExp.install('extensibility')` must be run before calling
 * this function, or an error is thrown. If more than one token can match the same string, the last
 * added wins.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex object that matches the new token.
 * @param {Function} handler Function that returns a new pattern string (using native regex syntax)
 *   to replace the matched token within all future XRegExp regexes. Has access to persistent
 *   properties of the regex being built, through `this`. Invoked with two arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The regex scope where the match was found.
 * @param {Object} [options] Options object with optional properties:
 *   <li>`scope` {String} Scopes where the token applies: 'default', 'class', or 'all'.
 *   <li>`trigger` {Function} Function that returns `true` when the token should be applied; e.g.,
 *     if a flag is set. If `false` is returned, the matched string can be matched by other tokens.
 *     Has access to persistent properties of the regex being built, through `this` (including
 *     function `this.hasFlag`).
 *   <li>`customFlags` {String} Nonnative flags used by the token's handler or trigger functions.
 *     Prevents XRegExp from throwing an invalid flag error when the specified flags are used.
 * @example
 *
 * // Basic usage: Adds \a for ALERT character
 * XRegExp.addToken(
 *   /\\a/,
 *   function () {return '\\x07';},
 *   {scope: 'all'}
 * );
 * XRegExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
 */
    self.addToken = addToken.off;

/**
 * Caches and returns the result of calling `XRegExp(pattern, flags)`. On any subsequent call with
 * the same pattern and flag combination, the cached copy is returned.
 * @memberOf XRegExp
 * @param {String} pattern Regex pattern string.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Cached XRegExp object.
 * @example
 *
 * while (match = XRegExp.cache('.', 'gs').exec(str)) {
 *   // The regex is compiled once only
 * }
 */
    self.cache = function (pattern, flags) {
        var key = pattern + "/" + (flags || "");
        return cache[key] || (cache[key] = self(pattern, flags));
    };

/**
 * Escapes any regular expression metacharacters, for use when matching literal strings. The result
 * can safely be used at any point within a regex that uses any flags.
 * @memberOf XRegExp
 * @param {String} str String to escape.
 * @returns {String} String with regex metacharacters escaped.
 * @example
 *
 * XRegExp.escape('Escaped? <.>');
 * // -> 'Escaped\?\ <\.>'
 */
    self.escape = function (str) {
        return nativ.replace.call(str, /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

/**
 * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
 * regex uses named capture, named backreference properties are included on the match array.
 * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
 * must start at the specified position only. The `lastIndex` property of the provided regex is not
 * used, but is updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.exec` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Array} Match array with named backreference properties, or null.
 * @example
 *
 * // Basic use, with named backreference
 * var match = XRegExp.exec('U+2620', XRegExp('U\\+(?<hex>[0-9A-F]{4})'));
 * match.hex; // -> '2620'
 *
 * // With pos and sticky, in a loop
 * var pos = 2, result = [], match;
 * while (match = XRegExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
 *   result.push(match[1]);
 *   pos = match.index + match[0].length;
 * }
 * // result -> ['2', '3', '4']
 */
    self.exec = function (str, regex, pos, sticky) {
        var r2 = copy(regex, "g" + (sticky && hasNativeY ? "y" : ""), (sticky === false ? "y" : "")),
            match;
        r2.lastIndex = pos = pos || 0;
        match = fixed.exec.call(r2, str); // Fixed `exec` required for `lastIndex` fix, etc.
        if (sticky && match && match.index !== pos) {
            match = null;
        }
        if (regex.global) {
            regex.lastIndex = match ? r2.lastIndex : 0;
        }
        return match;
    };

/**
 * Executes a provided function once per regex match.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Function} callback Function to execute for each match. Invoked with four arguments:
 *   <li>The match array, with named backreference properties.
 *   <li>The zero-based match index.
 *   <li>The string being traversed.
 *   <li>The regex object being used to traverse the string.
 * @param {*} [context] Object to use as `this` when executing `callback`.
 * @returns {*} Provided `context` object.
 * @example
 *
 * // Extracts every other digit from a string
 * XRegExp.forEach('1a2345', /\d/, function (match, i) {
 *   if (i % 2) this.push(+match[0]);
 * }, []);
 * // -> [2, 4]
 */
    self.forEach = function (str, regex, callback, context) {
        var pos = 0,
            i = -1,
            match;
        while ((match = self.exec(str, regex, pos))) {
            callback.call(context, match, ++i, str, regex);
            pos = match.index + (match[0].length || 1);
        }
        return context;
    };

/**
 * Copies a regex object and adds flag `g`. The copy maintains special properties for named
 * capture, is augmented with `XRegExp.prototype` methods, and has a fresh `lastIndex` property
 * (set to zero). Native regexes are not recompiled using XRegExp syntax.
 * @memberOf XRegExp
 * @param {RegExp} regex Regex to globalize.
 * @returns {RegExp} Copy of the provided regex with flag `g` added.
 * @example
 *
 * var globalCopy = XRegExp.globalize(/regex/);
 * globalCopy.global; // -> true
 */
    self.globalize = function (regex) {
        return copy(regex, "g");
    };

/**
 * Installs optional features according to the specified options.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.install({
 *   // Overrides native regex methods with fixed/extended versions that support named
 *   // backreferences and fix numerous cross-browser bugs
 *   natives: true,
 *
 *   // Enables extensibility of XRegExp syntax and flags
 *   extensibility: true
 * });
 *
 * // With an options string
 * XRegExp.install('natives extensibility');
 *
 * // Using a shortcut to install all optional features
 * XRegExp.install('all');
 */
    self.install = function (options) {
        options = prepareOptions(options);
        if (!features.natives && options.natives) {
            setNatives(true);
        }
        if (!features.extensibility && options.extensibility) {
            setExtensibility(true);
        }
    };

/**
 * Checks whether an individual optional feature is installed.
 * @memberOf XRegExp
 * @param {String} feature Name of the feature to check. One of:
 *   <li>`natives`
 *   <li>`extensibility`
 * @returns {Boolean} Whether the feature is installed.
 * @example
 *
 * XRegExp.isInstalled('natives');
 */
    self.isInstalled = function (feature) {
        return !!(features[feature]);
    };

/**
 * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
 * created in another frame, when `instanceof` and `constructor` checks would fail.
 * @memberOf XRegExp
 * @param {*} value Object to check.
 * @returns {Boolean} Whether the object is a `RegExp` object.
 * @example
 *
 * XRegExp.isRegExp('string'); // -> false
 * XRegExp.isRegExp(/regex/i); // -> true
 * XRegExp.isRegExp(RegExp('^', 'm')); // -> true
 * XRegExp.isRegExp(XRegExp('(?s).')); // -> true
 */
    self.isRegExp = function (value) {
        return isType(value, "regexp");
    };

/**
 * Retrieves the matches from searching a string using a chain of regexes that successively search
 * within previous matches. The provided `chain` array can contain regexes and objects with `regex`
 * and `backref` properties. When a backreference is specified, the named or numbered backreference
 * is passed forward to the next regex or returned.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {Array} chain Regexes that each search for matches within preceding results.
 * @returns {Array} Matches by the last regex in the chain, or an empty array.
 * @example
 *
 * // Basic usage; matches numbers within <b> tags
 * XRegExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
 *   XRegExp('(?is)<b>.*?</b>'),
 *   /\d+/
 * ]);
 * // -> ['2', '4', '56']
 *
 * // Passing forward and returning specific backreferences
 * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
 *         <a href="http://www.google.com/">Google</a>';
 * XRegExp.matchChain(html, [
 *   {regex: /<a href="([^"]+)">/i, backref: 1},
 *   {regex: XRegExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
 * ]);
 * // -> ['xregexp.com', 'www.google.com']
 */
    self.matchChain = function (str, chain) {
        return (function recurseChain(values, level) {
            var item = chain[level].regex ? chain[level] : {regex: chain[level]},
                matches = [],
                addMatch = function (match) {
                    matches.push(item.backref ? (match[item.backref] || "") : match[0]);
                },
                i;
            for (i = 0; i < values.length; ++i) {
                self.forEach(values[i], item.regex, addMatch);
            }
            return ((level === chain.length - 1) || !matches.length) ?
                    matches :
                    recurseChain(matches, level + 1);
        }([str], 0));
    };

/**
 * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
 * or regex, and the replacement can be a string or a function to be called for each match. To
 * perform a global search and replace, use the optional `scope` argument or include flag `g` if
 * using a regex. Replacement strings can use `${n}` for named and numbered backreferences.
 * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
 * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 *   Replacement strings can include special replacement syntax:
 *     <li>$$ - Inserts a literal '$'.
 *     <li>$&, $0 - Inserts the matched substring.
 *     <li>$` - Inserts the string that precedes the matched substring (left context).
 *     <li>$' - Inserts the string that follows the matched substring (right context).
 *     <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
 *       backreference n/nn.
 *     <li>${n} - Where n is a name or any number of digits that reference an existent capturing
 *       group, inserts backreference n.
 *   Replacement functions are invoked with three or more arguments:
 *     <li>The matched substring (corresponds to $& above). Named backreferences are accessible as
 *       properties of this first argument.
 *     <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
 *     <li>The zero-based index of the match within the total search string.
 *     <li>The total string being searched.
 * @param {String} [scope='one'] Use 'one' to replace the first match only, or 'all'. If not
 *   explicitly specified and using a regex with flag `g`, `scope` is 'all'.
 * @returns {String} New string with one or all matches replaced.
 * @example
 *
 * // Regex search, using named backreferences in replacement string
 * var name = XRegExp('(?<first>\\w+) (?<last>\\w+)');
 * XRegExp.replace('John Smith', name, '${last}, ${first}');
 * // -> 'Smith, John'
 *
 * // Regex search, using named backreferences in replacement function
 * XRegExp.replace('John Smith', name, function (match) {
 *   return match.last + ', ' + match.first;
 * });
 * // -> 'Smith, John'
 *
 * // Global string search/replacement
 * XRegExp.replace('RegExp builds RegExps', 'RegExp', 'XRegExp', 'all');
 * // -> 'XRegExp builds XRegExps'
 */
    self.replace = function (str, search, replacement, scope) {
        var isRegex = self.isRegExp(search),
            search2 = search,
            result;
        if (isRegex) {
            if (scope === undef && search.global) {
                scope = "all"; // Follow flag g when `scope` isn't explicit
            }
            // Note that since a copy is used, `search`'s `lastIndex` isn't updated *during* replacement iterations
            search2 = copy(search, scope === "all" ? "g" : "", scope === "all" ? "" : "g");
        } else if (scope === "all") {
            search2 = new RegExp(self.escape(String(search)), "g");
        }
        result = fixed.replace.call(String(str), search2, replacement); // Fixed `replace` required for named backreferences, etc.
        if (isRegex && search.global) {
            search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
        }
        return result;
    };

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * XRegExp.split('a b c', ' ');
 * // -> ['a', 'b', 'c']
 *
 * // With limit
 * XRegExp.split('a b c', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * XRegExp.split('..word1..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', '..']
 */
    self.split = function (str, separator, limit) {
        return fixed.split.call(str, separator, limit);
    };

/**
 * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
 * `sticky` arguments specify the search start position, and whether the match must start at the
 * specified position only. The `lastIndex` property of the provided regex is not used, but is
 * updated for compatibility. Also fixes browser bugs compared to the native
 * `RegExp.prototype.test` and can be used reliably cross-browser.
 * @memberOf XRegExp
 * @param {String} str String to search.
 * @param {RegExp} regex Regex to search with.
 * @param {Number} [pos=0] Zero-based index at which to start the search.
 * @param {Boolean|String} [sticky=false] Whether the match must start at the specified position
 *   only. The string `'sticky'` is accepted as an alternative to `true`.
 * @returns {Boolean} Whether the regex matched the provided value.
 * @example
 *
 * // Basic use
 * XRegExp.test('abc', /c/); // -> true
 *
 * // With pos and sticky
 * XRegExp.test('abc', /c/, 0, 'sticky'); // -> false
 */
    self.test = function (str, regex, pos, sticky) {
        // Do this the easy way :-)
        return !!self.exec(str, regex, pos, sticky);
    };

/**
 * Uninstalls optional features according to the specified options.
 * @memberOf XRegExp
 * @param {Object|String} options Options object or string.
 * @example
 *
 * // With an options object
 * XRegExp.uninstall({
 *   // Restores native regex methods
 *   natives: true,
 *
 *   // Disables additional syntax and flag extensions
 *   extensibility: true
 * });
 *
 * // With an options string
 * XRegExp.uninstall('natives extensibility');
 *
 * // Using a shortcut to uninstall all optional features
 * XRegExp.uninstall('all');
 */
    self.uninstall = function (options) {
        options = prepareOptions(options);
        if (features.natives && options.natives) {
            setNatives(false);
        }
        if (features.extensibility && options.extensibility) {
            setExtensibility(false);
        }
    };

/**
 * Returns an XRegExp object that is the union of the given patterns. Patterns can be provided as
 * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
 * Backreferences in provided regex objects are automatically renumbered to work correctly. Native
 * flags used by provided regexes are ignored in favor of the `flags` argument.
 * @memberOf XRegExp
 * @param {Array} patterns Regexes and strings to combine.
 * @param {String} [flags] Any combination of XRegExp flags.
 * @returns {RegExp} Union of the provided regexes and strings.
 * @example
 *
 * XRegExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
 * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
 *
 * XRegExp.union([XRegExp('(?<pet>dogs)\\k<pet>'), XRegExp('(?<pet>cats)\\k<pet>')]);
 * // -> XRegExp('(?<pet>dogs)\\k<pet>|(?<pet>cats)\\k<pet>')
 */
    self.union = function (patterns, flags) {
        var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
            numCaptures = 0,
            numPriorCaptures,
            captureNames,
            rewrite = function (match, paren, backref) {
                var name = captureNames[numCaptures - numPriorCaptures];
                if (paren) { // Capturing group
                    ++numCaptures;
                    if (name) { // If the current capture has a name
                        return "(?<" + name + ">";
                    }
                } else if (backref) { // Backreference
                    return "\\" + (+backref + numPriorCaptures);
                }
                return match;
            },
            output = [],
            pattern,
            i;
        if (!(isType(patterns, "array") && patterns.length)) {
            throw new TypeError("patterns must be a nonempty array");
        }
        for (i = 0; i < patterns.length; ++i) {
            pattern = patterns[i];
            if (self.isRegExp(pattern)) {
                numPriorCaptures = numCaptures;
                captureNames = (pattern.xregexp && pattern.xregexp.captureNames) || [];
                // Rewrite backreferences. Passing to XRegExp dies on octals and ensures patterns
                // are independently valid; helps keep this simple. Named captures are put back
                output.push(self(pattern.source).source.replace(parts, rewrite));
            } else {
                output.push(self.escape(pattern));
            }
        }
        return self(output.join("|"), flags);
    };

/**
 * The XRegExp version number.
 * @static
 * @memberOf XRegExp
 * @type String
 */
    self.version = "2.0.0";

/*--------------------------------------
 *  Fixed/extended native methods
 *------------------------------------*/

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `RegExp.prototype.exec`. Calling `XRegExp.install('natives')` uses this to
 * override the native method. Use via `XRegExp.exec` without overriding natives.
 * @private
 * @param {String} str String to search.
 * @returns {Array} Match array with named backreference properties, or null.
 */
    fixed.exec = function (str) {
        var match, name, r2, origLastIndex, i;
        if (!this.global) {
            origLastIndex = this.lastIndex;
        }
        match = nativ.exec.apply(this, arguments);
        if (match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && lastIndexOf(match, "") > -1) {
                r2 = new RegExp(this.source, nativ.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                nativ.replace.call(String(str).slice(match.index), r2, function () {
                    var i;
                    for (i = 1; i < arguments.length - 2; ++i) {
                        if (arguments[i] === undef) {
                            match[i] = undef;
                        }
                    }
                });
            }
            // Attach named capture properties
            if (this.xregexp && this.xregexp.captureNames) {
                for (i = 1; i < match.length; ++i) {
                    name = this.xregexp.captureNames[i - 1];
                    if (name) {
                        match[name] = match[i];
                    }
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (this.global && !match[0].length && (this.lastIndex > match.index)) {
                this.lastIndex = match.index;
            }
        }
        if (!this.global) {
            this.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
        }
        return match;
    };

/**
 * Fixes browser bugs in the native `RegExp.prototype.test`. Calling `XRegExp.install('natives')`
 * uses this to override the native method.
 * @private
 * @param {String} str String to search.
 * @returns {Boolean} Whether the regex matched the provided value.
 */
    fixed.test = function (str) {
        // Do this the easy way :-)
        return !!fixed.exec.call(this, str);
    };

/**
 * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
 * bugs in the native `String.prototype.match`. Calling `XRegExp.install('natives')` uses this to
 * override the native method.
 * @private
 * @param {RegExp} regex Regex to search with.
 * @returns {Array} If `regex` uses flag g, an array of match strings or null. Without flag g, the
 *   result of calling `regex.exec(this)`.
 */
    fixed.match = function (regex) {
        if (!self.isRegExp(regex)) {
            regex = new RegExp(regex); // Use native `RegExp`
        } else if (regex.global) {
            var result = nativ.match.apply(this, arguments);
            regex.lastIndex = 0; // Fixes IE bug
            return result;
        }
        return fixed.exec.call(regex, this);
    };

/**
 * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
 * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes
 * browser bugs in replacement text syntax when performing a replacement using a nonregex search
 * value, and the value of a replacement regex's `lastIndex` property during replacement iterations
 * and upon completion. Note that this doesn't support SpiderMonkey's proprietary third (`flags`)
 * argument. Calling `XRegExp.install('natives')` uses this to override the native method. Use via
 * `XRegExp.replace` without overriding natives.
 * @private
 * @param {RegExp|String} search Search pattern to be replaced.
 * @param {String|Function} replacement Replacement string or a function invoked to create it.
 * @returns {String} New string with one or all matches replaced.
 */
    fixed.replace = function (search, replacement) {
        var isRegex = self.isRegExp(search), captureNames, result, str, origLastIndex;
        if (isRegex) {
            if (search.xregexp) {
                captureNames = search.xregexp.captureNames;
            }
            if (!search.global) {
                origLastIndex = search.lastIndex;
            }
        } else {
            search += "";
        }
        if (isType(replacement, "function")) {
            result = nativ.replace.call(String(this), search, function () {
                var args = arguments, i;
                if (captureNames) {
                    // Change the `arguments[0]` string primitive to a `String` object that can store properties
                    args[0] = new String(args[0]);
                    // Store named backreferences on the first argument
                    for (i = 0; i < captureNames.length; ++i) {
                        if (captureNames[i]) {
                            args[0][captureNames[i]] = args[i + 1];
                        }
                    }
                }
                // Update `lastIndex` before calling `replacement`.
                // Fixes IE, Chrome, Firefox, Safari bug (last tested IE 9, Chrome 17, Firefox 11, Safari 5.1)
                if (isRegex && search.global) {
                    search.lastIndex = args[args.length - 2] + args[0].length;
                }
                return replacement.apply(null, args);
            });
        } else {
            str = String(this); // Ensure `args[args.length - 1]` will be a string when given nonstring `this`
            result = nativ.replace.call(str, search, function () {
                var args = arguments; // Keep this function's `arguments` available through closure
                return nativ.replace.call(String(replacement), replacementToken, function ($0, $1, $2) {
                    var n;
                    // Named or numbered backreference with curly brackets
                    if ($1) {
                        /* XRegExp behavior for `${n}`:
                         * 1. Backreference to numbered capture, where `n` is 1+ digits. `0`, `00`, etc. is the entire match.
                         * 2. Backreference to named capture `n`, if it exists and is not a number overridden by numbered capture.
                         * 3. Otherwise, it's an error.
                         */
                        n = +$1; // Type-convert; drop leading zeros
                        if (n <= args.length - 3) {
                            return args[n] || "";
                        }
                        n = captureNames ? lastIndexOf(captureNames, $1) : -1;
                        if (n < 0) {
                            throw new SyntaxError("backreference to undefined group " + $0);
                        }
                        return args[n + 1] || "";
                    }
                    // Else, special variable or numbered backreference (without curly brackets)
                    if ($2 === "$") return "$";
                    if ($2 === "&" || +$2 === 0) return args[0]; // $&, $0 (not followed by 1-9), $00
                    if ($2 === "`") return args[args.length - 1].slice(0, args[args.length - 2]);
                    if ($2 === "'") return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
                    // Else, numbered backreference (without curly brackets)
                    $2 = +$2; // Type-convert; drop leading zero
                    /* XRegExp behavior:
                     * - Backreferences without curly brackets end after 1 or 2 digits. Use `${..}` for more digits.
                     * - `$1` is an error if there are no capturing groups.
                     * - `$10` is an error if there are less than 10 capturing groups. Use `${1}0` instead.
                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's an error.
                     * - `$0` (not followed by 1-9), `$00`, and `$&` are the entire match.
                     * Native behavior, for comparison:
                     * - Backreferences end after 1 or 2 digits. Cannot use backreference to capturing group 100+.
                     * - `$1` is a literal `$1` if there are no capturing groups.
                     * - `$10` is `$1` followed by a literal `0` if there are less than 10 capturing groups.
                     * - `$01` is equivalent to `$1` if a capturing group exists, otherwise it's a literal `$01`.
                     * - `$0` is a literal `$0`. `$&` is the entire match.
                     */
                    if (!isNaN($2)) {
                        if ($2 > args.length - 3) {
                            throw new SyntaxError("backreference to undefined group " + $0);
                        }
                        return args[$2] || "";
                    }
                    throw new SyntaxError("invalid token " + $0);
                });
            });
        }
        if (isRegex) {
            if (search.global) {
                search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
            } else {
                search.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
            }
        }
        return result;
    };

/**
 * Fixes browser bugs in the native `String.prototype.split`. Calling `XRegExp.install('natives')`
 * uses this to override the native method. Use via `XRegExp.split` without overriding natives.
 * @private
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 */
    fixed.split = function (separator, limit) {
        if (!self.isRegExp(separator)) {
            return nativ.split.apply(this, arguments); // use faster native method
        }
        var str = String(this),
            origLastIndex = separator.lastIndex,
            output = [],
            lastLastIndex = 0,
            lastLength;
        /* Values for `limit`, per the spec:
         * If undefined: pow(2,32) - 1
         * If 0, Infinity, or NaN: 0
         * If positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32);
         * If negative number: pow(2,32) - floor(abs(limit))
         * If other: Type-convert, then use the above rules
         */
        limit = (limit === undef ? -1 : limit) >>> 0;
        self.forEach(str, separator, function (match) {
            if ((match.index + match[0].length) > lastLastIndex) { // != `if (match[0].length)`
                output.push(str.slice(lastLastIndex, match.index));
                if (match.length > 1 && match.index < str.length) {
                    Array.prototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = match.index + lastLength;
            }
        });
        if (lastLastIndex === str.length) {
            if (!nativ.test.call(separator, "") || lastLength) {
                output.push("");
            }
        } else {
            output.push(str.slice(lastLastIndex));
        }
        separator.lastIndex = origLastIndex;
        return output.length > limit ? output.slice(0, limit) : output;
    };

/*--------------------------------------
 *  Built-in tokens
 *------------------------------------*/

// Shortcut
    add = addToken.on;

/* Letter identity escapes that natively match literal characters: \p, \P, etc.
 * Should be SyntaxErrors but are allowed in web reality. XRegExp makes them errors for cross-
 * browser consistency and to reserve their syntax, but lets them be superseded by XRegExp addons.
 */
    add(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/,
        function (match, scope) {
            // \B is allowed in default scope only
            if (match[1] === "B" && scope === defaultScope) {
                return match[0];
            }
            throw new SyntaxError("invalid escape " + match[0]);
        },
        {scope: "all"});

/* Empty character class: [] or [^]
 * Fixes a critical cross-browser syntax inconsistency. Unless this is standardized (per the spec),
 * regex syntax can't be accurately parsed because character class endings can't be determined.
 */
    add(/\[(\^?)]/,
        function (match) {
            // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
            // (?!) should work like \b\B, but is unreliable in Firefox
            return match[1] ? "[\\s\\S]" : "\\b\\B";
        });

/* Comment pattern: (?# )
 * Inline comments are an alternative to the line comments allowed in free-spacing mode (flag x).
 */
    add(/(?:\(\?#[^)]*\))+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        });

/* Named backreference: \k<name>
 * Backreference names can use the characters A-Z, a-z, 0-9, _, and $ only.
 */
    add(/\\k<([\w$]+)>/,
        function (match) {
            var index = isNaN(match[1]) ? (lastIndexOf(this.captureNames, match[1]) + 1) : +match[1],
                endIndex = match.index + match[0].length;
            if (!index || index > this.captureNames.length) {
                throw new SyntaxError("backreference to undefined group " + match[0]);
            }
            // Keep backreferences separate from subsequent literal numbers
            return "\\" + index + (
                endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? "" : "(?:)"
            );
        });

/* Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
 */
    add(/(?:\s+|#.*)+/,
        function (match) {
            // Keep tokens separated unless the following token is a quantifier
            return nativ.test.call(quantifier, match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
        },
        {
            trigger: function () {
                return this.hasFlag("x");
            },
            customFlags: "x"
        });

/* Dot, in dotall mode (aka singleline mode, flag s) only.
 */
    add(/\./,
        function () {
            return "[\\s\\S]";
        },
        {
            trigger: function () {
                return this.hasFlag("s");
            },
            customFlags: "s"
        });

/* Named capturing group; match the opening delimiter only: (?<name>
 * Capture names can use the characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers.
 * Supports Python-style (?P<name> as an alternate syntax to avoid issues in recent Opera (which
 * natively supports the Python-style syntax). Otherwise, XRegExp might treat numbered
 * backreferences to Python-style named capture as octals.
 */
    add(/\(\?P?<([\w$]+)>/,
        function (match) {
            if (!isNaN(match[1])) {
                // Avoid incorrect lookups, since named backreferences are added to match arrays
                throw new SyntaxError("can't use integer as capture name " + match[0]);
            }
            this.captureNames.push(match[1]);
            this.hasNamedCapture = true;
            return "(";
        });

/* Numbered backreference or octal, plus any following digits: \0, \11, etc.
 * Octals except \0 not followed by 0-9 and backreferences to unopened capture groups throw an
 * error. Other matches are returned unaltered. IE <= 8 doesn't support backreferences greater than
 * \99 in regex syntax.
 */
    add(/\\(\d+)/,
        function (match, scope) {
            if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) &&
                    match[1] !== "0") {
                throw new SyntaxError("can't use octal escape or backreference to undefined group " + match[0]);
            }
            return match[0];
        },
        {scope: "all"});

/* Capturing group; match the opening parenthesis only.
 * Required for support of named capturing groups. Also adds explicit capture mode (flag n).
 */
    add(/\((?!\?)/,
        function () {
            if (this.hasFlag("n")) {
                return "(?:";
            }
            this.captureNames.push(null);
            return "(";
        },
        {customFlags: "n"});

/*--------------------------------------
 *  Expose XRegExp
 *------------------------------------*/

// For CommonJS enviroments
    if (typeof exports !== "undefined") {
        exports.XRegExp = self;
    }

    return self;

}());

