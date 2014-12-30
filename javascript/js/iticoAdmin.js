var Manager;

(function ($) {

	$(function () {
		var fillResultDiv = function (divId) {
			var htmlResult='';
			htmlResult+='				<div id="result">';
			htmlResult+='					<div id="iann_navigation">';
			htmlResult+='						<ul id="iann_pager"></ul>';
			htmlResult+='					</div><br/>';
			htmlResult+='					<div id="iann_docs"></div><br/>';
			htmlResult+='					<div id="iann_navigation">';
			htmlResult+='						<div id="iann_pager-header"></div>';
			htmlResult+='					</div><br/>';
			htmlResult+='				</div>';
			
			htmlResult+='				<div id="map_div">';
			htmlResult+='					<div id="iann_map"></div>';
			htmlResult+='					<div id="iann_map_log"></div>';
			htmlResult+='				</div>';
			htmlResult+='				<div id="calendar_div">';
			htmlResult+='					<div id="iann_calendar"></div>';
			htmlResult+='				</div>';
			$('#'+divId).html(htmlResult);
		};
		var fillSearchTable = function (tableId) {
			var htmlResult='';
			htmlResult+='	<table id="iann_search" class="iann_cell">';
			htmlResult+='		<tr>';
			htmlResult+='			<td>';
			htmlResult+='				<ul id="iann_search">';
			htmlResult+='					<input class="iann_field iann_field_search" type="text" id="iann_query" name="iann_query"/>';
			htmlResult+='				</ul>';
			htmlResult+='				<a class="advance_switch" ><img style="vertical-align:text-bottom;" src="http://iann.pro/viewer/images/plus01.gif" /> filtering options...</a>';
			htmlResult+='			</td>';
			htmlResult+='			<td>';
			htmlResult+='				<ul id="iann_selection"></ul>';
			htmlResult+='			</td>';
			htmlResult+='		</tr>';
			htmlResult+='	</table>';
			$('#'+tableId).html(htmlResult);
		};
		var fillAdvanceSearchDiv = function(divId){
			var htmlResult='';
			htmlResult+='			<table  class="iann_cell" width="100%">';
			htmlResult+='			<tr>';
			htmlResult+='				<td width="33%">';
			htmlResult+='					<div class="iann_panel_title">Date</div>';
			htmlResult+='					<div class="iann_panel_content" id="datefilter"></div>';
			htmlResult+='				</td>';
			htmlResult+='				<td width="33%">';
			htmlResult+='					<div class="iann_panel_title">Host</div>';
			htmlResult+='					<div class="iann_panel_content" id="provider"></div>';
			htmlResult+='				</td>';
			htmlResult+='				<td width="33%">';
			htmlResult+='                    <div class="iann_panel_title">Category</div>';
			htmlResult+='					<div class="iann_panel_content" id="events_category"></div>';
			htmlResult+='				</td>';
			htmlResult+='			</tr>';
			htmlResult+='			<tr>';
			htmlResult+='                <td>';
			htmlResult+='					<div class="iann_panel_title">Field</div>';
			htmlResult+='					<div class="iann_panel_content" id="field"></div>';
			htmlResult+='				</td>';
			htmlResult+='				<td>';
			htmlResult+='					<div class="iann_panel_title">Country</div>';
			htmlResult+='					<div class="iann_panel_content" id="country"></div>';
			htmlResult+='				</td>';
			htmlResult+='				<td>';
			htmlResult+='					<div class="iann_panel_title">Keyword</div>';
			htmlResult+='					<div class="iann_panel_content" id="keyword"></div>';
			htmlResult+='				</td>';
			htmlResult+='				<td>';
			htmlResult+='				</td>';
			htmlResult+='			</tr>';
			htmlResult+='		</table>';
			$('#'+divId).html(htmlResult);
		};
		Manager = new AjaxSolr.Manager({
			solrUrl: 'http://iann.pro/solr/',
			//solrUrl: 'http://localhost:8983/solr/',
			//solrEditUrl: 'http://localhost:8983/solr/edit/',
			solrEditUrl: 'http://iann.pro/editor/',
			isAdmin:true
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
		var fields = [ 'provider', 'keyword', 'field', 'country' ];
		for (var i = 0, l = fields.length; i < l; i++) {
			Manager.addWidget(new AjaxSolr.TagcloudWidget({
				id: fields[i],
				target: '#' + fields[i],
				field: fields[i]
			}));
		}
		Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
			id: 'currentsearch',
			target: '#iann_selection'
		}));
		Manager.addWidget(new AjaxSolr.EventsTypeSelectorWidget({
			id: 'eventCategory',
			target: '#events_category',
			subcategories: ['course','meeting']
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
			fields: ['field', 'keyword']
		}));
		Manager.addWidget(new AjaxSolr.GoogleMapsWidget({
			id: 'googlemaps',
			target: '#iann_map'
		}));
		Manager.addWidget(new AjaxSolr.DateFilterWidget({
			id: 'datef',
			target: '#datefilter',
			field: 'submission_date',
			start: 'start',
			end: 'end',
			isEvent: false
		}));
		Manager.addWidget(new AjaxSolr.CalendarWidget({
			id: 'calendar',
			target: '#iann_calendar',
			field: 'submission_date'
		}));
		
		Manager.addWidget(new AjaxSolr.CategorySelectorWidget({
			id: 'mainCategory',
			target: '#main_category',
			categories: [ 'news', 'event' ],
			predefined: 'event'
		}));
		Manager.addWidget(new AjaxSolr.SimpleTabsWidget({
			id: 'simpleTabs',
			target: '#result_tabs',
			categories: [ 'news', 'event' ],
			labels_id_per_category: [['list_tab'],[ 'list_tab', 'map_tab','calendar_tab' ]],
			labels_per_category: [['List'],[ 'List', 'Map','Calendar' ]],
			targets_per_category: [['#result'],[ '#result', '#map_div','#calendar_div' ]]
		}));
		
		fillResultDiv('iann_results');
		fillSearchTable('iann_search');
		fillAdvanceSearchDiv('iann_advance_fields');

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
			$(this).html('<img style="vertical-align:text-bottom;" src="http://iann.pro/viewer/images/plus01.gif" /> filtering options...');
			return false;
		});
	});
	
})(jQuery);

