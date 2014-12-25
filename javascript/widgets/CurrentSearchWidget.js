(function ($) {
AjaxSolr.CurrentSearchWidget = AjaxSolr.AbstractWidget.extend({
	afterRequest: function () {
		var self = this;
		var links = [];

		var fq = this.manager.store.values('fq');
		for (var i = 0, l = fq.length; i < l; i++) {
//			links.push($('<a href="#"/>').text('(x) ' + fq[i]).click(self.removeFacet(fq[i])));
			if (fq[i].match(/[\[\{]\S+ TO \S+[\]\}]/)) {
				if (fq[i]=="submission_date:[NOW TO *]" || fq[i]=="end:[NOW TO *]")
					links.push($('<a href="#"/>').text('(x) Upcoming Events').click(self.removeFacet(fq[i])));
				else{
					var field = fq[i].match(/^\w+:/)[0];
					var values = fq[i].substr(field.length + 1, fq[i].length-1).split(" TO ");
					var value= values[0].substr(0,10)==values[1].substr(0,10)?values[0].substr(0,10):values[0].substr(0,10)+" TO "+values[1].substr(0,10);
					links.push($('<a href="#"/>').text('(x) ' + field + value).click(self.removeFacet(fq[i])));
				}
			}
			else { //Ignoring to display category filters that are always present and selected by the category selector widget
				if ((fq[i]!=("category:news")) && (fq[i]!=("category:event")))
					links.push($('<a href="#"/>').text('(x) ' + fq[i]).click(self.removeFacet(fq[i])));
			}

		}
		if (links.length > 1) {
			links.unshift($('<a href="#"/>').text('remove all').click(function () {
				var fq = self.manager.store.values('fq');
				for (var i = 0, l = fq.length; i < l; i++) {
					if ((fq[i]!=("category:news")) && (fq[i]!=("category:event")))
						if (self.manager.store.removeByValue('fq', fq[i])) {
							self.manager.doRequest(0);
			}
				}
			}));
		}

		if (links.length) {
			AjaxSolr.theme('list_items', this.target, links);
		} else {
			$(this.target).html('<div>Viewing all announcements!</div>');
		}
	},

	removeFacet: function (facet) {
		var self = this;
		return function () {
			if (self.manager.store.removeByValue('fq', facet)) {
				self.manager.doRequest(0);
			}
			return false;
		};
	}

});
})(jQuery);

