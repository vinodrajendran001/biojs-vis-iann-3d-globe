(function ($) {
	AjaxSolr.GoogleMapsWidget = AjaxSolr.AbstractFacetWidget.extend({
		trymorethanonce:true,
		geocoder:null,
		map:null,
		oms:null,
		cache:{},
		num_entries:0,
		displaying: 0,
		queryId:0,
		afterRequest: function () {
			if (Manager.currentTab==undefined || Manager.currentTab!='Map')
				return;
			$(this.target).empty();
			this.locations =new Array();
			
			var latlng = new google.maps.LatLng(50,10);
			geocoder = new google.maps.Geocoder();
			
			var myOptions = {
				zoom: 3,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map($(this.target)[0],myOptions);
			this.oms = new OverlappingMarkerSpiderfier(map);
			this.displaying=0;
			this.queryId++;
			this.num_entries=this.manager.response.response.docs.length;
			for (var i = 0, l = this.num_entries; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				if (doc.category!="news"){

					var geoQuery ='';
					if (doc.venue) geoQuery+=doc.venue+', ';
					geoQuery += doc.city+", ";
					if (doc.county)geoQuery += doc.county+", ";
					geoQuery += doc.country;
					var geoText=this.getGeoText(doc,geoQuery);
					
					var type="latlng";
					//Checking with latlng
					if (type=="latlng"){
						
						var latlngdoc = new google.maps.LatLng(doc.latitude,doc.longitude);
						this.codeLatLng(latlngdoc, geoText);
					}else
					//Checking with address 
						this.codeAddress(geoQuery,geoText,undefined,this.queryId);
				}
			}
		},
		getGeoText: function (doc,geoQuery){
			var output = '<div class="iann_item">';
			output += '<a href="'+doc.link+'" class="iann_item_title" target="_blank">' + doc.title + '</a>';
			if (doc.subtitle) output += '<br/><span class="iann_item_subtitle">' + doc.subtitle + '</span>';
			if (doc.start ) {
				var value1 = doc.start.substr(0, 10);
				var value2 = doc.end.substr(0, 10);
				output += '<br/><span class="iann_item_date">'+ value1 ;
				if (value1!=value2)
					output += ' - '+value2;
				output += '</span>';
			}
			output += '<br/><span class="iann_item_place">'+ geoQuery+'</span>';
			if (doc.provider) output += '<br/><span class="iann_item_author">' + doc.provider + '</span>';
			output +='</div>';
			return output;
			
		},
		codeLatLng: function (latlngdoc,contentString) {
			var marker = new google.maps.Marker({
				map: map, 
				position: latlngdoc
			});
			var iw = new google.maps.InfoWindow({
				content: contentString
			});
			var widget =Manager.widgets['googlemaps'];
			marker.desc=contentString;
			widget.oms.addMarker(marker);
			widget.oms.addListener('click', function(marker) {
				if (iw.content==marker.desc)
					iw.open(map, marker);
			});
			widget.oms.addListener('spiderfy', function(markers) {
				iw.close();
			});			
			widget.displaying++;
			$('#iann_map_log').html('displaying ' + widget.displaying + ' events in the map of a total of ' + widget.num_entries+'. ');
		},
		codeAddress: function (address,contentString,originalAddress,queryId) {
			if (this.cache[address]!=undefined){
				var results=this.cache[address];
				if (originalAddress!=undefined) this.cache[originalAddress]=results;
				if (queryId!=this.queryId) return;
				//console.debug("from cache!");
				var marker = new google.maps.Marker({
					map: map, 
					position: results[0].geometry.location
				});
				var iw = new google.maps.InfoWindow({
					content: contentString
				});
				marker.desc=contentString;
				this.oms.addMarker(marker);
				this.oms.addListener('click', function(marker) {
					//iw.setContent(marker.desc);
					if (iw.content==marker.desc)
						iw.open(map, marker);
				});
				this.oms.addListener('spiderfy', function(markers) {
					iw.close();
				});		
				this.displaying++;
				$('#iann_map_log').html('displaying ' + this.displaying + ' events in the map of a total of ' + this.num_entries+'. ');
				if (this.displaying!=this.num_entries) $('#iann_map_log').append('Busy trying to get the geo-location for the rest.');
				return;
			}
			geocoder.geocode( { 'address': address}, function(results, status) {
				var widget =Manager.widgets['googlemaps'];
				if (status == google.maps.GeocoderStatus.OK) {
					widget.cache[address]=results;
					if (originalAddress!=undefined) widget.cache[originalAddress]=results;
					if (queryId!=widget.queryId) return;
					var marker = new google.maps.Marker({
						map: map, 
						position: results[0].geometry.location
					});
					var iw = new google.maps.InfoWindow({
						content: contentString
					});
					marker.desc=contentString;
					widget.oms.addMarker(marker);
					widget.oms.addListener('click', function(marker) {
						//iw.setContent(marker.desc);
						if (iw.content==marker.desc)
							iw.open(map, marker);
					});
					widget.oms.addListener('spiderfy', function(markers) {
						iw.close();
					});			
					widget.displaying++;
					$('#iann_map_log').html('displaying ' + widget.displaying + ' events in the map of a total of ' + widget.num_entries+'. ');
					if (widget.displaying!=widget.num_entries) $('#iann_map_log').append('Busy trying to get the geo-location for the rest.');
				} else {
					//console.debug("Geocode for ("+address+") was not successful for the following reason: " + status);
					if (widget.trymorethanonce){
						if (status=="OVER_QUERY_LIMIT"){
							//console.debug("trying again.");
							setTimeout("Manager.widgets['googlemaps'].codeAddress('"+address+"', '"+contentString+"',undefined,"+queryId+");",1000);
						}else{
							if (address.indexOf('"')!=-1 || address.indexOf("'")!=-1){
								var noQuotes = /["']/ig; 
								if (originalAddress==undefined) originalAddress=address;
								address=address.replace(noQuotes,""); 
								//console.debug("trying with:"+address);
								widget.codeAddress(address, contentString,originalAddress,queryId);
							}else{
								var shortaddress=address.indexOf(",");
								if (shortaddress!=-1){
									if (originalAddress==undefined) originalAddress=address;
									shortaddress=address.substr(shortaddress+1);
									//console.debug("trying with:"+shortaddress);
									widget.codeAddress(shortaddress, contentString,originalAddress,queryId);
								}
							}
						}
					}
				}
			});
		},
		wait: function(time){
			var date = new Date();
			var curDate = null;
			do { curDate = new Date(); } 
			while(curDate-date < time);
		}
		
	});
})(jQuery);
