/**
 * @name		p3-styleguide
 * @version		v0.3.0
 * @date		2014-03-26
 * @copyright	Copyright 2013, Greenpeace International
 * @source		https://github.com/greenpeace/p3_styleguide
 * @license MIT */
!function(a,b,c){"use strict";var d={live:{parameters:{action:685},actions:{base:"https://secured.greenpeace.org/international/en/api/v2/pledges/",signerCheck:"https://secured.greenpeace.org/international/en/api/v2/pledges/signercheck/",validation:"https://secured.greenpeace.org/international/en/api/v2/pledges/validation/"}},localSocial:{url:{simple:"../test/json/social_simple.json",full:"../test/json/social_full_response.json"}}};a.ajaxSetup({cache:!1}),a(document).ready(function(){a("html").addClass((b.input.placeholder?"":"no-")+"placeholder"),b.mq("only all")||a.p3.narrow(),a.p3.form_tracking(".js-track-abandonment"),a("input[name=email]").focus(),a.p3.remember_me_cookie("#action-form"),a.p3.autofill("#action-form"),a.p3.pledge_counter("#action-counter"),a.p3.pledge_with_email_only("#action-form",{signerCheckURL:d.live.actions.signerCheck,validationRulesURL:d.live.actions.validation,params:d.live.parameters}),a.p3.social_sharing("#action-social-share",{jsonURL:d.localSocial.url.simple,networks:{twitter:{title:c.document.title},pinterest:{image:"http://www.greenpeace.org/international/Global/international/artwork/other/2010/openspace/bigspace-photo.jpg",description:c.document.title}}}),a.p3.recent_signers("#action-recent-signers",{jsonURL:d.live.actions.pledges,params:d.live.parameters})})}(jQuery,Modernizr,this);
// @license-end