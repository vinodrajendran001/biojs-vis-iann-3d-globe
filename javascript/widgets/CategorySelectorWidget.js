(function ($) {
	AjaxSolr.CategorySelectorWidget = AjaxSolr.AbstractFacetWidget.extend({
		init: function () {
			var self = this; 
			for (var i = 0, l = this.categories.length; i < l; i++) {
				
				var category =this.categories[i];
				
				$(this.target).append(AjaxSolr.theme('category', this.categories[i], function() {
					self.manager.store.remove('fq');
					var category = this.text;
					if (self.manager.store.addByValue('fq',  'category:' + category)) {
						if (category=='news'){
							var widget =Manager.widgets['datef'];
							if (widget!=undefined) widget.isEvent=false;
							if (self.manager.store.addByValue('sort', 'submission_date desc')) {
								self.manager.doRequest(0);
							}
						}else{
							var widget =Manager.widgets['datef'];
							if (widget!=undefined) widget.isEvent=true;
							if (self.manager.store.addByValue('sort', 'start asc') && (self.manager.store.addByValue('fq',  'end:[NOW TO *]'))) {
								self.manager.doRequest(0);
							}
						}
					}
				}));
				
				if (i+1 < l)
					$(this.target).append(" | ");
			}
			if (this.predefined){
				self.manager.store.addByValue('fq',  'category:' + this.predefined);
				if (this.predefined=='event'){
					self.manager.store.addByValue('sort', 'start asc');
					self.manager.store.addByValue('fq',  'end:[NOW TO *]');
				}else
					self.manager.store.addByValue('sort', 'submission_date desc')
			}
//					self.manager.doRequest(0);
		},
		afterRequest: function () {
			var self = this; 
			var fq = self.manager.store.values('fq');
			for (var i = 0, l = this.categories.length; i < l; i++) {
				var value=this.categories[i]
				$('#iann_category_'+value).removeClass("iann_category_selected").addClass("iann_category_no_selected");
				
				for (var j = 0, l2=fq.length; j<l2; j++) {
					if (fq[j]=="category:"+value)
						$('#iann_category_'+value).removeClass("iann_category_no_selected").addClass("iann_category_selected");
				}
			}
		}
	});
})(jQuery);
