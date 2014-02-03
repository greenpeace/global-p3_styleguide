/**
 * @name		p3-styleguide
 * @version		v0.3.0
 * @date		2014-01-14
 * @copyright	Copyright 2013, Greenpeace International
 * @source		https://github.com/greenpeace/p3_styleguide
 * @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later */
!function(a){"use strict";var b={page:300507,key:"78d245e17c455859b4863ad34674f2b8",expire:"2013-11-02"},c="json/pledges.json?fish=salmon",d="json/rules_revised.json";a.ajaxSetup({cache:!1}),a(document).ready(function(){a.p3.form_tracking(".js-track-abandonment"),a("input[name=email]").focus(),a.p3.autofill("#action-form"),a.p3.pledge_counter("#action-counter",{jsonURL:c,params:b}),a.p3.validation("#action-form",{jsonURL:d,params:b}),a.p3.recent_signers("#action-recent-signers",{jsonURL:c,params:b})})}(jQuery,Modernizr,this);
// @license-end