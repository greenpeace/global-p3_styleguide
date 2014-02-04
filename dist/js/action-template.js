/**
 * @name		p3-styleguide
 * @version		v0.3.0
 * @date		2014-02-04
 * @copyright	Copyright 2013, Greenpeace International
 * @source		https://github.com/greenpeace/p3_styleguide
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later */
!function(a){"use strict";var b={action:685},c="https://secured.greenpeace.org/international/en/api/v2/pledges/",d="https://secured.greenpeace.org/international/en/api/v2/pledges/validation/";a.ajaxSetup({cache:!1}),a(document).ready(function(){a.p3.form_tracking(".js-track-abandonment"),a("input[name=email]").focus(),a.p3.autofill("#action-form"),a.p3.pledge_counter("#action-counter",{jsonURL:c,params:b}),a.p3.validation("#action-form",{jsonURL:d,params:b}),a.p3.recent_signers("#action-recent-signers",{jsonURL:c,params:b})})}(jQuery,Modernizr,this);
// @license-end