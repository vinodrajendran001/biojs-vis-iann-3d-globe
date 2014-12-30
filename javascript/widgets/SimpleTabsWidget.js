(function ($) {
	AjaxSolr.SimpleTabsWidget = AjaxSolr.AbstractFacetWidget.extend({
		currentCategory: "",
		init: function () {
			var self = this; 
			this.currentCategory=this.categories[0];
			this.hideAll();
			$(this.targets_per_category[0][0]).show();
			this.fillTabs(this.labels_id_per_category[0],this.labels_per_category[0],this.targets_per_category[0]);
			$("#"+this.labels_id_per_category[0][0]).removeClass("iann_tab_menu_no_selected").addClass("iann_tab_menu_selected");
		},
		afterRequest: function () {
			var self = this; 
			var currentCate="";
			var fq = self.manager.store.values('fq');
			for (var i = 0, l = fq.length; i < l; i++) {
				if ((fq[i]=="category:news")|| (fq[i]=="category:event"))
					currentCate=fq[i].substr(9);
			}
			if (currentCate != this.currentCategory){
				this.currentCategory=currentCate;
				for (var i = 0, l = this.categories.length; i < l; i++) {
					if (this.categories[i]==this.currentCategory)
						this.fillTabs(this.labels_id_per_category[i],this.labels_per_category[i],this.targets_per_category[i]);
				}
				this.hideAll();
				$(this.targets_per_category[0][0]).show();
				$("#"+this.labels_id_per_category[0][0]).removeClass("iann_tab_menu_no_selected").addClass("iann_tab_menu_selected");
			}
		},
		fillTabs: function(ids,labels,targets){
			var self = this; 
			$(this.target).empty();
			if (labels.length>1){
				for (var i = 0, l = labels.length; i < l; i++) {
					$(this.target).append(AjaxSolr.theme('tab_menu', ids[i],labels[i], function() {
						for (var j = 0, l1 = targets.length; j < l1; j++) {
							if (this.id==ids[j]){
								$(targets[j]).show();
								$(this).removeClass("iann_tab_menu_no_selected").addClass("iann_tab_menu_selected");
								Manager.currentTab=labels[j];
							}else{
								$(targets[j]).hide();
								$("#"+ids[j]).removeClass("iann_tab_menu_selected").addClass("iann_tab_menu_no_selected");
							}
						}
						self.manager.doRequest(0);
					}));
					if (i+1 < l)
						$(this.target).append(" | ");
				}
			}
		},
		hideAll:function(){
			for (var i = 0, l = this.categories.length; i < l; i++) {
				for (var j = 0, l2 = this.labels_per_category[i].length; j < l2; j++) {
					$(this.targets_per_category[i][j]).hide();
				}
			}
		}
		
	});
	
})(jQuery);