(function ($) {

	AjaxSolr.theme.prototype.result = function (doc, snippet,isAdmin,solrEditUrl) {
		var output = '<div class="iann_item_h">';
		if (isAdmin== true) {
			output += '<a href="'+solrEditUrl+'events.html?action=edit&id='+doc.id+'" class="iann_item_title" target="_editor"><img class="iann_img" src="images/edit.png" width="16px" /></a> ';
			output += '<a href="'+solrEditUrl+'events.html?action=delete&id='+doc.id+'" class="iann_item_title" target="_editor"><img class="iann_img" src="images/del.png" width="16px" /></a> ';
		}
		if (doc.category=="news"){
			output += '<a href="'+doc.link+'" class="iann_item_title" target="_blank">' + doc.title + '</a>';
			output += '<br/><div class="iann_item_content">' + snippet + '</div>';
			if (doc.provider) output += '<span class="iann_item_author">' + doc.provider + '</span>';
		} else {//if (doc.category=="event"){
			output += '<a href="'+doc.link+'" class="iann_item_title" target="_blank">' + doc.title + '</a>';
			if (doc.subtitle) output += '<br/><span class="iann_item_subtitle">' + doc.subtitle + '</span>';
			if (doc.start && doc.end) {
				var value1 = doc.start.substr(0, 10);
				var value2 = doc.end.substr(0, 10);
				output += '<br/><span class="iann_item_date">'+ value1 ;
				if (value1!=value2)
					output += ' - '+value2;
				output += '</span>';
				
			}
			var geoQuery ='';
			if (doc.venue) geoQuery+=doc.venue+', ';
			geoQuery += doc.city+", ";
			if (doc.county)geoQuery += doc.county+", ";
			geoQuery += doc.country;
			
			output += '<br/><span class="iann_item_place">'+ geoQuery+'</span>';
			if (doc.provider) output += '<br/><span class="iann_item_author">' + doc.provider + '</span>';
			if (isAdmin==true){
				output += '<div class="iann_item_details">';
				if (doc.submission_name && doc.submission_name instanceof Array) {
					output += '<br/><span class="iann_item_details_item">Submission: ';
					for (var i = 0, l = doc.submission_name.length; i < l; i++) {
						output += '[';
						if (doc.submission_name[i]) output +=  doc.submission_name[i] +", ";
						if (doc.submission_organization[i]) output +=  doc.submission_organization[i] +", ";
						if (doc.submission_date[i]) output +=  doc.submission_date[i].substr(0, 10); ;
						output += '] ';
					}
					output += '</span>';
				}
				if (doc.category) output += '<br/><span class="iann_item_details_item">Category: ' + doc.category + '</span>';
				if (doc.field) output += '<br/><span class="iann_item_details_item">Field: ' + doc.field + '</span>';
				if (doc.keyword) output += '<br/><span class="iann_item_details_item">Keywords: ' + doc.keyword + '</span>';
				output += '</div>';
			}
		}
		output +='</div>';
		return output;
	};

	AjaxSolr.theme.prototype.snippet = function (doc) {
		var output = '';
		if(doc.description){
			if (doc.description.length > 300) {
				output += doc.description.substring(0, 300);
				output += '<span style="display:none;">' + doc.description.substring(300);
				output += '</span> <a href="#" class="more">...more</a>';
			}
			else {
				output +=  doc.description;
			}
		}
		return output;
	};

	AjaxSolr.theme.prototype.tag = function (value, weight, handler) {
		return $('<a href="#" class="tagcloud_item"/>').text(value).addClass('tagcloud_size_' + weight).click(handler);
	};

	AjaxSolr.theme.prototype.facet_link = function (value, handler) {
		return $('<a href="#"/>').text(value).click(handler);
	};

	AjaxSolr.theme.prototype.no_items_found = function () {
		return 'no items found in current selection';
	};

	AjaxSolr.theme.prototype.category = function (value, handler) {
		return $('<a href="#" class="main_category_item" id="iann_category_'+value+'" />').text(value).click(handler);
	};
	
	AjaxSolr.theme.prototype.tab_menu = function (id,value, handler) {
		return $('<a href="#" class="tab_menu_item" id="'+id+'" />').text(value).click(handler);
	};
})(jQuery);


