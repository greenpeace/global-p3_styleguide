/**!
 * Social Private Sharing for Greenpeace Action Template v0.3
 *
 * @fileOverview    Enables social sharing without compromising privacy,
 *                  Obtains share counts from JSON endpoint
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.1.2
 * @author          Ray Walker <hello@raywalker.it>
 * @requires        <a href="http://jquery.com/">jQuery 1.6+</a>,
 *                  <a href="http://modernizr.com/">Modernizr</a>,
 * @example         $.p3.social_sharing('#action-social-share'[, options]);
 */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, jquery:true, indent:4, maxerr:50 */
/*global jQuery, Modernizr */

(function($, M, w) {
    'use strict';

    var _p3 = $.p3 || {},
        defaults = {
            pageURL: false,
            popup: {
                top: 200,
                left: 100,
                width: 550,
                height: 350
            },
            networks: {
                facebook: {
                    enabled: true,
                    url: 'http://www.facebook.com/sharer.php?u=__REFERRER__',
                    count: 0
                },
                twitter: {
                    enabled: true,
                    url: 'https://twitter.com/intent/tweet?original_referer=__REFERRER__&source=tweetbutton&text=__TITLE__&url=__REFERRER__&via=__ACCOUNT__',
                    count: 0,
                    title: false,
                    account: 'greenpeace'
                },
                google: {
                    enabled: true,
                    url: 'https://plus.google.com/share?url=__REFERRER__',
                    count: 0
                },
                linkedin: {
                    enabled: true,
                    url: 'https://www.linkedin.com/cws/share?url=__REFERRER__&original_referer=__REFERRER__',
                    count: 0
                },
                pinterest: {
                    enabled: true,
                    url: 'http://pinterest.com/pin/create/button/?url=__REFERRER__&media=__IMAGE__&description=__DESCRIPTION__',
                    count: 0,
                    image: false,
                    description: false
                }
            },
            precision: 1,
            jsonURL: 'https://www.greenpeace.org/api/p3/pledge/social.json'
        };

    _p3.social_sharing = function(el, options) {

        var config = $.extend(true, defaults, options || {}),
            $el = $(el),
            support = M.csstransitions;

        function addCommas(int) {
            var nStr = int + '',
                x = nStr.split('.'),
                x1 = x[0],
                x2 = (x.length > 1 && (x[1] * 1.0) > 0 && int < 100) ? '.' + x[1].replace(/0+$/, "") : '',
                rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }

        function humanise(int) {

            int = int * 1.0;

            // Smaller than 10k doesn't overflow container
            if (int < 10000) {
                return addCommas(int);
            }

            var ordinals = ["", "K", "M", "G", "T", "P", "E"],
                n = int,
                ord = 0;

            while (n > 1000) {
                n /= 1000;
                ord++;
            }

            return addCommas((n.toFixed(config.precision)) * 1.0) + ordinals[ord];
        }

        function init() {
            
            if (support) {
                var $modal = $('<div id="social-modal"><div class="modal-content"><h3>Share this page<button class="close">Close</button></h3><iframe></iframe></div></div>'),
                    $overlay = $('<div id="social-overlay"></div>');
                $('body').append($modal).append($overlay);
                $overlay.add('#social-modal button').click(function() {
                    $modal.removeClass('modal-show');
                });
            }

            if (config.pageURL === false) {
                console.warn('WARNING: $.p3.social_sharing :: page referrer URL is not set, using "' + window.location.href + '"');
                config.pageURL = window.location.href;
            }

            $.each(config.networks, function(network, data) {
                if (data.enabled !== false) {
                    var $li = $('li.' + network, $el),
                        $counter = $('.counter span', $li),
                        $a = $('a', $li),
                        url = data.url;

                    switch (network) {
                        case 'pinterest':
                            if (data.image === false) {
//                            throw new Error('Pinterest sharing requires an image');
                                console.warn('WARNING: $.p3.social_sharing :: Pinterest sharing requires an image.');
                                data.image = '';
                            }
                            if (data.description === false) {
//                                throw new Error('Pinterest sharing requires a description');
                                console.warn('WARNING: $.p3.social_sharing :: Pinterest sharing requires a description.');
                                data.description = '';
                            }
                            url = url.replace('__IMAGE__', encodeURIComponent(data.image));
                            url = url.replace('__DESCRIPTION__', encodeURIComponent(data.description));
                            break;
                        case 'twitter':
                            if (data.title === false) {
//                                throw new Error('Twitter sharing requires a title');
                                console.warn('WARNING: $.p3.social_sharing :: Twitter sharing requires a title.');
                                data.title = '';
                            }
                            url = url.replace('__TITLE__', encodeURIComponent(data.title));
                            url = url.replace('__ACCOUNT__', encodeURIComponent(data.account));
                            break;
                        default:
                            break;
                    }

                    url = url.replace(/__REFERRER__/g, encodeURIComponent(config.pageURL));

                    $a.attr({
                        href: url,
                        target: '_blank'
                    }).click(function(e) {

                        e.preventDefault();

                        if (support && network === 'facebook') {
                            // only facebook currently permits sharing in an
                            // iframe due to cross domain policies
                            var $iframe = $('iframe', $modal);

                            if ($iframe.attr('src') !== url) {
                                $iframe.attr('src', url);
                            }

                            $modal.addClass('modal-show');

                        } else {
                            // sigh
                            w.open(url, 'Share this page', 'left=' + config.popup.left + ',top=' + config.popup.top + ',width=' + config.popup.width + ',height=' + config.popup.height + ',toolbar=0,resizable=1');
                        }
                    });

                    // Set counter to humanised number
                    $counter.text(humanise(data.count));
                } else {
//                    console.log(network + ' disabled');
                }
            });

        }

        M.load({
            test: window.JSON,
            nope: [
                'js/v03/lib/json.min.js'
            ],
            complete: function() {
                $.getJSON(config.jsonURL, function(json) {
                    $.extend(true, config, json);

                    if (json.status === 'success') {
                        init();
                    } else {
                        console.warn(json);
                        throw new Error('Status: ' + json.status + ': server reported a problem');
                    }

                }).fail(function() {
                    throw new Error('$.p3.social_sharing :: Failed to load JSON: "' + config.jsonURL + '"');
                });

            }
        });

    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));
