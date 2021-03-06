﻿jQuery.AjaxPageView = function (options) {

    jQuery.AjaxPageView.defaults = {
        Link_Class: "callajax",
        View_Area_Id: "view",
        Page_Area_Class: "page",
        Slide_speed: 600
    };

    var opts = $.extend({}, jQuery.AjaxPageView.defaults, options);

    Execute();

    function Execute() {
        var $view_area = $('#' + opts.View_Area_Id);
		var view_width = $(window).width() - $('#left').outerWidth() - $('.page_move_right').outerWidth() - $('.page_move_left').outerWidth();
		var view_height = $(window).height() - $('#header').outerHeight();

		var	LeftLinks_HasUl = $('#left ul li').filter(':has(ul)').children('a');
		LeftLinks_HasUl.attr('href', '').removeClass('callajax');

		$view_area.width(view_width);

		$('#left_back').height(view_height);

        var $base_width = $view_area.width();
        var $base_height = $view_area.height();

        var $area_width, $area_height, $this, $page_area, $link_url

        $('.' + opts.Link_Class).click(function (e) {
            e.preventDefault();

			if ($.fn.IsAjaxRunning() == false)
			{
				$this = $(this);

				$link_url = $this.attr('href');

				if ($link_url == "")
				{
					$.fn.Error("Nothing connect link.");
					$link_url = "/error_page.html";
				}

				$area_width = $view_area.width();
				$area_height = $view_area.height();

				$page_area = $('.' + opts.Page_Area_Class);

				$.ajax({
					type: "GET",
					url: $link_url,
					dataType: "html",
					cache: false,
					success: function (data) {
						SlidePage(data);
					},
					complete : function(){
						var $listNotHasUl = $('#left').find('li').filter(':not(:has(ul))');
						$listNotHasUl.children('a').removeClass('active');

						$this.addClass('active');
					},
					error : function(a, b, c, d){
						var error_msg = "";

						if (a.readyState == "4")
						{
							error_msg += a.status + " " + a.statusText + "<br/>";
							error_msg += "Is trying to connect url - '" + $link_url + "'";
						}

						$('.page').html(error_msg);
					}
				});
			}

            function SlidePage(data) {

                var $clone = $page_area.clone().css({ left: $area_width }); 

				$page_area.find('*').remove();

				$view_area.children('.page').after($clone);	

				$clone.html(data); // include script execute

				$view_area.height($(window).height() - $('#header').outerHeight()-1);

                $page_area.animate({ left: $base_width * -1 }, opts.Slide_speed, function () {

                });

                $clone.animate({ left: 0 }, opts.Slide_speed, function () {
                    $(this).prev().remove();

					if ($(this).height() > $base_height) {
						$view_area.height($(this).height());
						$('#left_back').height($('#contents').height());
					}

					if ($page_area.width() > $base_width) {
						$page_area.width($base_width);
					}

					//PageMoveRL($view_area, $clone);
                });
            }
        });

        $(window).resize(function () {
			var view_width = $(window).width() - $('#left').outerWidth() - $('.page_move_right').outerWidth() - $('.page_move_left').outerWidth();
			var view_height = $(window).height() - $('#header').outerHeight() - 1;

			$('#view').width(view_width).height(view_height);
			$('#left_back').height(view_height);

            $('.page').css({ left: 0 });

			//PageMoveRL($view_area, $('.page'));

			ajax_indicator_padding = parseInt( ($(window).height() - $('#header').outerHeight()) / 2 );
			
			$('#view').append(jQuery(ajax_indicator));
			$('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });
        });
    }
};