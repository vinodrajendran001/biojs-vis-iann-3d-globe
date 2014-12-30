(function ($) {
	AjaxSolr.EventsTypeSelectorWidget = AjaxSolr.AbstractFacetWidget.extend({
		afterRequest: function () {
			var self = this; 
			var currentCategory="";
			var fq = self.manager.store.values('fq');
			for (var i = 0, l = fq.length; i < l; i++) {
				if (fq[i].indexOf("category:")==0)
					currentCategory=fq[i].substr(9);
			}
			if ("news"!=currentCategory){
				$(this.target).empty();
				this.num_entries=this.manager.response.response.docs.length;
				var counter={};
				for (var i = 0, l = this.subcategories.length; i < l; i++)
					counter[this.subcategories[i]]=0;
				for (var i = 0, l = this.num_entries; i < l; i++) {
					var doc = this.manager.response.response.docs[i];
					if (doc.category instanceof Array) {
						for (var categ in doc.category){
							if (counter[doc.category[categ]]==undefined) counter[doc.category[categ]]=0;
							counter[doc.category[categ]]++;
						}
					}
				}

				for (var i = 0, l = this.subcategories.length; i < l; i++) {
					$(this.target).append(AjaxSolr.theme('facet_link', this.subcategories[i]+" ("+counter[this.subcategories[i]]+")", this.facetHandler('category', this.subcategories[i])));
					$(this.target).append('<br/>');
				}
			}else{
				$(this.target).empty();
			}
			
		},
		facetHandler: function (facet_field, facet_value) {
			var self = this;
			return function () {
//				self.manager.store.remove('fq');
				var fq = self.manager.store.values('fq');
				for (var i = 0, l = fq.length; i < l; i++) {
					if (fq[i].indexOf("category:")==0)
						if ((fq[i]!=("category:news")) && (fq[i]!=("category:event")))
							self.manager.store.removeByValue('fq', fq[i])
				}
				self.manager.store.addByValue('fq', facet_field + ':' + facet_value);
				self.manager.doRequest(0);
				return false;
			};
		}
	});
})(jQuery);
