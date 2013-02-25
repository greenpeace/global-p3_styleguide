var Main = function ($) {
	var priv = {
		ShowOptions: function ($selectArea, id) {
			if ($('#optionsDiv' + id).length == 0) {
				var $outerDiv = $('<div id="optionsDiv' + id + '" class="outtaHere optionsDivInvisible"></div>');

				var $ul = $('<ul></ul>');
				$('select option', $selectArea.parent()).each(function (i) {
					var $li = $('<li><a href="' + $(this).val() + '">' + $(this).text() + '</a></li>');
					$ul.append($li);
				});

				$outerDiv.append($ul);

				var width = 215;
				var sAreaWidth = $selectArea.width() - 1;
				var attrClass = $('select', $selectArea.parent()).attr('class');
				if (attrClass != null && attrClass.indexOf('width;') != -1) {
					width = parseInt(attrClass.split(';')[1]);
				}
				if (sAreaWidth > width) {
					width = sAreaWidth;
				} else {
					$selectArea.width(width + 'px');
				}

				var position = $selectArea.offset();
				$outerDiv.css({
					'top': (position.top + $selectArea.outerHeight(true)) + 'px',
					'width': width + 'px',
					'overflow-y': 'auto',
					'max-height': '450px',
					'direction': 'ltr',
					'right': 'auto',
					'left': position.left + 'px'
				});

				$('body').append($outerDiv);
			} else {
				var width = 215;
				var sAreaWidth = $selectArea.width() - 1;
				var attrClass = $('select', $selectArea.parent()).attr('class');
				if (attrClass != null && attrClass.indexOf('width;') != -1) {
					width = parseInt(attrClass.split(';')[1]);
				}
				if (sAreaWidth < width) {
					$selectArea.width(width + 'px');
				}
			}

			var curPosition = $selectArea.offset();
			$('#optionsDiv' + id).css({
				'right': 'auto',
				'left': curPosition.left + 'px'
			});
			$('#optionsDiv' + id).removeClass('optionsDivInvisible');
			$('#optionsDiv' + id).addClass('optionsDivVisible');
			$('#optionsDiv' + id).show();
		},

		HideAllOptions: function () {
			$('div.selectArea').removeClass('active-select').css('width', 'auto');
			$('div.optionsDivVisible').each(function (i) {
				$(this).addClass('optionsDivInvisible');
				$(this).removeClass('optionsDivVisible');
				$(this).hide();
			});
		}
	};

	/** @scope Main */
	return {
		OnReady: function () {

			// nro selector
			$('body').bind('click', function () {
				priv.HideAllOptions();
			});
			$('#header div.selectArea').bind('click', function () {
				if ($(this).hasClass('active-select')) {
					priv.HideAllOptions();
					$(this).removeClass('active-select');
				} else {
					priv.HideAllOptions();
					$(this).addClass('active-select');
					priv.ShowOptions($(this), this.id);
				}
				return false;
			});

			// set active class for the top menu
			$('#nav .drop-holder')
				.bind('mouseenter', function () {
				$(this).prev().addClass('active-item')
			})
				.bind('mouseleave', function () {
				$(this).prev().removeClass('active-item')
			});

			//geolocation
			if (geoPosition.init()) {
				geoPosition.getCurrentPosition(
				//success
				function (loc) {
					$("#geolocationNotification").removeClass("hidden");
				},
				//error
				function () {
					//determine location from ip                            
				});
			} else { /*No Geolocation API available, determine location from IP*/
			}
		}
	};
}(jQuery);

$(document).ready(function ($) {
	Main.OnReady();
});
