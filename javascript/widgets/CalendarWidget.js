(function ($) {
	AjaxSolr.CalendarWidget = AjaxSolr.AbstractFacetWidget.extend({
		
		afterRequest: function () {
			$(this.target).empty();
			
			var self=this;
			
			var events =[];
			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				if (doc.category!="news"){
					var event ={};
					event.start= parseISO8601(doc.start.substr(0,10));
					if (doc.start!=doc.end){
						event.end = parseISO8601(doc.end.substr(0,10));
						event.allday=true;
					}
					event.title = doc.title;
					event.link = doc.link;
					event.solrid=doc.id;

					if (doc.category[0]=="meeting" ||doc.category[1]=="meeting") event.color="#193";
					
					if (typeof calendar_color_option != 'undefined' && calendar_color_option != undefined && calendar_color_option!=null && calendar_color_option!=""){
						if (typeof calendar_color_option.country != 'undefined' && calendar_color_option.country != undefined && calendar_color_option.country!=null && calendar_color_option.country!=""){
							if (doc.country in calendar_color_option.country)
								event.color=calendar_color_option.country[doc.country];
						} 
						if (typeof calendar_color_option.provider != 'undefined' && calendar_color_option.provider != undefined && calendar_color_option.provider!=null && calendar_color_option.provider!=""){
							if (doc.provider in calendar_color_option.provider)
								event.color=calendar_color_option.provider[doc.provider];
						}
					}
					events.push(event);
				}
			}			
			$(this.target).fullCalendar({
					header: {
						left: 'prev,next',
						center: 'title',
						right: 'month,agendaWeek,agendaDay'
					},
					editable: true,
					events:events,
					eventClick: function(event) {
						$(this).data('event',event);
//						window.open(event.link,"_blank");
					},
					viewDisplay: function(view) {
					    $('.fc-event').AddToCal({
						      /* ical and vcal require an ics or vcs file to be served. 
						       * Since we don't have a server for this demo, these features are disabled.
						       * As a result the 30boxes, iCal and vCalendar menu links will not appear
						       */
						      icalEnabled:false,
						      vcalEnabled:false,
						        
						      /* getEventDetails is the most critical function to provide. 
						       * It is called when a user selects a calendar to add an event to.
						       * The element parameter is the jQuery object for the event invoked. 
						       * You must return an object packed with the relevant event details.
						       * How you determine the event attributes will depend on your page.
						       * The example below illustrates how to handle two formats of event markup. 
						       */
						      getEventDetails: function( element ) {
						    	var event=$(element).data('event');

						        // return the required event structure
						        return {
						          webcalurl: null,
						          icalurl: null,
						          vcalurl: null, 
						          start: event.start, 
						          end: event.end, 
						          title: event.title, 
						          details: event.title+' - '+event.link, 
						          location: null, 
						          url: event.link
						          };
						      }
						    });
						
					}
				}
			);

		    
		
		}
		
	});
})(jQuery);
function parseISO8601(dateStringInRange) {
    var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
        date = new Date(NaN), month,
        parts = isoExp.exec(dateStringInRange);

    if(parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if(month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
}