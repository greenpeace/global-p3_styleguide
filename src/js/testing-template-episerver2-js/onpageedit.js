/*
 * onpageedit.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2010 EPiServer AB
*/

(function(EPi, window) {

    // We don't have jquery loaded until in OPE mode, therefore this hack.
    var $ = window.epiJQuery;

    EPi.browser = {
        /// <summary>
        ///     Browser information, mimics system.js functionality
        ///     Since we don't want to load the entire script collection.
        /// </summary>
        isIE: (function() {
            var ua = navigator.userAgent.toLowerCase();
            return /msie/.test(ua) && !/opera/.test(ua);
        })(),

        tridentVersion: (function() {
            var match = /trident\/(\d+\.\d+);/.exec(navigator.userAgent.toLowerCase());

            return match && match.length > 0 ? match[1] : undefined;
        })()
    };

    EPi.ope = function() {
        /// <summary>
        ///    Singleton for controlling on page edit and navigation for the contextMenu
        /// </summary>

        var regions = null;
        var editorTypes = {};
        var isEditing = false;
        var activeRegion = null;
        var toolbarRegion = null;
        var spinnerTimoutId = null;
        var updateRegionsTimoutId = null;
        var trimTags = /^<[\s\S]+?>([\s\S]*)<\/[\s\S]+?>$/i;

        return {

            registerRegion: function(regionConfig) {
                /// <summary>
                ///    Adds a possible on page edit region
                /// </summary>
                /// <param name="regionConfig" type="Object" />
                regions = regions || {};
                regions[regionConfig.editorId] = regionConfig;
            },

            registerEditorType: function(name, type) {
                /// <summary>
                ///    Registers a handler for a specific region type mapping against 
                ///    PropertyControl types(PropertyData, PropertyLongString)
                /// </summary>
                /// <param name="regionConfig" type="Object" />
                var f = function() { };
                f.prototype = type;
                editorTypes[name] = f;
            },

            init: function() {
                /// <summary>
                ///    Initializes the controller when entering on page edit mode
                /// </summary>

                isEditing = true;
                setupUI();

                /* Can't use jQuery to bind the beforeunload event since the current version does not support
                returning a string - a feature required for the dialog to pop up and display our custom message. */
                window.onbeforeunload = function(e) {
                    if (isEditing && (activeRegion || EPi.ope.isDirty())) {
                        e = e || window.event;
                        e.returnValue = EPi.Translate('/system/editutil/leavepagewarning');
                        return EPi.Translate('/system/editutil/leavepagewarning');
                    }
                };

                for (var id in regions) {
                    if (regions.hasOwnProperty(id)) {
                        var regionConfig = regions[id];
                        regionConfig.$view = $("#" + regionConfig.id);
                        regionConfig.$editor = $("#" + regionConfig.editorId);

                        // If this is a postback on a failed save we can have validator spans that
                        // are not well suited for OPE display. We note it in the region object, remove the
                        // span and later add a error css to the marker.
                        var $errorSpan = $('#' + regionConfig.editorId + ' + span.epi-opePropertyError');
                        if ($errorSpan.length > 0) {
                            regionConfig.hasErrors = true;
                            $errorSpan.remove();
                        }

                        // Set autocomplete to off because Firefox is caching the input value when reloading the page
                        regionConfig.$editor.attr("autocomplete", "off");

                        var Editor = editorTypes[regionConfig.editorType];

                        // initialize handler and verify that it could start otherwise remove the region
                        if (Editor) {
                            regionConfig.editor = new Editor();

                            if (regionConfig.editor.isAsyncInit) {
                                // The editor initializes asynchroniously so we need to listen for when it's ready
                                regionConfig.isInitialized = false;
                                regionConfig.$view.bind("epiInitComplete", onEditorInitComplete);
                            } else {
                                regionConfig.isInitialized = true;
                            }

                            if (!regionConfig.editor.init(regionConfig)) {
                                delete regions[id];
                            }
                        } else {
                            delete regions[id];
                        }
                    }
                }

                setupToolbars();

                function onEditorInitComplete(e, regionId) {
                    if (!regions[regionId].isInitialized) {
                        regions[regionId].isInitialized = true;
                        setupToolbars();
                    }
                }
            },

            isDirty: function() {
                /// <summary>
                ///    Checks if any of the OPE regions has unsaved changes
                /// </summary>
                /// <returns>A boolean indicating if any editor is dirty</returns>
                for (var id in regions) {
                    if (regions.hasOwnProperty(id)) {
                        if (regions[id].editor.isDirty()) {
                            return true;
                        }
                    }
                }
                return false;
            },

            isEditing: function() {
                /// <summary>
                ///    Indicating if the page is in OPE mode
                /// </summary>
                /// <returns>A boolean indicating if OPE mode is active</returns>
                return isEditing;
            },

            onEdit: function() {
                /// <summary>
                ///    Postbacks the page, setting it up for on page edit
                /// </summary>
                __doPostBack(EPi.GetProperty(window, "EPiOnPageEditControl"), "Edit");
            },

            onCancel: function() {
                /// <summary>
                ///    Postbacks the page, cancelling any edits
                /// </summary>
                window.location.href = window.location.href;
            },

            onSaveAndPublish: function() {
                /// <summary>
                ///    Postbacks the page, saving and publishing all changes
                /// </summary>
                isEditing = false;
                __doPostBack(EPi.GetProperty(window, "EPiOnPageEditControl"), "SaveAndPublish");
            },

            onCopySelection: function() {
                //This functionality only works in Internet Explorer. The menu option never shows in FireFox see ContextMenu.cs for more info.        
                if (document.selection && document.selection.createRange) {
                    //We need to have a try catch here since if you select text in the context meny and then use copy to clipboard. the sel.select() will crash.
                    //This is since the contextmenu closes before it tries to select the text.
                    try {
                        var sel = document.selection.createRange();
                        sel.select();
                        document.execCommand('Copy');
                    }
                    catch (e) {
                    }
                }
            },

            onNavigate: function(name, url) {
                /// <summary>
                ///    Used by the contextmenu to preform various actions
                /// </summary>
                var wnd = getEditWindow();
                if (wnd !== null) {
                    wnd.commandEvent(window, new wnd.commandDescriptor(name, url));
                }
            },

            isEnabled: function() {
                /// <summary>
                ///    Indicates if the page is in OPE mode and if there are any editable regions
                /// </summary>
                /// <returns>A boolean indicating if OPE mode is enabled</returns>
                return regions && !isEditMode;
            },

            isEditMode: function() {
                /// <summary>
                ///    Indicates if the page is loaded in the edit mode view
                /// </summary>
                var frame;
                var wnd = window;

                while (typeof wnd !== "undefined") {
                    try {
                        if (wnd.commandEvent && wnd.latestNavigate !== null && wnd.latestNavigate !== '') {
                            return true;
                        }
                    }
                    catch (e) {
                        return false;
                    }
                    if (wnd === wnd.parent) {
                        break;
                    }
                    wnd = wnd.parent;
                }
                return false;
            }
        };

        // private methods

        function editBegin(region) {
            region.editor.editBegin();
            toggleActiveRegion(region);
        }

        function editEnd(save /* bool */) {
            if (save && activeRegion.editor.getValue() !== activeRegion.editor.getPreviousValue()) {
                toggleCover(activeRegion.id);
                getRenderedProperty(activeRegion.property, activeRegion.editor.getValue(), completeCallback);
            } else {
                activeRegion.editor.editEnd(false);
                toggleWarning(false);
                toggleActiveRegion(false);
            }

            // Gets the rendered property.
            // postData: The property data.
            // callback: The callback function.
            function getRenderedProperty(propertyName, propertyValue, completeCallback) {
                $.ajax({
                    type: 'POST',
                    url: EPi.ResolveUrlFromUtil("Editor/RenderProperty.aspx?id=" + EPi.PageLink.id + "&epslanguage=" + EPi.PageLink.language),
                    data: { 'propertyName': propertyName, 'propertyValue': propertyValue, 'opeToken': EPi.OnPageEditToken },
                    dataType: 'text',
                    complete: completeCallback
                });
            }
            function completeCallback(xmlHttp, textStatus) {
                if (xmlHttp.status == 200) {

                    // Remove the surrounding tag from the response
                    var content = $.trim(xmlHttp.responseText);
                    var result = trimTags.exec(content);

                    // Check that the result of the regex is reasonable
                    // otherwise use the full response
                    if (result && result.length == 2) {
                        content = result[1];
                    }

                    activeRegion.$view.html(content);

                    toggleCover(false);
                    toggleWarning(false);
                    activeRegion.editor.editEnd(true);
                    activeRegion.marker.removeClass('epi-opeRegionError');
                    toggleActiveRegion(false);
                } else {
                    toggleWarning(xmlHttp.responseText);
                    toggleCover(false);
                }
            }
        }

        function setupRegions(region) {

            var regionContainer = $("#epi-opeRegionContainer");

            for (var id in regions) {
                if (regions.hasOwnProperty(id)) {
                    var region = regions[id];
                    var errorClass = region.hasErrors ? 'epi-opeRegionError' : '';

                    region.$view.addClass(region.$view.css("display") === "inline" ? "epi-opeEditableRegionInline"
                                                                                   : "epi-opeEditableRegion");

                    region.marker = $('<div class="epi-opeRegion ' + errorClass + '"><div class="epi-opeRegionInner"></div></div>')
                                    .attr("title", region.displayName)
                                    .data("options", region)
                                    .click(onRegionClick);
                    regionContainer.append(region.marker);
                }
            }

            $(window).resize(onUpdateRegion);
            // Registering a listener on body to give the possibility to force an update
            // by triggering a resize ($("body").resize())
            $("body").resize(onUpdateRegion);
            //Start the recurring update
            updateRegions(true);

            function onUpdateRegion(e) {
                // IE 7 gives strange results for jquery.offset()
                // if called directly on the resize event and needs
                // a little bit of timeout.
                if ($.browser.msie && $.browser.version === "7.0") {
                    setTimeout(function() { updateRegions(false); }, 20);
                } else {
                    updateRegions(false);
                }
            }

            function onRegionClick(e) {
                editBegin($(this).data("options"));
            }
        }

        function updateRegions(updateReccuring /* bool */) {

            for (var id in regions) {
                if (regions.hasOwnProperty(id)) {
                    var region = regions[id];

                    if (region.$view.css("visibility") === "hidden" || region.$view.css("display") === "none") {
                        region.marker.hide();
                    } else {
                        var cssMap = getCssMap(region.$view, 2);
                        cssMap.display = "block";
                        region.marker.css(cssMap);
                    }
                }
            }
            if (updateReccuring && updateRegionsTimoutId === null) {
                updateRegionsTimoutId = setTimeout(function() {
                    updateRegionsTimoutId = null;
                    updateRegions(true);
                }, 250);
            }
        }

        function toggleRegions(state /* bool */) {
            var regionContainer = $("#epi-opeRegionContainer");

            if (state) {
                updateRegions(true);
                regionContainer.show();
            } else {
                if (updateRegionsTimoutId) {
                    clearTimeout(updateRegionsTimoutId);
                    updateRegionsTimoutId = null;
                }
                regionContainer.hide();
            }
        }

        function toggleActiveRegion(region) {

            var activeRegionMarkers = $("#epi-opeActiveRegionTop,#epi-opeActiveRegionRight,#epi-opeActiveRegionBottom,#epi-opeActiveRegionLeft");
            var saveButton = $("#epi-opeToolbarSaveButton");

            //Setup for editing
            if (region) {
                activeRegion = region;
                // Check if the editor has toolbar functionality
                if (region.editor.toggleToolbar) {
                    // hide the previous toolbar and set the new one as
                    // our toolbar of choice
                    if (region !== toolbarRegion) {
                        toolbarRegion.editor.toggleToolbar(false);
                    }
                    toolbarRegion = region;
                }

                $("#epi-opeToolbarContainer").resize();

                region.$view.hide();
                resizeActiveRegion();
                activeRegionMarkers.show();
                toggleRegions(false);

                saveButton.parent().toggleClass("epi-cmsButton-disabled", true);
                saveButton.attr("disabled", "disabled");

                $(window).resize(onResize);
                region.$editor.resize(resizeActiveRegion);

                //Setup for viewing
            } else {
                $(window).unbind("resize", onResize);
                activeRegion.$editor.unbind("resize", resizeActiveRegion);

                activeRegionMarkers.hide();
                activeRegion.$view.show();
                toggleRegions(true);

                if (EPi.ope.isDirty()) {
                    saveButton.parent().toggleClass("epi-cmsButton-disabled", false);
                    saveButton.removeAttr("disabled");
                }

                activeRegion = null;
            }

            function onResize() {
                // IE 7 gives strange results for jquery.offset()
                // if called directly on the resize event and needs
                // a little bit of timeout.
                if ($.browser.msie && $.browser.version === "7.0") {
                    setTimeout(resizeActiveRegion, 20);
                } else {
                    resizeActiveRegion();
                }
            }
        }

        function resizeActiveRegion() {
            if (!activeRegion) { return; }

            var cssMap = getCssMap(activeRegion.$editor);
            $("#epi-opeActiveRegionTop").css({ top: cssMap.top - 2, left: cssMap.left - 2, width: cssMap.width + 4 });
            $("#epi-opeActiveRegionRight").css({ top: cssMap.top - 2, left: cssMap.left + cssMap.width, height: cssMap.height + 2 });
            $("#epi-opeActiveRegionBottom").css({ top: cssMap.top + cssMap.height, left: cssMap.left - 2, width: cssMap.width + 4 });
            $("#epi-opeActiveRegionLeft").css({ top: cssMap.top - 2, left: cssMap.left - 2, height: cssMap.height + 2 });
        }

        function setupToolbars() {

            // Verify that all toolbars are ready
            for (var id in regions) {
                if (regions.hasOwnProperty(id)) {
                    if (!regions[id].isInitialized) {
                        return;
                    }
                }
            }

            var first = true;

            for (var id in regions) {
                if (regions.hasOwnProperty(id)) {
                    var region = regions[id];

                    if (region.editor.toggleToolbar) {
                        region.editor.toggleToolbar(false, first);
                        if (first) {
                            toolbarRegion = region;
                            first = false;
                        }
                    }
                }
            }

            $("#epi-opeToolbarContainer").resize(onToolbarResize);
            onToolbarResize();

            function onToolbarResize(e) {
                $("#epi-opeToolbarSpacer").height($("#epi-opeToolbarContainer").outerHeight());
            }

            if (EPi.ErrorMessages) {
                toggleWarning(EPi.ErrorMessages);
            }

            setupRegions();
        }

        function toggleCover(state /* bool */) {
            var cover = $("#epi-opeCover"), spinner = $("#epi-opeSpinner");

            if (state) {
                cover.show();
                resizeCover();
                $(window).bind("resize", resizeCover);
                spinner.css(getCssMap(activeRegion.$editor, 0));
                spinnerTimoutId = setTimeout(function() { spinner.fadeIn(200); }, 500);

            } else {
                if (spinnerTimoutId !== null) {
                    clearTimeout(spinnerTimoutId);
                    spinnerTimoutId = null;
                }
                $(window).unbind("resize", resizeCover);
                cover.hide();
                spinner.hide();
            }

            function resizeCover() {
                if (cover.css("display") === "none") {
                    return;
                }
                var win = $(window), doc = $(document);

                //hiding the cover to get correct readings.
                cover.hide();
                cover.width(win.width() > doc.width() ? win.width() : doc.width());
                cover.height(win.height() > doc.height() ? win.height() : doc.height());
                cover.show();
            }
        }

        function setupUI() {
            $("body").prepend('<div id="epi-opeRegionContainer"></div> \
                               <div id="epi-opeToolbarContainer"> \
                                   <div class="epi-opeToolbarContainerInner"> \
                                       <div id="epi-opeToolbar"></div> \
                                           <div class="epi-opeToolbarButtonContainer"> \
                                               <span class="epi-cmsButton epi-cmsButton-disabled"><input type="button" id="epi-opeToolbarSaveButton" disabled="disabled" value="' + EPi.Translate("/button/saveandpublish", "Save and Publish") + '" /\
                                               ></span><span class="epi-cmsButton"><input type="button" id="epi-opeToolbarCancelButton" value="' + EPi.Translate("/button/cancel", "Cancel") + '" /></span> \
                                           </div> \
                                       </div> \
                                   </div> \
                                   <div id="epi-opeToolbarSpacer"></div> \
                                   <div id="epi-opeWarning"><span id="epi-opeWarningMessage"></span></div> \
                                   <div id="epi-opeActiveRegionBottom"> \
                                       <div id="epi-opeActionbar" class="epi-buttonContainer"> \
                                           <span class="epi-cmsButton"><input type="button" id="epi-opeActionbarDoneButton" value="' + EPi.Translate("/button/done", "Done") + '"/></span\
                                           ><span class="epi-cmsButton"><input type="button" id="epi-opeActionbarCancelButton" value="' + EPi.Translate("/button/cancel", "cancel") + '"/></span> \
                                       </div> \
                                   </div> \
                                   <div id="epi-opeActiveRegionTop"></div><div id="epi-opeActiveRegionRight"></div><div id="epi-opeActiveRegionLeft"></div> \
                                   <div id="epi-opeCover"></div> \
                                   <div id="epi-opeSpinner"></div>');

            $("#epi-opeToolbarSaveButton").click(EPi.ope.onSaveAndPublish);
            $("#epi-opeToolbarCancelButton").click(EPi.ope.onCancel);

            $("#epi-opeActionbarDoneButton").click(function(e) {
                editEnd(true);
            });

            $("#epi-opeActionbarCancelButton").click(function(e) {
                editEnd(false);
            });
        }

        function toggleWarning(message) {
            if (message) {
                $("#epi-opeWarningMessage").text(message);
                $("#epi-opeWarning:hidden").slideDown();

            } else {
                $("#epi-opeWarning,#epi-opeWarningSpacer").hide();
            }
        }

        function getEditWindow() {
            var frame;
            var wnd = this.window;

            while (wnd !== null) {
                try {
                    if (wnd.commandEvent && wnd.latestNavigate !== null && wnd.latestNavigate !== '') {
                        return wnd;
                    }
                }
                catch (e) {
                    return null;
                }

                if (wnd === wnd.parent) {
                    break;
                }
                wnd = wnd.parent;
            }
            return null;
        }

        function getCssMap($elm /*, padding */) {
            var padding = arguments[1] || 0;
            var cssMap = $elm.offset();
            cssMap.top -= padding;
            cssMap.left -= padding;
            cssMap.width = $elm.outerWidth() + padding * 2;
            cssMap.height = $elm.outerHeight() + padding * 2;

            return cssMap;
        }

    } ();

    EPi.ope.editors = {
        xhtmlstring: {
            /// <summary>
            ///    Editor handling the xhtmlstring property using the TinyMCE Editor
            /// </summary>
            _region: null,
            _previousValue: null,

            isAsyncInit: true,

            init: function(config) {
                this._region = config;

                if (!tinymce.isEPiServerUIVersion) {
                    //If the page is running another version than the current edit version, exit init.
                    return false;
                }

                this._region.settings.width = this._region.$view.width();
                this._region.settings.height = this._region.$view.height();
                this._region.settings.submit_patch = false;
                this._region.settings.add_form_submit_trigger = false;
                this._region.settings.add_unload_trigger = false;
                
                this._region.settings.setup = function(ed) {
                    ed.onNodeChange.add(initToolbar);
                    ed.onInit.add(registerEditor);
                };
                tinymce.init(this._region.settings);

                this._previousValue = this._region.$editor.val();

                return true;

                function initToolbar(ed, cm, n, co) {
                    config.$view.trigger("epiInitComplete", config.editorId);
                    ed.onNodeChange.remove(initToolbar);
                }

                function registerEditor(ed) {
                    config.$editor = $(ed.getContainer());
                }
            },

            editBegin: function() {
                var editor = tinymce.get(this._region.editorId);
                editor.show();
                editor.focus();
                this.toggleToolbar(true);
            },

            editEnd: function(save /*bool*/) {
                var editor = tinymce.get(this._region.editorId);

                if (save) {
                    // Save the content to the textarea for later submittal (on "Save Changes")
                    editor.save();

                } else {
                    // load the content back from the textarea i.e. cancel
                    editor.load();
                }
                this._previousValue = editor.getContent();
                this.toggleToolbar(false, true);
                editor.hide();
            },

            isDirty: function() {
                return tinymce.get(this._region.editorId).isDirty();
            },

            getPreviousValue: function() {
                /// <summary>
                ///    Get the previous entered (clicked on Done) value
                /// </summary>
                /// <returns>A string containing the previous entered value</returns>
                return this._previousValue;
            },

            getValue: function() {
                /// <summary>
                ///    Get the current value
                /// </summary>
                /// <returns>A string containing the current value</returns>
                return tinymce.get(this._region.editorId).getContent();
            },

            setValue: function(value) {
                tinymce.get(this._region.editorId).setContent(value);
            },

            toggleToolbar: function(state /*,visible bool */) {
                var visible = arguments[1] || state;
                var editor = tinymce.get(this._region.editorId);
                for (var prop in editor.controlManager.controls) {
                    editor.controlManager.controls[prop].setDisabled(!state);
                }
                var toolbar = $("#" + this._region.editorId + '_external');
                var toolbarParent = toolbar.parent();

                // We have to show / hide both the inner toolbar element and it's parent because otherwise tinymce 
                // behaves strange after some clicks in different editors. See workitem #60203
                if (visible) {
                    toolbar.show();
                    toolbarParent.show();
                }
                else {
                    toolbar.hide();
                    toolbarParent.hide();
                }

                //If toggle toolbar to visible, manually call editor.nodeChanged() so that states of the commands are updated
                if (state) {
                    editor.nodeChanged();
                }
            }
        },

        data: {
            /// <summary>
            ///    Default editor handling all properties with OPE mode enabled and no other editor specified
            /// </summary>
            _region: null,
            _originalValue: null,
            _previousValue: null,
            _undoBuffer: null,

            init: function(config) {
                this._region = config;

                this._region.$editor.addClass("epi-opeDataEditor");

                this._region.$editor.width(this._region.$editor.parent().width() - 20);
                if (this._region.$editor[0].tagName === "TEXTAREA") {
                    var height = this._region.$view.height();
                    this._region.$editor.height(Math.max(height, 150));
                }

                this._originalValue = this._region.$editor.val();
                this._previousValue = this._originalValue;

                return true;
            },

            editBegin: function() {
                this._undoBuffer = this._region.$editor.val();
                this._region.$editor.show();
                this._region.$editor.focus();
            },

            editEnd: function(save /*bool*/) {
                if (!save) {
                    this._region.$editor.val(this._undoBuffer);
                }
                this._previousValue = this._region.$editor.val();
                this._region.$editor.hide();
            },

            isDirty: function() {
                return this._originalValue !== this._region.$editor.val();
            },

            getPreviousValue: function() {
                /// <summary>
                ///    Get the previous entered (clicked on Done) value
                /// </summary>
                /// <returns>A string containing the previous entered value</returns>
                return this._previousValue;
            },

            getValue: function() {
                /// <summary>
                ///    Get the current value
                /// </summary>
                /// <returns>A string containing the current value</returns>
                return this._region.$editor.val();
            },

            setValue: function(value) {
                this._region.$editor.val(value);
            }
        }
    }

    EPi.ope.registerEditorType("xhtmlstring", EPi.ope.editors.xhtmlstring);
    EPi.ope.registerEditorType("data", EPi.ope.editors.data);

} (EPi, window));
