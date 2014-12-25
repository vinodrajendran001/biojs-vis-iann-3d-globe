(function ($) {
        
	AjaxSolr.TreeMapWidget = AjaxSolr.AbstractFacetWidget.extend({
		

				  
		afterRequest: function () 
		{
				//$(this.target).empty();
				//default values
				var width= 960;
				var height= 500;
				var margin= {top: 40,right: 10,bottom: 10,left: 10};
				var env = this;
				
				
		if (Manager.currentTab==undefined || Manager.currentTab!='Partition Layout')
				return;
			

			var self = this;
			$(this.target).empty();
			var innerhtml='';
			for (var i in this.field){
				innerhtml+='					<div id="iann_partition_'+this.field[i]+'"></div>';
			}	
			$(this.target).html(innerhtml);	
			var facetDataKeysDisplay = [];
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
			}



  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
 			
			/*
			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				var isAdmin=false;
				if (typeof this.manager.isAdmin  != "undefined") 
					isAdmin=this.manager.isAdmin;
				$(this.target).append(AjaxSolr.theme('result', doc, AjaxSolr.theme('snippet', doc),isAdmin,this.manager.solrEditUrl));

				var items = [];
				items = items.concat(this.facetLinks('field', doc.field));
				items = items.concat(this.facetLinks('keyword', doc.keyword));
				if (doc.country)	items = items.concat(AjaxSolr.theme('facet_link', doc.country, this.facetHandler('country', doc.country)));
				if (doc.city)		items = items.concat(AjaxSolr.theme('facet_link', doc.city, this.facetHandler('city', doc.city)));
				var test = [];
				//test.push(field +":" +facet);
				console.log('result view :' + doc);
				AjaxSolr.theme('list_items', '#links_' + doc.id, items);
			}
			*/
				//objectedItems is my list of facets & counts
				/*
				var maxCount = 0;
				var objectedItems2 = [];
				for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
				  var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
				  if (count > maxCount) {
					maxCount = count;
				  }
				  objectedItems2.push({ name: facet, children : [{name: facet, size: count}] });
				}
				*/
				
				//see print values
					/*for(var i=0; i<objectedItems2.length;i++){
						document.write(objectedItems2[i].name); 
						document.write(",");
						document.write(objectedItems2[i].children[0].size);
						document.write("\n");
					}*/
				
				
				//document.write(json1);
				
				var json1= JSON.stringify(facetDataKeysDisplay);
				  console.log("testing tree map:" + json1);
				  var json2 = '{ "name" : "node" , "children" : ';
				json2 += json1;
				json2 += '}';
				//document.write(json2); 
				console.log("testing:" + json2);
				var width = this.width;
				var height = this.height;
				var margin = this.margin;
				

				var color = d3.scale.category20c();

				var treemap = d3.layout.treemap()
				    .size([width, height])
				    .sticky(true)
				    .value(function(d) { return d.size; });
					
				//style class to overwrite attrs = target 
				var div = d3.select(this.target).append("div")
				    .style("position", "relative")
				    .style("width", (width + margin.left + margin.right) + "px")
				    .style("height", (height + margin.top + margin.bottom) + "px")
				    .style("left", margin.left + "px")
				    .style("top", margin.top + "px");
					
				
	
				//"" is the path of the json, if gives error, it would use the root value
				d3.json("", function(error, root) {
					root=JSON.parse( json2 );
				  var node = div.datum(root).selectAll(".node")
				      .data(treemap.nodes)
				    .enter().append("div")
				      .attr("class", "node")
				      .call(position)
				      .style("background", function(d) { return d.children ? color(d.name) : null; })
				      .text(function(d) { return d.children ? null : d.name; })
					/*  .on("click", function(d) { //clickhandler function
						  var self1 = env, meth = env.multivalue ? 'add' : 'set';	
						  	//meth = 'add';
						  	console.log("meth value :"+d.name +"self :"+self1.target)	;
							self1[meth].call(self1, d.name);

							self1.doRequest();
							//$(this.target).append(AjaxSolr.theme('tag', facet, parseInt(objectedItems[i].count / maxCount * 10), self.clickHandler(facet)));
					  }); */
					     .on("click", function(d) { //clickhandler function
						  var self = env, meth = env.multivalue ? 'add' : 'set';
						    console.log("meth value :"+d.name +"self :"+self.target)	;			
							self[meth].call(self, d.name);
							self.doRequest();
				});
						  
				  d3.selectAll("input").on("change", function change() {
				    var value = this.value === "count"
					? function(d) { return 1; }
					: function(d) { return d.size; };

				    node
					.data(treemap.value(value).nodes)
				      .transition()
					.duration(1500)
					.call(position);
				  });
				 
				 
				  
				});

				function position() {
				  this.style("left", function(d) { return d.x + "px"; })
				      .style("top", function(d) { return d.y + "px"; })
				      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
				      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
				}
				
          		
		}
	});

})(jQuery);

