(function($){

	var icon_img = { 'dot' : '/images/icon/icon_dot.png', 'plus' : '/images/icon/icon_plus.png', 'minus' : '/images/icon/icon_minus.png' };
	var ajaxRunning = false;

	$.fn.extend({
		
		TotalMenu : function(options){

			// Default Param
			settings = jQuery.extend({
				MainIndexUrl : "",
				HeadMenuWrapId : "head",
				HeadMenuRel : "",
				LeftMenuWrapId : "left",
				LeftMenuText : "",
				ViewAreaId: "view",
				PageAreaClass: "page",
			}, options);

			// Variable - Start
			var ajax_indicator = "", ajax_indicator_padding;

			ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: relative; top: 0; height: 100%; z-index:9998;text-align:center; '>"
			ajax_indicator = ajax_indicator + " <div id='ajax_indicator_back' style='height: 100%; background-color: #000; opacity : 0.3; -ms-filter: alpha(opacity=30); filter: alpha(opacity=30);'></div>";
			ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999;'><img src='/images/ajax-loader.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
			ajax_indicator = ajax_indicator + "</div>";

			ajax_indicator_padding = parseInt( ($(window).height() - $('#header').outerHeight()) / 2 );
			
			$('#view').append(jQuery(ajax_indicator));
			$('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });

			if ($.cookie('head_rel') != "")
			{
				settings.HeadMenuRel = $.cookie('head_rel');
			}

			// Variable - End

			return this.each(function(){
				
				var $objs = {
						'this' : $(this)
					,	'header' : $('#' + settings.HeadMenuWrapId)	// navi
					,	'left' : $('#' + settings.LeftMenuWrapId)	// left
					,	'view' : $('#' + settings.ViewAreaId)	// view
					,	'page' : $('.' + settings.PageAreaClass)	// page
				}

				if ( $objs.header.length < 1 || $objs.left.length < 1)
				{
					Error('This document do not have elements');
					return false;
				}
				else
				{
					var menu_list = {
						HeadMenuList : $objs.header.find('ul li'),
						LeftMenuList : $objs.left.find('ul li')
					};

					var menu_links = {
						HeadLinks : menu_list.HeadMenuList.find('a'),
						LeftLinks : menu_list.LeftMenuList.find('a'),
						LeftLinks_HasUl : menu_list.LeftMenuList.filter(':has(ul)').children('a'),
						LeftLinks_NHasUl : menu_list.LeftMenuList.filter(':not(:has(ul))').children('a')
					};

					var menu_active = {
						ActiveHeadMenu : function(menutext){
							menu_links.HeadLinks.each(function(){							
								var rel = $(this).attr('rel');

								if (rel == menutext)
									$(this).addClass('active');
							});
						},
						ActiveLeftMenu : function(HeadMenuRel){
							return $('ul#' + HeadMenuRel)
						}
					};

					var LeftFirstMenuOpen = function($activeLeftUl){

						var $firstLi = "", $parentsList, $href;

						$activeLeftUl.siblings('ul').hide()
									.find('li a').removeClass('active')
									.end().end().show();	

						$firstLi = $activeLeftUl.find('li').filter(':not(:has(ul))').first();
						$parentsList = $firstLi.parentsUntil('#' + settings.LeftMenuWrapId);

						$activeLeftUl.find('li a').removeClass('active');
						$firstLi.find('a').addClass('active');

						for (var i = 0; i < $parentsList.length; i++) {
							if ($parentsList.get(i).tagName == "UL") {
								$parentsList.eq(i).css({ display: 'block' });
							}
							else if ($parentsList.get(i).tagName == "LI") {
								$parentsList.eq(i).css({ 'backgroundImage': 'url(' + icon_img.minus + ')' });
							}
						}			
					};

					var Method = {

						Init : function(){
							var view_width = $(window).width() - $('#left').outerWidth() - $('.page_move_right').outerWidth() - $('.page_move_left').outerWidth() - 17;
							$objs.view.width(view_width);

							var $activeLeftUl;

							$.fn.LinkDisable(menu_links.HeadLinks);
							$.fn.LinkDisable(menu_links.LeftLinks);

							if (settings.MainIndexUrl != "")
							{
								$.fn.LoadLinkData( settings.MainIndexUrl, 'Main' );
								menu_list.LeftMenuList.hide();
							}
							else
							{
								menu_active.ActiveHeadMenu(settings.HeadMenuRel);	// head menu active
								$objs.left.children('ul').not( menu_active.ActiveLeftMenu(settings.HeadMenuRel) ).hide();	// head menu matching left menu view

								$activeLeftUl = menu_active.ActiveLeftMenu( settings.HeadMenuRel );

								$.fn.LoadLinkData( $activeLeftUl );
								LeftFirstMenuOpen( $activeLeftUl );
							}

							menu_list.LeftMenuList.css({ paddingLeft: '12px' });
							menu_links.LeftLinks_HasUl.end().find('ul').hide()
													  .end().css({ background: 'url(' + icon_img.plus + ') no-repeat 0 2px' });

							menu_links.LeftLinks_NHasUl.end().css({ background: 'url(' + icon_img.dot + ') no-repeat center left' });
						},
						Click : function(){
							var $this;

							menu_links.HeadLinks.click(function(){

								if (settings.MainIndexUrl != "")
									menu_list.LeftMenuList.show();

								var $activeLeftUl;

								$this = $(this);

								menu_links.HeadLinks.removeClass('active');
								$this.addClass('active');

								$activeLeftUl = menu_active.ActiveLeftMenu( $this.attr('rel') );							
								$.fn.LoadLinkData( $activeLeftUl );
								LeftFirstMenuOpen( $activeLeftUl );
							});
							
							menu_links.LeftLinks_HasUl.click(function(e){
								$this = $(this);

								if (this == e.target) {
									if ($this.parent().children("ul").is(':hidden')) {
										$this.parent()
												.css({ backgroundImage: 'url(' + icon_img.minus + ')' })
												.children("ul").show();
									}
									else {
										$this.parent()
												.css({ backgroundImage: 'url(' + icon_img.plus + ')' })
												.children("ul").hide();
									}
								}
							});

							menu_links.LeftLinks_NHasUl.click(function(e){
								$this = $(this);

								$this.ajaxSubmit({
									action : $this.attr('href')
								}, function(){
									$this.parent('li').siblings('li').children('a').removeClass('active')
										.end().end().end()
										.addClass('active');
								});
							});
						},
						Resize : function(){
							$(window).bind('resize', function(e)
							{
								$objs.page.empty().find('*').remove()

								window.resizeEvt;
								$(window).resize(function()
								{
									clearTimeout(window.resizeEvt);
									window.resizeEvt = setTimeout(function()
									{
										var active_headmenu = menu_links.HeadLinks.filter('.active');
										var active_leftmenu = menu_links.LeftLinks.filter('.active');

										$.cookie('head_rel', active_headmenu.attr('rel'));  

										location.reload();
									}, 250);
								});
							});	
						}
					};

					Method.Init();
					Method.Click();
					Method.Resize();

					$.fn.AjaxCheck();	
				}
			});
		},
		LoadLinkData : function($activeLeftUl, type){
			var href;

			if ($.fn.IsAjaxRunning() == false)
			{
				if (type == "Main")
				{
					href = $activeLeftUl;
				}
				else
				{
					href = $activeLeftUl.find('li').filter(':not(:has(ul))').first().children('a').attr('href');

					$('#view').height($(window).height() - $('#header').outerHeight() - 1);

					if (href == "")
					{
						$.fn.Error("Nothing connect link.");
						href = "/error_page.html";
					}
				}

				$.ajax({
					type: "GET",
					url: href,
					dataType: "html",
					cache: false,
					success: function (data) {
						Revision_Height('.page', data);
					},
					error : function(a, b, c, d){
						var error_msg = "";

						if (a.readyState == "4")
						{
							error_msg += a.status + " " + a.statusText + "<br/>";
							error_msg += "Is trying to connect url - '" + href + "'";
						}

						$('.page').html(error_msg);
					}
				});
			}
		},
		Error : function(msg){
			if (window.console)
				console.log(msg);
			else
				alert(msg);
		},
		LinkDisable : function(linkObj, callMethod){
			var callbacks = $.Callbacks();

			linkObj.click(function(e){
				e.preventDefault();

				if (typeof callMethod != "undefined")
				{
					callbacks.add(callMethod);
					callbacks.fire(e.toElement);
					callbacks.empty();
				}
			});
		},
		ajaxSubmit : function(options, callMethod){

			var callbacks = $.Callbacks();
			var tagName = "", formaction = "";

			if ($.fn.IsAjaxRunning() == false)
			{
				// Default Param
				settings = jQuery.extend({
					method : 'POST',
					action : '',
					datatype : 'html',
					target : '.page'
				}, options || {});

				return this.each(function(){
					var $this = $(this);

					tagName = this.tagName;

					if (tagName == "A" || tagName == "FORM")
					{						
						if (tagName == "A")
							settings.action = $this.attr('href');
						else if (tagName == "FORM"){
							formaction = $this.attr('action');
							if (typeof formaction != "undefined" )
							{
								settings.action = formaction;
							}						
						}

						if (settings.action == "")
						{
							$.fn.Error("Nothing connect link.");
							settings.action = "/error_page.html";
						}						
					}

					var methods = {
						basic : function($this){
							$.ajax({
								type: settings.method,
								url: settings.action,
								dataType: settings.datatype,
								data : $this.serialize(),
								cache: false,
								success: function (data) {

									Revision_Height(settings.target, data);

									callbacks.add(callMethod);
									callbacks.fire(data);
								},
								error : function(a, b, c, d){
									var error_msg = "";
									error_msg += a.responseText + '<br/>';

									$(settings.target).html(error_msg);
								}
							});											
						}
					};

					methods.basic($this);				
				});
			}
		},
		AjaxCheck : function(){
			$(document)
				.ajaxStart(function(){
					$('#ajax_indicator').show();
					ajaxRunning = true;
				})
				.ajaxComplete(function(){
					setTimeout( function(){	
						$('#ajax_indicator').fadeOut(function(){
							ajaxRunning = false;
						});  						
					}, 300);	
				})
				.ajaxError(function(event, jqxhr, settings, exception){
					//$.fn.Error(jqxhr.status + '-' + jqxhr.statusText);				
					//$.fn.Error(jqxhr.responseText);
					//$.fn.Error(settings.url);
				});
		},
		IsAjaxRunning : function(){
			return ajaxRunning;
		}
	});

	function Revision_Height(target, data)
	{
		if ($('#view').height() > $(window).height() - $('#header').outerHeight() )
		{
			$('#view').height( $(window).height() - $('#header').outerHeight() );
		}

		$(target).html(data);

		if ($('.page').height() > $('#view').height())
		{
			$('#view').height($('.page').height() + 30 );
		}

		$('#left_back').height($('#contents').height());

		//PageMoveRL($('#view'), $('.page'));		
	}
})(jQuery);