/*
 * contextmenu.js	- JavaScript support routines for EPiServer
 * Copyright (c) 2007 EPiServer AB
*/

// CONSTANTS - Set by RighClickMenu
var CLEAR_IMAGE_URL = "clear.gif";
var ARROW_IMAGE_URL = "Arrow.gif";
var CONTEXT_MENU_COVER_SRC = null;

function ContextMenu()
{	
	this.visible = false;
	this.menuItems = new Array();
	this.itemCount = 0;
	this.popupWindow = null;
	this.enabled = true;
	this.parentMenu = null; // Used with subMenu
	this.sortedMenu	= false;
	this.sortKeyPrefix = null;
	this.isInitialized = false;
	this.renderAligned = false;
	this.alignedTo = null; // Element to align this menu to
    
    if (!this._IsCrossSite(window.top))
    {
        this.topDocument = EPi.GetDocument(window.top); // the document belonging to the top window
        this.topWindow = window.top;
    }
    else
    {
        this.topDocument = EPi.GetDocument(window);
        this.topWindow = window;
    }
    
    // .OnHide(causedByAction)  - Callback executed when the context menu is hidden with a boolean argument 
    // indicating whether it's been hidden because the user clicked on a menu item or because the menu lost focus.
    this.OnHide = null;
}

/* InitializeMenu creates a menu for the ContextMenu instance by filling the popupWindow (created if needed) with the menu's items */
ContextMenu.prototype.InitializeMenu = function ()
{
	if (this.isInitialized)	// Prevent double initializations
	{
		return;
	}
    
    if (this.sortedMenu)
	{
		this.menuItems.sort(this._SortMenuItems);
	}

	var aItems = this.menuItems;
	var menu = this;
	
	// Create the popupWindow if it does not already exist
	if (this.popupWindow == null)
	{
		this._CreatePopupWindow();
	}
	
	var itemDiv;
	
	for(var i=0; i<aItems.length; i++)
	{
		// Store reference and create the objects that form the menu item, in the item object (needed when rendering the menu)			
		aItems[i].ItemDiv = itemDiv = this.topDocument.createElement('div');
							
		if(!aItems[i].sCaption && (i==0 || i==(aItems.length-1)))
		{
			continue;
		}
			
		itemDiv.MenuIndex = parseInt(i.toString());
		
		if(!aItems[i].sCaption)
		{	// This item is a separator
			itemDiv.className = "ContextMenuItem-Separator";
		}
		else
		{
	        itemDiv.handleActiveMenuItem = function(e){menu._MenuItemMouseOver(e);}
			itemDiv.handleInactiveMenuItem = function(e){menu._MenuItemMouseOut(e);}
			itemDiv.handleOpenMenuItem = function(e){menu._MenuItemClick(e);}
			itemDiv.handleFocusMenuItem = function(e){menu._MenuItemFocus(e);}
            
            // Set item image if available
		    imgSrc = aItems[i].sImageURL ? aItems[i].sImageURL : CLEAR_IMAGE_URL;
		    itemDiv.style.backgroundImage = "url('" + imgSrc + "')";
			
			EPi.AddEventListener(itemDiv, "mouseover", itemDiv.handleActiveMenuItem);
			EPi.AddEventListener(itemDiv, "mouseout", itemDiv.handleInactiveMenuItem);
			EPi.AddEventListener(itemDiv, "click", itemDiv.handleOpenMenuItem);
			EPi.AddEventListener(itemDiv, "contextmenu", itemDiv.handleOpenMenuItem);
			EPi.AddEventListener(itemDiv, "focus", itemDiv.handleFocusMenuItem);
		
			if(aItems[i].oSubMenu)
			{	// The menu item has a submenu, add a submenu arrow gif
				var subImage =	this.topDocument.createElement('img');
				subImage.className = 'ArrowMenuImage';
				subImage.src = ARROW_IMAGE_URL;
				subImage.id = 'arrow' + i;
				itemDiv.appendChild(subImage);
				
				// Align the submenu item to this menu item
				aItems[i].oSubMenu.alignedTo = itemDiv;
			}
			
			itemDiv.innerHTML += aItems[i].sCaption;
			
			// Insert the configured menu item into the popupWindow
			itemDiv.className = "ContextMenuItem";
		}
		this.popupWindow.appendChild(itemDiv);
	}
	
	this.isInitialized = true;	// Set variable to prevent from initializing again
}

ContextMenu.prototype.AddMenuItem = function (sCaption,sURL,sJavascript,sEnabled,sImageURL,oSubMenu, sortKey)
{
	if (this.sortedMenu)
	{
		if (!sortKey)
		{
			sortKey = sCaption;
		}
			
		if (this.sortKeyPrefix)
		{
			sortKey = this.sortKeyPrefix + sortKey;
		}
	}
    
	this.menuItems[this.itemCount++] = new MenuItem(sCaption, sURL, sJavascript, sEnabled, sImageURL, oSubMenu, sortKey);
}

ContextMenu.prototype.AttachContainer = function(attachedTo)
{
	var thisMenu = this;
	this.alignedTo = attachedTo;
	EPi.AddEventListener(attachedTo, "contextmenu", function (e) {thisMenu.Show(e);});
}

ContextMenu.prototype.DetachContainer = function ()
{
	this._CleanMenu();
}

ContextMenu.prototype.DisableMenu = function ()
{
	this.enabled = false;
}

/* Show renders the menu by opening the corresponding popupWindow on the correct location */
ContextMenu.prototype.Show = function(e, alignedTo, parentMenu) {

    //First we hide the menu and it's children if visible
    if (this.visible) {
        this._HideRecursive();
    }

    //Do not show EPi context menu if any of the below options are true.
    if (e) {
        // Ctrl key + click is used as right click on Mac.
        var preventMenu = (window.navigator.userAgent.indexOf("Macintosh") != -1 ? e.metaKey : e.ctrlKey);
        if (preventMenu || !this.enabled || this.menuItems.length == 0) {
            return;
        }
    }

    // Make sure the menu is initialized before rendered
    if (!this.isInitialized) {
        this.InitializeMenu();
    }
	
	if (document.selection) // for IE
    {        
        this.currentSelection = document.selection.createRange();
        
        if(this.currentSelection.text.length < 1 )
        {
            // Disable the copy meny when we have no selection. 
            var aItems  = this.menuItems;
            for(var i=0;i<aItems.length;i++)
	        {
	            if (aItems[i].sJavascript == "EPi.ope.onCopySelection()")
	            {
	                aItems[i].sEnabled = false;
	            }
	        }
        }
        else
        {
            var aItems  = this.menuItems;
            for(var i=0;i<aItems.length;i++)
	        {
	            if (aItems[i].sJavascript == "EPi.ope.onCopySelection()")
	            {
	                aItems[i].sEnabled = true;
	            }
	        }
        }
    }

    // parentMenu is specified when showing a subMenu
	this.parentMenu = parentMenu;
	this.alignedTo = alignedTo;
	
	this._RenderMenuItems();
	this._SetPosition(e);
	
	var win = this.topWindow;
	if (win._EPiContextMenuCurrent && win._EPiContextMenuCurrent != this && win._EPiContextMenuCurrent != parentMenu)
    {
        try 
        {
            win._EPiContextMenuCurrent._HideRecursive();
        }
        catch (ex)
        {
            // Do not raise exception
        }
    }
	if (!parentMenu)
	{
	    //To have focus working on the body element we need to have tabindex on it.
	    //So we add tabindex before the focus and remove it in the _OnHideEvent method.	    
	    this.topDocument.body.setAttribute("tabindex", 0);
	    this.topDocument.body.focus(); // Setting focus to the body in topWindow helps us know when to close menu without attaching events to every iframe.
	    
	    this._AddHideEventListeners();
	}
	
	this.visible = true;

	e.preventDefault();
	e.stopPropagation();
}

ContextMenu.prototype._SortMenuItems = function (firstItem, secondItem)
{
	var sort1 = firstItem.sortKey;
	var sort2 = secondItem.sortKey;
	if (sort1 == sort2)
		return 0;
		
	if (typeof(sort1) == 'string')
		sort1 = parseInt(sort1);
	if (typeof(sort2) == 'string')
		sort2 = parseInt(sort2);
	if (typeof(sort1) != 'number' || typeof(sort2) != 'number' || isNaN(sort1) || isNaN(sort2))
		return (firstItem.sortKey > secondItem.sortKey ? 1 : -1);
	return (sort1 > sort2 ? 1 : -1);
}

ContextMenu.prototype._CleanMenu = function()
{
	if (!this.isInitialized)	// Prevent double cleaning
	{
		return;
	}

	var aItems			= this.menuItems;
	var menu			= this;
	var htmlContainer   = this.popupWindow;
	
	this.alignedElement = null;
	
	for(var i=0;i<aItems.length;i++)
	{
		var itemDiv = aItems[i].ItemDiv;
		
		if(!aItems[i].sCaption)
		{
			continue;
		}
		
		EPi.RemoveEventListener(itemDiv, "mouseover", itemDiv.handleActiveMenuItem);
		EPi.RemoveEventListener(itemDiv, "mouseout", itemDiv.handleInactiveMenuItem);
		EPi.RemoveEventListener(itemDiv, "click", itemDiv.handleOpenMenuItem);
		EPi.RemoveEventListener(itemDiv, "contextmenu", itemDiv.handleOpenMenuItem);
		EPi.RemoveEventListener(itemDiv, "focus", itemDiv.handleFocusMenuItem);
		
		itemDiv.handleActiveMenuItem = null;
		itemDiv.handleInactiveMenuItem = null;
		itemDiv.handleOpenMenuItem = null;
        
        if(aItems[i].oSubMenu)
		{
			aItems[i].oSubMenu._CleanMenu();
		}
		this.menuItems[i] = null;
		this.popupWindow.removeChild(itemDiv);
	}
    
	this._HideRecursive();
	
	this.popupWindow.parentNode.removeChild(this.popupWindow);
	this.popupWindow = null;
	if (this.iframeCover) 
	{
	    this.iframeCover.parentNode.removeChild(this.iframeCover);
	    this.iframeCover = null;
	}
}

/* Close current open menu */
ContextMenu.prototype._Hide = function()
{
    if (!this.visible)
    {
        return;
    }
    var win = this.topWindow;
    if (win._EPiContextMenuCurrent == this) 
    {
        win._EPiContextMenuCurrent = null;
    }
    this.popupWindow.style.display = "none";
    this.iframeCover.style.display = "none";
    
    if (this.openedByMenuItem)
    {
        this.menuItems[this.openedByMenuItem].oSubMenu._Hide();
    }
    this.openedByMenuItem = null;
	
	this._RemoveHideEventListeners();
	
	this.visible = false;
}

/* Close all open menus */
ContextMenu.prototype._HideRecursive = function(causedByAction, e)
{
	if (this.parentMenu != null)
	{
		this.parentMenu._HideRecursive();
	}
	this._Hide();
	// Call the onhide callback if it's been defined.
	if (this.OnHide != null)
	{
	    this.OnHide(causedByAction || false);
	}
}

ContextMenu.prototype._IsCrossSite = function(win)
{
    // Check if location.hostname is accessible.
    // Throws exception if we are not allowed to check hostname.
    try
    {
        var testProp = win.location.hostname;
        return false;
    }
    catch(ex)
    {
        return true;
    }
}

ContextMenu.prototype._AddHideEventListeners = function()
{
    this.topWindow._EPiContextMenuCurrent = this;
    EPi.AddEventListener(this.topWindow, "blur", this._OnHideEvent);
    EPi.AddEventListener(this.topDocument, "click", this._OnHideEvent);
    
    this._hideEventListenersAdded = true;
}

ContextMenu.prototype._RemoveHideEventListeners = function()
{
    if (this._hideEventListenersAdded)
    {
        EPi.RemoveEventListener(this.topWindow, "blur", this._OnHideEvent);
        EPi.RemoveEventListener(this.topDocument, "click", this._OnHideEvent);
    }
    this._hideEventListenersAdded = false;
}

ContextMenu.prototype._OnHideEvent = function(e) {
    var win;
    if (this.defaultView) {
        win = this.defaultView;
    } else if (this.parentWindow) {
        win = this.parentWindow;
    } else {
        win = this;
    }
    
    if (win._EPiContextMenuCurrent) {
        var contextMenu = win._EPiContextMenuCurrent;
        win.setTimeout(function(e) { contextMenu._HideMenuCheck(e); contextMenu = null; }, 0, e);
        contextMenu.topDocument.body.removeAttribute("tabindex");
    }
    
}

ContextMenu.prototype._HideMenuCheck = function(e) {
    if (!this._preventHide) {
        this._HideRecursive(false, e);
    }
    else {
        this.topWindow.focus();
    }

    this._preventHide = false;
}

ContextMenu.prototype._MenuItemFocus = function(e) {
     this.topWindow._EPiContextMenuCurrent._preventHide = true;
}


ContextMenu.prototype._SetPosition = function(e)
{
    var node = e.currentTarget;
    // If event (e) added through EPi.AddEventListener just show menu.
    if (!node)
    {
        this.popupWindow.style.display = "block";
        return;
    }
    
    var posX = this._FindNodePosition(node, "X");
	var posY = this._FindNodePosition(node, "Y"); 
    
    var alignedX = false;
	var alignedY = false;
	
	if (!this.alignedTo && !this.renderAligned)
	{
	    posX += e.clientX;
	    posY += e.clientY;
	}
	else 
	{
	    if (this.renderAligned) 
	    {
	        posY += node.offsetHeight;
	        alignedY = true;
	    }
	    else 
	    {
	        posX += node.offsetWidth;
	        alignedX = true;
	    }
	}
	
	// Set the position of sub menus correctly according to eventual parent menu scroll.
	if (this.parentMenu)
	{
	    posY -= this.parentMenu.popupWindow.scrollTop;
	}
	
	this.popupWindow.style.visibility = "hidden";
    this.popupWindow.style.display = "block";
    this.popupWindow.style.overflow = "";
    this.popupWindow.style.height = "";
    
    var popupWidth = this.popupWindow.offsetWidth;
    var popupHeight = this.popupWindow.offsetHeight;
    
    if (this.renderAligned && node != null)
    {
       popupWidth = node.clientWidth;
    }
   
    // Get window size as an array [innerWidth, innerHeight]. We have to use this.topWindow since we might have cross site scripting issues.
    var windowSize = EPi.GetWindowSize(this.topWindow); // window size as an array [innerWidth, innerHeight]
    
    if (windowSize[0] < posX + popupWidth) 
    {
        if (alignedX) 
        {
            posX -= (popupWidth + node.offsetWidth);
        }
        else
        {
            posX = windowSize[0] - popupWidth - 10;
        }
    }
  
    if (windowSize[1] < posY + popupHeight) 
    {
        var memPosY = posY;
        if (alignedY)
        {
            posY -= (popupHeight + node.offsetHeight);
        }
        else 
        {
            posY = windowSize[1] - popupHeight - 10;
        }
        
        // Do not render part of the menu outside window. 
        // Instead we add scroll to the contextmenu if necessary.
        if (posY < 0)
        {
            this.popupWindow.style.overflow = "auto";
            if (alignedY)
            {
                if (memPosY < windowSize[1]/2)
                {
                    posY = memPosY;
                    this.popupWindow.style.height =  (windowSize[1] - posY - 10) + "px";
                }
                else
                {
                    this.popupWindow.style.height = (this._FindNodePosition(node, "Y") - 10) + "px";
                    popupHeight = this.popupWindow.offsetHeight;
                    posY = memPosY - popupHeight - node.offsetHeight;
                }
            }
            else
            {
                posY = 10;
                this.popupWindow.style.height = (windowSize[1] - posY - 10) + "px";
            }
            popupHeight = this.popupWindow.offsetHeight;
        }
    }
    
    
    // Set position according to how much the page has been scrolled
    var topWindowScroll = this._ScrollPosition(this.topWindow);
    
    posX += topWindowScroll[0];
    posY += topWindowScroll[1];
    
    
    if (this.renderAligned)
    {
        var windowScroll = this._ScrollPosition(window);
        posX -= windowScroll[0];
        posY -= windowScroll[1];
    }
    
    this.popupWindow.style.left = posX + "px";
    this.popupWindow.style.top = posY + "px";
    this.popupWindow.style.width = popupWidth + "px";
    this.popupWindow.style.visibility = "";
    
    // Set the iframe cover to the same position and size.
    this.iframeCover.style.left = posX + "px";
    this.iframeCover.style.top = posY + "px";
    this.iframeCover.style.width = popupWidth + "px";
    this.iframeCover.style.height = popupHeight + "px";
    this.iframeCover.style.display = "block";
}

ContextMenu.prototype._ScrollPosition = function(win)
{
    var scrollX = 0;
    var scrollY = 0;
    if (!this._IsCrossSite(win.top) && win.top.document.documentElement.scrollTop != null)
    {
        scrollX = win.document.documentElement.scrollLeft;
        scrollY = win.document.documentElement.scrollTop;    
    }
    else if (win.pageYOffset != null)
    {
        scrollX = win.pageXOffset;
        scrollY = win.pageYOffset;
    }  
    
    return [scrollX, scrollY];
}

/* RenderMenuItems updates menu item rendering based on their enabled/disabled state */
ContextMenu.prototype._RenderMenuItems = function ()
{
	var i, itemDiv, imgSrc;
	var aItems = this.menuItems;
	
	for (i=0; i<aItems.length; i++)
	{
		if (!aItems[i].sCaption)	// Ignore separators
		{
			continue;
		}
		// Retrieve the objects making up the visible menu item
		itemDiv = aItems[i].ItemDiv;
		
        // Check enabled state and set correct class and image
		itemDiv.fEnabled = eval(aItems[i].sEnabled)
		
		if (itemDiv.fEnabled)
		{
			itemDiv.className = 'ContextMenuItem';
		}
		else
		{
			itemDiv.className = 'ContextMenuItemDisabled';
		}
    }
}

ContextMenu.prototype._FindNodePosition = function(docNode, xyCoord, doOffsetCheck)
{
    if (!xyCoord) {
        return 0;
    }
    
    var currentPosition = 0;
    var coord;
    if (xyCoord == "X") 
    {
        coord = "offsetLeft";    
    }
    else if (xyCoord == "Y")
    {
        coord = "offsetTop";
    }
    
    if (docNode.offsetParent && (this.alignedTo || this.renderAligned || doOffsetCheck))
    {
        while (docNode.offsetParent)
        {
            currentPosition += docNode[coord];
            docNode = docNode.offsetParent;
        }
    }
    
    if (docNode.ownerDocument || docNode == document)
    {
        var doc = docNode.ownerDocument || document;
        var win = EPi.GetDocumentWindow(doc);
        
        if (win.parent && !this._IsCrossSite(win.parent)) {
            var parentDoc = EPi.GetDocument(win.parent);

            var iframes = parentDoc.getElementsByTagName("iframe");
            for (var i=0; i<iframes.length; i++)
            {
                if (iframes[i].contentWindow == win) {
                    currentPosition += this._FindNodePosition(iframes[i], xyCoord, true);
                }
            }
        }
    }
    return (currentPosition);
}

// Handling for mouseover action
// this keyword is current ContextMenu
ContextMenu.prototype._MenuItemMouseOver = function (e)
{
	var nodeMenuItem = e.currentTarget;
	var currentIndex = nodeMenuItem.MenuIndex;
	var oMenuItem = this.menuItems[currentIndex];
	
	if (!oMenuItem.sJavascript && !oMenuItem.sURL)
	{
		nodeMenuItem.style.cursor = "default";
	}
	
	if (nodeMenuItem.fEnabled)
	{		
		nodeMenuItem.className = 'ContextMenuItem-Active';
	}
	else
	{
		nodeMenuItem.className = 'ContextMenuItemDisabled-Active';
	}

	if(this.openedByMenuItem != currentIndex)
	{
		if(this.openedByMenuItem!=null)
		{
			var openerItem = this.menuItems[this.openedByMenuItem];
			if(openerItem.oSubMenu)
			{
				openerItem.oSubMenu._Hide();
				if (openerItem.ItemDiv.fEnabled)
	            {
		            openerItem.ItemDiv.className = 'ContextMenuItem';
	            }
	            else
	            {
		            openerItem.ItemDiv.className = 'ContextMenuItemDisabled';
	            }
				this.openedByMenuItem = null;
			}
		}
		
		if(oMenuItem.oSubMenu && nodeMenuItem.fEnabled)
		{
			this.openedByMenuItem = currentIndex;
			oMenuItem.oSubMenu.Show(e, nodeMenuItem, this);            
		}
	}
}

// Handling for mouse-out action
// this keyword is current ContextMenu
ContextMenu.prototype._MenuItemMouseOut = function (e)
{
	var nodeMenuItem = e.currentTarget;
	var currentIndex = nodeMenuItem.MenuIndex;

	if (this.openedByMenuItem == currentIndex)
	{
		return;
	}
	
	if (nodeMenuItem.fEnabled)
	{
		nodeMenuItem.className = 'ContextMenuItem';
	}
	else
	{
		nodeMenuItem.className = 'ContextMenuItemDisabled';
	}
}

// Handling for click action
// this keyword is current ContextMenu
ContextMenu.prototype._MenuItemClick = function(e) {
    // Don't close menu by propagating event. Has to be closed manually.
    e.stopPropagation();
    e.preventDefault();
    var nodeMenuItem = e.currentTarget;


    //If disabled menu item click, do nothing.
    if (!nodeMenuItem.fEnabled) {
        return;
    }

    var currentIndex = nodeMenuItem.MenuIndex;
    var oMenuItem = this.menuItems[currentIndex];

    if (oMenuItem.oSubMenu) {
        // If the menu item has a sub menu we shouldn't do anything, but to be able to close context menu 
        // after click on this type of menu item we need to set focus to topWindow.
        this.topWindow.focus();
        return;
    }

    if (document.selection && this.currentSelection) {
        this.currentSelection.select();
        this.currentSelection = null;
    }

    if (oMenuItem.sJavascript || oMenuItem.sURL) {
        this._HideRecursive(true);
        if (oMenuItem.sJavascript) {
            eval(oMenuItem.sJavascript);
        }
        if (oMenuItem.sURL) {
            window.open(oMenuItem.sURL, '_top');
        }
    }

}

// _CreatePopupWindow creates and configures the popupWindow object to render the menu in
ContextMenu.prototype._CreatePopupWindow = function ()
{
    this.popupWindow = this.topDocument.createElement("div");
	this.popupWindow.unselectable = "on";
	this.popupWindow.style.position = "absolute";
	this.popupWindow.className = "ContextMenu";
	// IframeCover is used to cover windowed controls in IE
	this.iframeCover = this.topDocument.createElement("iframe");
	// We might get a popup question about non-secure items if using https and the iframes location is not secure.
	if (CONTEXT_MENU_COVER_SRC != null)
	{
	    this.iframeCover.src = CONTEXT_MENU_COVER_SRC;
	}
	this.iframeCover.style.position = "absolute";
	this.iframeCover.className = "ContextMenuCover";
	this.iframeCover.unselectable = "on";
	this.iframeCover.style.display = "none";
	this.openedByMenuItem = null;
	
	this.topDocument.body.appendChild(this.iframeCover);
	this.topDocument.body.appendChild(this.popupWindow);
}


/* Class for menuitem */
function MenuItem(sCaption, sURL, sJavascript, sEnabled, sImageURL, oSubMenu, sortKey)
{
	this.oWindow            = window;
	this.sCaption			= sCaption;
	this.sURL				= sURL;   
	this.sJavascript		= sJavascript;
	this.sEnabled			= sEnabled;
	this.sImageURL			= sImageURL;
	this.oSubMenu			= oSubMenu;
	
	if (sortKey)
		this.sortKey		= sortKey;
}

/* Callback functions allowing for functions to be called once the menu object is created on the clientside */
function ExecuteMenuCallbackFunctions(menuID)
{
	var callbackFunctions = eval("window." + menuID + "_callbackFunctions");
	
	if (callbackFunctions)
	{
		var index;
		var callbackFunc;
		
		for(index = 0; index < callbackFunctions.length; index++)
		{
			callbackFunc = callbackFunctions[index];
			callbackFunc();
		}
	}
}

function RegisterMenuCallbackFunction(menuID, func)
{
	var callbackArrayName = "window." + menuID + "_callbackFunctions";
	var callbackFunctions = eval(callbackArrayName);

	if (!callbackFunctions)
	{
		execScript(callbackArrayName + " = new Array();");
		callbackFunctions = eval(callbackArrayName);
	}
	callbackFunctions.push(func);		
}

