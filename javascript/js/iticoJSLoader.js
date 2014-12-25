(function ($) {
	
	//AJAX-SOLR CORE LIBS!!
	$.getScript("http://iann.pro/viewer/lib/core/Core.js", function(data, textStatus){
		$.getScript("http://iann.pro/viewer/lib/core/AbstractManager.js", function(data, textStatus){
			$.getScript("http://iann.pro/viewer/lib/core/Parameter.js", function(data, textStatus){
				$.getScript("http://iann.pro/viewer/lib/core/ParameterStore.js", function(data, textStatus){
					$.getScript("http://iann.pro/viewer/lib/core/AbstractWidget.js", function(data, textStatus){
						$.getScript("http://iann.pro/viewer/lib/core/AbstractFacetWidget.js", function(data, textStatus){
							$.getScript("http://iann.pro/viewer/lib/managers/Manager.jquery.js", function(data, textStatus){
								$.getScript("http://iann.pro/viewer/lib/helpers/jquery/ajaxsolr.theme.js", function(data, textStatus){
									$.getScript("http://iann.pro/viewer/lib/jquery.livequery.js", function(data, textStatus){

	//pagination Widget
	$.getScript("http://iann.pro/viewer/ext/jquery.pagination.js", function(data, textStatus){
		$.getScript("http://iann.pro/viewer/widgets/ResultWidget.js", function(data, textStatus){

	//tag cloud widget
	$.getScript("http://iann.pro/viewer/widgets/TagcloudWidget.js", function(data, textStatus){
		
	//Events type selector widget
	$.getScript("http://iann.pro/viewer/widgets/EventsTypeSelectorWidget.js", function(data, textStatus){
	
	//Current Search widget
	$.getScript("http://iann.pro/viewer/widgets/CurrentSearchWidget.js", function(data, textStatus){
		
	//Text search widget
	$.getScript("http://iann.pro/viewer/widgets/TextWidget.js", function(data, textStatus){
		
	//Jquery plugin to auto-complete
	$.getScript("http://iann.pro/viewer/ext/jquery.autocomplete.js", function(data, textStatus){
		$.getScript("http://iann.pro/viewer/widgets/AutocompleteWidget.js", function(data, textStatus){
	
	//simplified tabs widget
	$.getScript("http://iann.pro/viewer/widgets/SimpleTabsWidget.js", function(data, textStatus){

	//selector of category widget
	$.getScript("http://iann.pro/viewer/widgets/CategorySelectorWidget.js", function(data, textStatus){
		
	//Google maps widget
	$.getScript("http://iann.pro/viewer/lib/oms.js", function(data, textStatus){
		$.getScript("http://iann.pro/viewer/widgets/GoogleMapsWidget.js", function(data, textStatus){

	//Calendar Widget
	$.getScript("http://iann.pro/viewer/lib/rfc3339date.js", function(data, textStatus){
	$.getScript("http://iann.pro/viewer/lib/jquery.addtocal.js", function(data, textStatus){
	$.getScript("http://iann.pro/viewer/lib/fullcalendar.min.js", function(data, textStatus){
		$.getScript("http://iann.pro/viewer/widgets/CalendarWidget.js", function(data, textStatus){

	//Date Filter widget
	$.getScript("http://iann.pro/viewer/widgets/DateFilterWidget.js", function(data, textStatus){
	
	
	$.getScript("http://iann.pro/viewer/js/itico.theme.js", function(data, textStatus){
		if (loading=='events'){
			$.getScript("http://iann.pro/viewer/js/iticoEvents.js", function(data, textStatus){
				//console.debug("everything for events loaded!");
			});
		}else if (loading=='news'){
			$.getScript("http://iann.pro/viewer/js/iticoNews.js", function(data, textStatus){
				//console.debug("everything for news loaded!");
			});
		}else if (loading=='admin'){
			$.getScript("http://iann.pro/viewer/js/iticoAdmin.js", function(data, textStatus){
				//console.debug("everything for admin loaded!");
			});
		}
	});
		});
			});
	
	});

		});
	});
		});
	});
	});
	});
		});
	});
	});
	});
	});
	});
		});
	});

									});
								});
							});
						});
					});
				});
			});
		});
	});
})(jQuery);
