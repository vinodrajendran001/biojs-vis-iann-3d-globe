(function ($) {
	AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
		items_per_page:10,
		init: function () {
			$('a.more').livequery(function () {
				$(this).toggle(function () {
					$(this).parent().find('span').show();
					$(this).text('...less');
					return false;
				}, function () {
					$(this).parent().find('span').hide();
					$(this).text('...more');
					return false;
				});
			});
		},
		
		afterRequest: function () {
			$(this.target).empty();
			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				var isAdmin=false;
				if (typeof this.manager.isAdmin  != "undefined") 
					isAdmin=this.manager.isAdmin;
				$(this.target).append(AjaxSolr.theme('result', doc, AjaxSolr.theme('snippet', doc),isAdmin,this.manager.solrEditUrl));

				var items = [];
				items = items.concat(this.facetLinks('field', doc.field));
				items = items.concat(this.facetLinks('keyword', doc.keyword));
				if (doc.country)	items = items.concat(AjaxSolr.theme('facet_link', doc.country, this.facetHandler('country', doc.country)));
				if (doc.city)		items = items.concat(AjaxSolr.theme('facet_link', doc.city, this.facetHandler('city', doc.city)));
				//var test = [];
				//test.push(field +":" +facet);
				//console.log('result view :' + doc);
				AjaxSolr.theme('list_items', '#links_' + doc.id, items);
			}

			this.initPagination();
		},
		initPagination: function () {
		    // count entries inside the hidden content
		    var num_entries = jQuery('#iann_docs div.iann_item_h').length;
		    // Create content inside pagination element
		    $("#iann_pager-header").pagination(num_entries, {
		        callback: this.pageselectCallback,
		        items_per_page:this.items_per_page,
		        load_first_page:true
		    });
		},
		pageselectCallback: function (page_index, jq){
		    var num_entries = jQuery('#iann_docs div.iann_item_h').length;
		    $('#iann_docs div.iann_item').empty();
			var max_elem = Math.min((page_index+1) * this.items_per_page, num_entries);
			for(var i=page_index*this.items_per_page;i<max_elem;i++){
			    var new_content = jQuery('#iann_docs div.iann_item_h:eq('+i+')').clone().removeClass( 'iann_item_h' ).addClass( 'iann_item' );
			    $('#iann_docs').append(new_content);
			}
			if(num_entries==0)
				$('#iann_pager').html($('<span/>').text('No available results. Try removing some of the query parameters.'));
			else
				$('#iann_pager').html($('<span/>').text('displaying ' + (1+(page_index*this.items_per_page)) + ' to ' + max_elem + ' of ' + num_entries));
		    return false;
		},
		facetLinks: function (facet_field, facet_values) {
			var links = [];
			if (facet_values) {
				for (var i = 0, l = facet_values.length; i < l; i++) {
					if(facet_values[i]) links.push(AjaxSolr.theme('facet_link', facet_values[i], this.facetHandler(facet_field, facet_values[i])));
				}
			}
			return links;
		},
		facetHandler: function (facet_field, facet_value) {
			var self = this;
			return function () {
				self.manager.store.remove('fq');
				self.manager.store.addByValue('fq', facet_field + ':' + facet_value);
				self.manager.doRequest(0);
				return false;
			};
		},
		beforeRequest: function () {
			$(this.target).html($('<img/>').attr('src', 'http://iann.pro/viewer/images/ajax-loader.gif'));
		}
	});
})(jQuery);
