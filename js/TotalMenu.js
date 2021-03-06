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

			ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: absolute; top: 0; width: 100%; height: 100%; z-index:9998;text-align:center; '>"
			ajax_indicator = ajax_indicator + " <div id='ajax_indicator_back' style='height: 100%; background-color: #000; opacity : 0.5; -ms-filter: alpha(opacity=30); filter: alpha(opacity=30);'></div>";
			ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999; '><img src='/images/ajax-loader.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
			ajax_indicator = ajax_indicator + "</div>";

			ajax_indicator_padding = parseInt( $(window).height() / 2 );

			$('body').append(jQuery(ajax_indicator));
			$('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });

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

					var Local_Method = {
						Set_Container_Per_Width : function(){
							var persent = (($(window).width() - $objs.left.width()) / $(window).width()) * 100 + '%';
							$('#container').css('width', persent);
						}
					};

					var Method = {

						Init : function(){

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

							Local_Method.Set_Container_Per_Width();
						},
						Click : function(){
							var $this, href;

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
								href = $this.attr('href');

								$.fn.SetLocationHash(href);

								$this.ajaxSubmit({
									action : href
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
								window.resizeEvt;
								$(window).resize(function()
								{
									clearTimeout(window.resizeEvt);
									window.resizeEvt = setTimeout(function()
									{
										Local_Method.Set_Container_Per_Width();
										$('#view').height( $('.page').height() );
										$('#left').height( $.fn.GetBaseHeight() );

										ajax_indicator_padding = parseInt( $(window).height() / 2 );
										$('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });

									}, 250);
								});
							});	
						},
						HashChange : function(){
							$(window).on('hashchange', function(e){
								var newUrl = e.originalEvent.newURL;
								
								newUrl = newUrl.replace(this.location.origin + '/#','') + '.html';

								$(this).ajaxSubmit({
									action : newUrl
								});
							});
						}
					};

					Method.Init();
					Method.Click();
					Method.Resize();
					Method.HashChange();

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

					if (href == "")
					{
						$.fn.Error("Nothing connect link.");
						href = "/error_page.html";
					}
				}

				//$.fn.SetLocationHash(href);

				$.ajax({
					type: "GET",
					url: href,
					dataType: "html",
					cache: false,
					beforeSend : function(){
						$('#view').height($(window).height() - $('#header').outerHeight() - 1);
					},
					success: function (data) {
						$('.page').html(data);

						$('#view').height( $('.page').height() );
						$('#left').height( $.fn.GetBaseHeight() );
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
					callbacks.fire(e.target);
					callbacks.empty();
				}
			});
		},
		ajaxSubmit : function(options, callMethod){

			var callbacks = $.Callbacks();
			var tagName = "", formaction = "", target = "";

			// Default Param
			settings = jQuery.extend({
				method : 'POST',
				action : '',
				datatype : 'html',
				target : '.page',
				runningExecute : false
			}, options || {});

			target = settings.target;

			if ($.fn.IsAjaxRunning() == false || settings.runningExecute == true)
			{

				return this.each(function(){

					var $this = $(this);

					$.fn.LinkDisable($this);

					tagName = this.tagName;

					if (tagName == "A" || tagName == "FORM")
					{						
						if (settings.action == "")
						{

							if (tagName == "A"){
								settings.action = $this.attr('href');
							}
							else if (tagName == "FORM"){
								formaction = $this.attr('action');
								if (typeof formaction != "undefined" )
								{
									settings.action = formaction;
								}						
							}

							if (settings.action == "" || typeof settings.action == "undefined")
							{
								$.fn.Error("Nothing connect link.");
								settings.action = "/error_page.html";
								$.fn.SetLocationHash(settings.action);
							}						
						}
					}

//					$.fn.SetLocationHash(settings.action);
					settings.action = $.fn.ParameterEscape(settings.action);


					var methods = {
						basic : function($this){
							$.ajax({
								type: settings.method,
								url: settings.action,
								dataType: settings.datatype,
								data : $this.serialize(),
								cache: false,
								beforeSend : function(){
									$('#view').height($(window).height() - $('#header').outerHeight() - 1);
								},
								success: function (data) {
									$(target).html(data);
									$('#view').height( $('.page').height() );
									$('#left').height( $.fn.GetBaseHeight() );

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
					window.scrollTo(0,0);
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
		},
		GetBaseHeight : function(){
			return $(window).height() - $('#header').height();
		},
		SetLocationHash : function(url){
			document.location.hash = url.replace('.html','');
		},
		ParameterEscape : function(url){

			var return_url = "";
			var array_action = "", array_param = "", array_param_len = 0;
			var action_src = "", action_param = "", new_param = "";

			array_action = url.split("?");

			if (array_action.length > 1)
			{
				action_src = array_action[0];
				action_param = array_action[1];
				new_param = "";
				
				array_param = action_param.split("&");
				array_param_len = array_param.length;

				for(var item in array_param)
				{
					var key = array_param[item].split("=")[0];
					var val = escape( array_param[item].split("=")[1]);

					new_param = new_param + key + "=" + val

					if (array_param_len > 1 && (array_param_len - 1 > item))
					{
						new_param = new_param + "&";
					}
				}

				return_url = action_src + "?" + new_param;
			}
			else
				return_url = url;

			return return_url;
		}
	});

})(jQuery);