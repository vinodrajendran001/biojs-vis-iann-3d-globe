(function ($) {
	AjaxSolr.PieWidget = AjaxSolr.AbstractFacetWidget.extend({
		
		afterRequest: function () {
			if (Manager.currentTab==undefined || Manager.currentTab!='Pie Graph')
				return;
			var self = this;
			$('#'+this.target).empty();
			
			var innerhtml='';
			for (var i in this.field){
				innerhtml+='					<div id="iann_pie_'+this.field[i]+'"></div>';
			}
			$('#'+this.target).html(innerhtml);
			for (var i = 0, l = this.field.length; i < l; i++) {
				var field= this.field[i],
					chartTitle=this.chartTitle[i];
	    		var facetDataValues = [];
	    		var facetDataKeysDisplay = [];
				for (var facet in this.manager.response.facet_counts.facet_fields[field]) {
					var count = parseInt(this.manager.response.facet_counts.facet_fields[field][facet]);
					facetDataKeysDisplay.push(field +":" +facet);
					facetDataValues.push(count);	
	//				$(this.target).append(AjaxSolr.theme('tag', facet, parseInt(objectedItems[i].count / maxCount * 10), self.clickHandler(facet)));
				}
	
				/* Print pie charts */
	            var r = Raphael(this.target+"_"+field);
	            	//pie = r.piechart(300, 180, 100, facetDataValues, { legend: facetDataKeysDisplay, legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});
				var pie = r.piechart(340, 180, 100, facetDataValues, { legend: facetDataKeysDisplay, legendpos: "east", href: []});	
	            // Title
	            r.text(340, 50, chartTitle).attr({ font: "20px sans-serif" });
	            pie.hover(function () {
	                this.sector.stop();
	                this.sector.scale(1.1, 1.1, this.cx, this.cy);
	
	                if (this.label) {
	                    this.label[0].stop();
	                    this.label[0].attr({ r: 7.5 });
	                    this.label[1].attr({ "font-weight": 800 });
	                }
	            }, function () {
	                this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");
	
	                if (this.label) {
	                    this.label[0].animate({ r: 5 }, 500, "bounce");
	                    this.label[1].attr({ "font-weight": 400 });
	                }
	            });	
				pie.click(function () {
					if (this.label[1].attrs.text=="Others") return false;
					
					var fq = self.manager.store.values('fq');
					self.manager.store.addByValue('fq', this.label[1].attrs.text);
					self.manager.doRequest(0);
					return true;
				});
			}
		}
		
	});
})(jQuery);