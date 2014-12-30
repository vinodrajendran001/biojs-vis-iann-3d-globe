(function ($) {
	AjaxSolr.TabsManagerWidget = AjaxSolr.AbstractFacetWidget.extend({
		category: "",
		init: function () {
			$(this.target).tabs({
				show: function(event, ui) { 
					Manager.doRequest();
				}
			});
		},
		afterRequest: function () {
			var self = this; 
			var currentCategory="";
			var fq = self.manager.store.values('fq');
			for (var i = 0, l = fq.length; i < l; i++) {
				if (fq[i].indexOf("category:")==0)
					currentCategory=fq[i].substr(9);
			}
			if (this.category!=currentCategory){
				this.category=currentCategory;
				if ($(this.target).tabs( "option", "selected" )!=0)
					$(this.target).tabs("select",0);
				if (this.category=="news"){
					$(this.target).tabs({ disabled: [ 1, 2] })
				}else{
					$(this.target).tabs({ disabled: [] })
				}
			}
		}
	});
})(jQuery);
