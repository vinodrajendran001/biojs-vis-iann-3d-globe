(function ($) {
	AjaxSolr.DateFilterWidget = AjaxSolr.AbstractFacetWidget.extend({
		init: function () {
			var self = this; 
			var id=$(this.target).attr('id');
            $(this.target).html("<table border=\"0\"><tr><td align=\"right\">From: </td><td><input id=\""+id+"_from\" type=\"text\" class=\"iann_field iann_date\"></td></tr><tr><td align=\"right\">To: </td><td><input id=\""+id+"_to\" type=\"text\" class=\"iann_field iann_date\"></td></tr></table>");
            var dates = $( this.target+"_from, "+this.target+"_to" ).datepicker({
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 1,
				onSelect: function( selectedDate ) {
					var option = this.id == id+"_from" ? "minDate" : "maxDate",
						instance = $( this ).data( "datepicker" ),
						date = $.datepicker.parseDate(
							instance.settings.dateFormat ||
							$.datepicker._defaults.dateFormat,
							selectedDate, instance.settings );
					dates.not( this ).datepicker( "option", option, date );
					if(($.trim(dates[0].value)!="")&&($.trim(dates[1].value)!="")){
						var fq = self.manager.store.values('fq');

						if (self.isEvent){
							for (var i = 0, l = fq.length; i < l; i++) 
								if (fq[i].indexOf(self.start+":")==0 || fq[i].indexOf(self.end+":")==0)
									self.manager.store.removeByValue('fq', fq[i]);
							if (self.manager.store.addByValue('fq', self.start + ':[* TO ' + dates[1].value + 'T00:00:00Z]') && self.manager.store.addByValue('fq', self.end + ':[' + dates[0].value + 'T00:00:00Z TO *]')) {
								self.manager.doRequest(0);
							}
						}else{
							for (var i = 0, l = fq.length; i < l; i++) 
								if (fq[i].indexOf(self.field+":")==0)
									self.manager.store.removeByValue('fq', fq[i]);
							if (self.add('[' + dates[0].value + 'T00:00:00Z TO ' + dates[1].value + 'T23:59:59Z]')) {
								self.manager.doRequest(0);
							}
						}
					}
				}
			});
		},
		afterRequest: function () {
			$( this.target+"_from").val("");
			$( this.target+"_to").val("");
		}
	});
	
})(jQuery);
