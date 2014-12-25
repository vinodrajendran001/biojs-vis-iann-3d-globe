(function ($) {
	AjaxSolr.TableWidget = AjaxSolr.AbstractFacetWidget.extend({
		
		afterRequest: function () {
			$(this.target).empty();
			
			var self=this;
			var html ='<table cellpadding="0" cellspacing="0" border="0" class="display" id="iann_table_content" width="100%">';
				html +='	<thead>';
				html +='		<tr>';
				html +='			<th>Date</th>';
				html +='			<th>Title</th>';
				html +='			<th>Country</th>';
				html +='			<th>City</th>';
				html +='			<th>Host</th>';
				html +='		</tr>';
				html +='	</thead>';
				html +='	<tbody>';
			var events =[];
			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				if (i%2==0) linetype='even'; else linetype='odd'; 
				html +='		<tr class="'+linetype+'">';
				html +='			<td>'+doc.start.substr(0,10)+'</td>';
				html +='			<td><a href="'+doc.link+'">'+doc.title+'</a></td>';
				html +='			<td>'+doc.country+'</td>';
				html +='			<td>'+doc.city+'</td>';
				html +='			<td>'+doc.provider+'</td>';
				html +='		</tr>';
			}			
				html +='	</tbody>';
				html +='</table>';
			$(this.target).html(html);
			$.extend( $.fn.dataTable.defaults, {
		        "sPaginationType": "full_numbers",
				"bFilter": false,
				"sDom": '<"iann_tableview_header"i>rt<"iann_tableview_footer"p>',
				"iDisplayLength": 30,
				"bSortClasses": false,
				"bAutoWidth": false
		    } );
			$('#iann_table_content').dataTable();
		
		}
		
	});
})(jQuery);