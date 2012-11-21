(function($){

	// Private varialble deffinitions

	var body = $('body'),
		win = $(window),
		popup, popupBG;

	var frameCache = {};
	var frameCacheDiv = $('<div class="frameCacheDiv">').appendTo('body');
	var currentIframe;

	// The main plugin code

	$.fn.frameWarp = function(settings){

		// Supplying default settings

		settings = $.extend({
			cache: false,
			url: '',
			width:700,
			height:550,
			closeOnBackgroundClick: true,
			onMessage:function(){},
			onShow:function(){}
		}, settings);

		this.on('click',function(e){
			
			e.preventDefault();

			var elem = $(this),
				offset = elem.offset();

			// The center of the button
			var buttonCenter = {
				x: offset.left - win.scrollLeft() + elem.outerWidth()/2,
				y: offset.top - win.scrollTop() + elem.outerHeight()/2
			};
		
			// The center of the window
			var windowCenter = {
				x: win.width()/2,
				y: win.height()/2
			};
			settings.width = Math.max(400, win.width()-400);
			settings.height = Math.max(300, win.height() - 140);

			// If no URL is specified, use the href attribute.
			// This is useful for progressively enhancing links.

			if(!settings.url && elem.attr('href')){
				settings.url = elem.attr('href');
			}

			// The dark background

			popupBG = $('<div>',{'class':'popupBG'}).appendTo(body);

			popupBG.click(function(){

				if(settings.closeOnBackgroundClick){
					hide();
				}

			}).animate({	// jQuery++ CSS3 animation
				'opacity':1
			},400);


			// The popup

			popup = $('<div>').addClass('popup').css({
				width	: 0,
				height	: 0,
				top		: buttonCenter.y,
				left	: buttonCenter.x - 35
			});

			// Append it to the page, and trigger a CSS3 animation
			popup.appendTo(body).animate({
				'width'					: settings.width,
				'top'					: windowCenter.y - settings.height/2,
				'left'					: windowCenter.x - settings.width/2,
				'border-top-width'		: settings.height,
				'border-right-width'	: 0,
				'border-left-width'		: 0
			},200,function(){

				popup.addClass('loading').css({
					'width': settings.width,
					'height': settings.height
				});

				var iframe;

				// If this iframe already exists in the cache
				if(settings.cache && settings.url in frameCache){
					iframe = frameCache[settings.url].show();
				}
				else{

					iframe = $('<iframe>',{
						'src' : settings.url,
						'css' : {
							'width' : settings.width,
							'height' : settings.height,
						}
					});

					// If the cache is enabled, add the frame to it
					if(settings.cache){
						frameCache[settings.url] = iframe;
						iframe.data('cached',true);
						settings.onShow();
					}
					else{
						
						// remove non-cached iframes
						frameCacheDiv.find('iframe').each(function(){
							var f = $(this);
							if(!f.data('cached')){
								f.remove();
							}
						});
					}

					iframe.ready(function(){
						frameCacheDiv.append(iframe);
						setUpAPI(iframe, settings);
						settings.onShow();
					});
				}

				currentIframe = iframe;

			});

		});

		return this;
	};

	// Helper Functions

	function hide(){

		if(currentIframe){
			currentIframe.hide();
			currentIframe = null;
		}

		popupBG.remove();
		popup.remove();
	}

	function setUpAPI(iframe, settings){

		if(sameOrigin(settings.url)){

			// Exposing a minimal API to the iframe
			iframe[0].contentWindow.frameWarp = {
				hide: hide,
				sendMessage:function(param){
					return settings.onMessage(param);
				}
			};
		}
	}

	function sameOrigin(url){

		// Compare whether the url belongs to the
		// local site or is remote

		return (getOrigin(url) == getOrigin(location.href));
	}

	function getOrigin(url){

		// Using an anchor element to
		// parse the URL

		var a = document.createElement('a');
		a.href = url;

		return a.protocol+'//'+a.hostname;
	}

})(jQuery);