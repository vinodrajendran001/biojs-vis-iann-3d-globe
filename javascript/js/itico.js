var Manager;

(function ($) {

	$(function () {
		Manager = new AjaxSolr.Manager({
			solrUrl: 'http://iann.pro/solr/'
			//solrUrl: 'http://localhost:8983/solr/'
		});
		Manager.addWidget(new AjaxSolr.ResultWidget({
			id: 'result',
			target: '#iann_docs'
		}));
//		Manager.addWidget(new AjaxSolr.PagerWidget({
//			id: 'iann_pager',
//			target: '#iann_pager',
//			prevLabel: '&lt;',
//			nextLabel: '&gt;',
//			innerWindow: 1,
//			renderHeader: function (perPage, offset, total) {
//				$('#iann_pager-header').html($('<span/>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
//			}
//		}));
		var fields = [ 'provider', 'keyword','field','country' ];
		for (var i = 0, l = fields.length; i < l; i++) {
			Manager.addWidget(new AjaxSolr.TagcloudWidget({
				id: fields[i],
				target: '#' + fields[i],
				field: fields[i]
			}));
		}
		Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
			id: 'currentsearch',
			target: '#iann_selection',
		}));
		Manager.addWidget(new AjaxSolr.EventsTypeSelectorWidget({
			id: 'eventCategory',
			target: '#events_category',
			subcategories: ['course','workshop','meeting']
		}));
/*		Manager.addWidget(new AjaxSolr.TextWidget({
			id: 'text',
			target: '#iann_search',
			field: 'text'
		}));
*/
		Manager.addWidget(new AjaxSolr.AutocompleteWidget({
			id: 'text',
			target: '#iann_search',
			field: 'text',
			fields: [ 'provider', 'keyword' ]
		}));
		Manager.addWidget(new AjaxSolr.GoogleMapsWidget({
			id: 'googlemaps',
			target: '#countries'
		}));
		Manager.addWidget(new AjaxSolr.DateFilterWidget({
			id: 'datef',
			target: '#datefilter',
			field: 'submission_date'
		}));
		Manager.addWidget(new AjaxSolr.CalendarWidget({
			id: 'calendar',
			target: '#calendar',
			field: 'submission_date'
		}));
		
		Manager.addWidget(new AjaxSolr.CategorySelectorWidget({
			id: 'mainCategory',
			target: '#main_category',
			categories: [ 'news', 'event' ],
			predefined: 'news'
		}));
		Manager.init();
		if (typeof iann_prefilter != 'undefined' && iann_prefilter != undefined && iann_prefilter!=null && iann_prefilter!="")
			Manager.store.addByValue('q', iann_prefilter);
		else
			Manager.store.addByValue('q', '*:*');
		var params = {
			facet: true,
			'facet.field': [ 'provider', 'keyword', 'field', 'country'],
			'facet.limit': 20,
			'facet.mincount': 1,
			'f.topics.facet.limit': 50,
			'f.country.facet.limit': -1,
			'facet.date': 'submission_date',
			'facet.date.start': '2010-01-01T00:00:00.000Z/DAY',
			'facet.date.end': '2011-12-31T00:00:00.000Z/DAY+1DAY',
			'facet.date.gap': '+1DAY',
			'json.nl': 'map',
			'rows':300
		};
		for (var name in params) {
			Manager.store.addByValue(name, params[name]);
		}

		Manager.doRequest();

	});
	$.fn.showIf = function (condition) {
		if (condition) {
			return this.show();
		}
		else {
			return this.hide();
		}
	}
	$('a.advance_switch').livequery(function () {
		$(this).toggle(function () {
			$('#iann_advance_fields').show();
			$(this).html('<img style="vertical-align:text-bottom;" src="http://iann.pro/viewer/images/minus01.gif" /> filtering options...');
			return false;
		}, function () {
			$('#iann_advance_fields').hide();
			$(this).text('<img style="vertical-align:text-bottom;" src="http://iann.pro/viewer/images/plus01.gif" /> filtering options...');
			return false;
		});
	});
	
})(jQuery);

