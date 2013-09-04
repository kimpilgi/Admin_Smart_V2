function SetCookie(cKey, cValue, validity) {
    var date = new Date();
    date.setDate(date.getDate() + validity);
    document.cookie = cKey + '=' + escape(cValue) + ';expires=' + date.toGMTString() + ';path=/';
}

function GetCookie(cKey) {
    var allcookies = document.cookie;

    var cookies = allcookies.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var keyValues = cookies[i].split("=");
        if (keyValues[0] == cKey) {
            return unescape(keyValues[1]);
        }
    }
    return "";
}

function DelCookie(cKey) {
    var date = new Date();
    var validity = -1;
    date.setDate(date.getDate() + validity);
    document.cookie = cKey + "=;expires=" + date.toGMTString() + ';path=/';
}
/*
$.TreeMenu_v01 = function (options) {

    $.TreeMenu_v01.defaults = {
        Div_Id: "treemenu",
		Open_Code : ""
    };

    var opts = $.extend({}, $.TreeMenu_v01.defaults, options);

    var $topobj = $('#' + opts.Div_Id);
    var list_dot_img = "/images/icon/icon_dot.png"
      , list_plus_img = "/images/icon/icon_plus.png"
      , list_minus_img = "/images/icon/icon_minus.png";

    return Execute();

    function Execute() {
        Init();
        MenuClick();
        FirstOpen();
        SlideOnOff();
    }

    function Init() {
        $topobj.find('li').css({ paddingLeft: '12px' })
                    .filter(':has(ul)')
                        .children('a').attr('href', '').removeClass('callajax').end()
                    .find('ul').hide().end()
                    .css({ background: 'url(' + list_plus_img + ') no-repeat 0 2px' }).end()
               .filter(':not(:has(ul))').css({ background: 'url(' + list_dot_img + ') no-repeat center left' })

        $topobj.find('li').filter(':has(ul)').children('a').click(function (e) {
            e.preventDefault();
        });

        var slideonoff_cookie = GetCookie("SlideOnOff");

        if (slideonoff_cookie == "On") {
            $topobj.find('ul').show();
            $topobj.find('li').filter(':has(ul)')
					.css({ cursor: 'pointer', backgroundImage: 'url(' + list_minus_img + ')' });
        }
    }

    function MenuClick() {
        var $this
          , $listHasUl = $topobj.find('li').filter(':has(ul)')
          , $listNotHasUl = $topobj.find('li').filter(':not(:has(ul))');

        $listHasUl.children('a').click(function (e) {
            $this = $(this);

            if (this == e.target) {
                if ($this.parent().children("ul").is(':hidden')) {
                    $this.parent()
                            .css({ backgroundImage: 'url(' + list_minus_img + ')' })
                            .children("ul").show();
                }
                else {
                    $this.parent()
                            .css({ backgroundImage: 'url(' + list_plus_img + ')' })
                            .children("ul").hide();
                }
            }
        });
    }

    function FirstOpen() {

        var $firstLi = "";

		if (opts.Open_Code == ""){
			$firstLi = $topobj.find('li').filter(':not(:has(ul))').first();
		}
		else{
			$firstLi = $topobj.find('li a[pid='+opts.Open_Code+']').parent();

			if ($firstLi.length == 0)
			{
				$firstLi = $topobj.find('li').filter(':not(:has(ul))').first();
			}
		}

        var $parentsList = $firstLi.parentsUntil('#' + opts.Div_Id),
            $href = $firstLi.find('a').attr('href');

        for (var i = 0; i < $parentsList.length; i++) {
            if ($parentsList.get(i).tagName == "UL") {
                $parentsList.eq(i).css({ display: 'block' });
            }
            else if ($parentsList.get(i).tagName == "LI") {
                $parentsList.eq(i).css({ 'backgroundImage': 'url(' + list_minus_img + ')' });
            }
        }

        $firstLi.find('a').addClass('active');

        var ajax_indicator_padding = parseInt( ($(window).height() - $('#header').outerHeight()) / 2 );
        var ajax_indicator = "";
        ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: relative; top: 0; height: 100%; z-index:9998;text-align:center; '>"
        ajax_indicator = ajax_indicator + " <div id='ajax_indicator_back' style='height: 100%; background-color: #000; opacity : 0.3; -ms-filter: alpha(opacity=30); filter: alpha(opacity=30);'></div>";
        ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999;'><img src='/images/etc/loading.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
        ajax_indicator = ajax_indicator + "</div>";

        var loadDivObj = jQuery(ajax_indicator);

		$('#view').append(loadDivObj);

		loadDivObj.find('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });
		loadDivObj.fadeIn(function () {

			setTimeout(function () {
				$.ajax({
					type: "GET",
					url: $href,
					dataType: "html",
					cache: false,
					success: function (data) {
						loadDivObj.fadeOut(function () {
							$(this).remove();
							
							$('.page').html(data);

							$('#view').height($('.page').height());
							$('#left_back').height($('#view').height());

							/////
							PageMoveRL($('#view'), $('.page'));
						});
					},
					error: function (request, status, error) {
						alert(error);
					}
				});
			}, 200);
		});
    }

	function SelectedOpen()
	{
        var $firstLi = "";

		$firstLi = $topobj.find('li a.active').parent();

        var $parentsList = $firstLi.parentsUntil('#' + opts.Div_Id)

        for (var i = 0; i < $parentsList.length; i++) {
            if ($parentsList.get(i).tagName == "UL") {
                $parentsList.eq(i).css({ display: 'block' });
            }
            else if ($parentsList.get(i).tagName == "LI") {
                $parentsList.eq(i).css({ 'backgroundImage': 'url(' + list_minus_img + ')' });
            }
        }
	}

    function SlideOnOff() {
        var $SlideOnOff_Btn = $topobj.find('button');

        $SlideOnOff_Btn.click(function () {
            if ($(this).val() == "On") {
                $topobj.find('ul').show();

                $topobj.find('li').filter(':has(ul)')
					.css({ cursor: 'pointer', backgroundImage: 'url(' + list_minus_img + ')' });

                // cookies add
                SetCookie("SlideOnOff", "On", 30);
            }
            else if ($(this).val() == "Off") {
                // cookies remove
                DelCookie("SlideOnOff")

				Init();
				SelectedOpen();
            }
        });
    }
};
*/
function PageMoveRL(viewObj, pageObj)
{
		var distance = 0;

		$('.page_move_right').unbind('click');
		$('.page_move_left').unbind('click');

		if (viewObj.width() < pageObj.width()) {
			distance = ((pageObj.width() - viewObj.width() + 40) * -1) + 'px';

			$('.page_move_right').click(function (e) {
					$('.page').animate({ left: distance }, 500);
			});
		}
		else
		{
			$('.page_move_right').click(function (e) {
					pageObj.animate({ left: '-40px' }, 400, function(){
						$(this).animate({ left: 0 }, 300);
					});
			});
		}

		$('.page_move_left').click(function (e) {
				pageObj.animate({ left: 0 }, 500);
		});
}

jQuery.linkUline = function (options) {

    jQuery.linkUline.defaults = {
        className: "linkUlineStyle01",
        inSpeed: 300,
        outSpeed: 200,
        borderBottom: '2px solid #000'
    };

    var opts = $.extend({}, jQuery.linkUline.defaults, options);


    return $('.' + opts.className).bind('mouseenter', { state: "over" }, linkUlineStyle)
								   .bind('mouseleave', { state: "out" }, linkUlineStyle);

    function linkUlineStyle(e) {
        var thisObj = $(this);
        var thisObj_width = thisObj.css('width');
        var hrSwidth = (parseInt(thisObj_width) / 3) + 'px';
        var isHasHr = thisObj.find('hr').length;
        var data = e.data;

        if (data.state == "over") {
            if (isHasHr == 0) {
                thisObj.append('<hr/>');
                thisObj.find('hr').css('border', 'none').css({ width: hrSwidth, opacity: 0, borderBottom: opts.borderBottom }).filter(':not(:animated)').animate({ width: thisObj_width, opacity: '1' }, opts.inSpeed);
            }
        }
        else if (data.state == "out") {
            thisObj.find('hr').animate({ width: hrSwidth, opacity: '0' }, opts.outSpeed, function () { $(this).remove(); });
        }
    }
};

function AjaxExe(url)
{
	var ajax_indicator_padding = parseInt( ($(window).height() - $('#header').outerHeight()) / 2 );
	var ajax_indicator = "";
	ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: relative; top: 0; height: 100%; z-index:9998;text-align:center; '>"
	ajax_indicator = ajax_indicator + " <div id='ajax_indicator_back' style='height: 100%; background-color: #000; opacity : 0.3; -ms-filter: alpha(opacity=30); filter: alpha(opacity=30);'></div>";
	ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999;'><img src='/images/etc/loading.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
	ajax_indicator = ajax_indicator + "</div>";

	var loadDivObj = jQuery(ajax_indicator);

	$('#view').append(loadDivObj);

	loadDivObj.find('#ajax_indicator_circle').css({ top: ajax_indicator_padding + 'px' });
	loadDivObj.fadeIn(function () {

		setTimeout(function () {

			$.ajax({
				type: "POST",
				url: url,
				data: $('#ajaxform').serialize(),
				dataType: "html",
				cache: false,
				success: function (data) {
					loadDivObj.fadeOut(function () {
						$(this).remove();
						$('.page').html(data);

						$('#view').height($('.page').height());
						$('#left_back').height($('#view').height());

						$('.page').hide().fadeIn(1000);
					});

					$('#left a').removeClass('active');
					if(!($('#left a[href="'+url+'"]').hasClass('active'))){
						$('#left a[href="'+url+'"]').addClass('active');
					}
				}
			});
		}, 200);
	});
}

jQuery.CreateAjaxParam = function (options) {

    jQuery.CreateAjaxParam.defaults = {
		form_id : "ajaxform",
		input_type : "hidden",
		data : "",
		debug : false
    };

    var opts = $.extend({}, jQuery.CreateAjaxParam.defaults, options);


    return Execute();

    function Execute(){

		var $form = $('#'+opts.form_id).empty();

		var $type_mode = opts.input_type;
		if (opts.debug)
		{
			$type_mode = "text";
		}

		var $data = opts.data;
		var $arr_data = $data.split(',');

		for(var i = 0 ; i < $arr_data.length ; i++)
		{
			var input_name = $arr_data[i].split(':')[0].trim();
			var input_value = $arr_data[i].split(':')[1].trim();

			var temp_input = $('<input>').attr('type', $type_mode).attr('name', input_name).val(input_value);

			$form.append(temp_input);
		}
    }
}

function AjaxArea(areaid, loadFrm, url)
{
	var ajax_indicator_padding = parseInt( $('#'+areaid).height() / 2 );
	var ajax_indicator = "";

	$('#'+areaid).empty();
	ajax_indicator = ajax_indicator + "<div id='ajax_indicator' style='position: relative; top: 100px; z-index:9998;text-align:center; '>"
	ajax_indicator = ajax_indicator + " <div id='ajax_indicator_circle' style='position:absolute; top: 0; text-align:center; width: 100%; z-index:9999;'><img src='/images/etc/loading.gif' alt='LOADING... WAIT PLEASE' title='LOADING... WAIT PLEASE' /></div>";
	ajax_indicator = ajax_indicator + "</div>";

	var loadDivObj = jQuery(ajax_indicator);

	$('#'+areaid).append(loadDivObj);

	loadDivObj.fadeIn(function () {

		setTimeout(function () {

			$.ajax({
				type: "POST",
				url: url,
				data: $('#'+loadFrm).serialize(),
				dataType: "html",
				cache: false,
				success: function (data) {
					loadDivObj.fadeOut(function () {
						$(this).remove();

						if ($('#view').height() > $(window).height() - $('#header').outerHeight() )
						{
							$('#view').height( $(window).height() - $('#header').outerHeight() );
						}

						$('#'+areaid).html(data);

						if ($('.page').height() > $('#view').height())
						{
							$('#view').height($('.page').height() + 30 );
						}

						$('#left_back').height($('#contents').height());

						PageMoveRL($('#view'), $('.page'));
					});
				}
			});
		}, 200);
	});
}

var colorbox = function(){
    $('.pop').colorbox({
    	opacity : 0.4,
    	overlayClose : false
    });
}

var colorbox_callClosed = function(callCloseFunc){
    $('.pop').colorbox({
    	opacity : 0.4,
    	overlayClose : false,
		onClosed : callCloseFunc
    });
}



function TabMenuSet(topClass, sDDClass, siframeSrc){
	var activeTab = '';
	var iframeSrc = '';

	if (GetCookie("tabName") != '')
	{
		activeTab = GetCookie("tabName");
		CompulsionTabOpen('div.contents', 'dd.'+activeTab);
		DelCookie("tabName");

		$(document).ready(function(){
			iframeSrc = GetCookie("iframeSrc");
			if (iframeSrc != '') $('dd.'+activeTab).find('iframe').attr('src', iframeSrc);
			DelCookie("iframeSrc");
		});
	}
	else{
		activeTab = sDDClass;
		iframeSrc = siframeSrc;

		CompulsionTabOpen('.'+topClass, 'dd.'+ activeTab);

		$(document).ready(function(){
			if (iframeSrc != '') $('dd.'+activeTab).find('iframe').attr('src', iframeSrc);
		});
	}
}

function CompulsionTabOpen(topClassName, ddClassName)
{
	$(document).ready(function(){
		var parentsList, ddCName;
		ddCName = ddClassName;

		parentsList = $(ddClassName).parentsUntil( $(topClassName) );

		for (var i = 0 ; i < parentsList.length ; i++ )
		{
			if (parentsList.get(i).tagName == "DL")
			{
				parentsList.eq(i).find(ddCName).prev().find('a').addClass('active');
				parentsList.eq(i).find(ddCName).css('display','block');
			}
			else if (parentsList.get(i).tagName == "DD")
			{
				ddCName = 'dd.' + parentsList.eq(i).attr('class');
			}
		}
	});	
}

function DlTabMenu_prototype(dlClassName, eventType, eachFunc)
{
	var dlObj = $('.' + dlClassName);
	
	if ( dlObj.length == 0 ) return false;

	var dtObj = dlObj.children('dt');

	dtObj.children('a').bind(eventType, {}, DDView);
	dtObj.bind(eventType, {}, ChildrenInit);

	if (typeof eachFunc == "function")
	{
		dtObj.find('a').bind(eventType, {topDlClassObj : dlObj}, eachFunc);
	}

	// only dt - .active add or remove, dd - display none or block
	function DDView()
	{
		var thisObj = $(this);

		dtObj.find('a.active').removeClass('active');
		thisObj.addClass('active');

		dlObj.children('dd').css('display', 'none');
		thisObj.parent().next().css('display', 'block');
	}

	function ChildrenInit()
	{
		var thisObj = $(this);
		var dtObj = thisObj.next().find('dl > dt');
		var ddObj = thisObj.next().find('dl > dd');

		dtObj.find('a.active').removeClass('active').end().eq(0).find('a').addClass('active');		
		ddObj.css('display', 'none').eq(0).css('display','block');
	}
}

function MergeRow(parentId, tableId)
{
	var $parent = $('#'+parentId);
	var $table = $parent.find('#'+tableId);
	var row_count = 2, temp_tr_row = "";
	
	var $tr_list = $table.find('tr');

	$tr_list.each(function(key, value){

		var cur_td_text = $(value).find('td').eq(0).text();
		var next_td_text = $tr_list.eq(key+1).find('td').eq(0).text();

		if (cur_td_text == next_td_text)
		{
			if(!($(value).find('td').eq(0).hasClass('del'))){
				temp_tr_row = $(value).find('td').eq(0).attr('rowspan',2);
			}

			$tr_list.eq(key+1).find('td').eq(0).addClass('del');
			row_count = row_count + 1;
		}
		else
		{
			if (temp_tr_row != "")
			{
				temp_tr_row.attr('rowspan',row_count-1);
				temp_tr_row = "";
			}

			$tr_list.find('td.del').remove();
			row_count = 2;
		}
	});
}


function View_Width()
{	
	var return_width = 0;

	return_width = $(window).width() - $('#left').outerWidth() - $('.page_move_right').outerWidth() - $('.page_move_left').outerWidth();

	return return_width;
}
