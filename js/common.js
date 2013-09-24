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
function PageMoveRL(viewObj, pageObj)
{
	var distance = 0;

	$('.page_move_right').unbind('click');
	$('.page_move_left').unbind('click');

	if (viewObj.width() < pageObj.width()) {
		distance = ((pageObj.width() - viewObj.width() + 30) * -1) + 'px';

		$('.page_move_right').click(function (e) {
				$('.page').animate({ left: distance }, 500);
		});
	}
	else
	{
		$('.page_move_right').click(function (e) {
				pageObj.animate({ left: '-30px' }, 400, function(){
					$(this).animate({ left: 0 }, 300);
				});
		});
	}

	$('.page_move_left').click(function (e) {
			pageObj.animate({ left: 0 }, 500);
	});
}
*/
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
