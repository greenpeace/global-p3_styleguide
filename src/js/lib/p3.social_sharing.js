/**!
 * Social Private Sharing for Greenpeace Action Template v0.3
 *
 * @name            p3.social_sharing.js
 * @fileOverview    Enables social sharing without compromising privacy,
 *                  Obtains share counts from JSON endpoint
 * @copyright       Copyright 2013, Greenpeace International
 * @license         MIT License (opensource.org/licenses/MIT)
 * @version         0.2.0
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
        prefix = ' :: $.p3.social_sharing :: ',
        defaults = {
            pageURL: false,
            popup: {
                top: 200,
                left: 100,
                width: 650,
                height: 380
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
            api: 'https://www.greenpeace.org/api/p3/pledge/social.json'
        };

    _p3.social_sharing = function(el, options) {

        var config  = $.extend(true, defaults, options || {}),
            $el     = $(el);

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

            if (config.pageURL === false) {
                console.warn(prefix + 'page referrer URL is not set, using "' + w.location.href + '"');
                config.pageURL = w.location.href;
            }

            $.each(config.networks, function(network, data) {
                if (data.enabled !== false) {
                    var $a = $('a.' + network, $el),
                        $counter = $('span', $a.prev()) || false,
                        url = data.url;

                    switch (network) {
                        case 'pinterest':
                            if (data.image === false) {
//                            throw new Error('Pinterest sharing requires an image');
                                console.warn(prefix + 'Pinterest sharing requires an image.');
                                data.image = '';
                            }
                            if (data.description === false) {
//                                throw new Error('Pinterest sharing requires a description');
                                console.warn(prefix + 'Pinterest sharing requires a description.');
                                data.description = document.title;
                            }
                            url = url.replace('__IMAGE__', encodeURIComponent(data.image));
                            url = url.replace('__DESCRIPTION__', encodeURIComponent(data.description));
                            break;
                        case 'twitter':
                            if (data.title === false) {
//                                throw new Error('Twitter sharing requires a title');
                                console.warn(prefix + 'Twitter sharing requires a title.');
                                data.title = document.title;
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

                        w.open(url, 'Share this page', 'left=' + config.popup.left + ',top=' + config.popup.top + ',width=' + config.popup.width + ',height=' + config.popup.height + ',toolbar=0,resizable=1');

                    });

                    // Set counter to humanised number
                    if ($counter) {
                        $counter.text(humanise(data.count));
                    }
                } // else { console.log(network + ' disabled'); }
            });

        }

        if (config.api) {
            // load data from JSON endpoint
            M.load({
                test: w.JSON,
                nope: [
                    'dist/js/compat/json.min.js'
                ],
                complete: function() {
                    $.getJSON(config.api, function(json) {
                        $.extend(true, config, json);

                        if (json.status === 'success') {
                            init();
                        } else {
                            console.warn(json);
                            throw new Error(prefix + 'Status: ' + json.status + ': server reported a problem');
                        }

                    }).fail(function() {
                        throw new Error(prefix + 'Failed to load JSON: "' + config.api + '"');
                    });

                }
            });
        } else {
            // Just parse what we've got
            init();
        }


    };

    $.p3 = _p3;

}(jQuery, Modernizr, this));
