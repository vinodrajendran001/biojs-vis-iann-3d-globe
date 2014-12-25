/** 
 * Solr Pie Chart component 
 * 
 * @class
 * @extends Biojs
 * 
 * @requires <a href='http://raphaeljs.com/'>Raphael</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="https://raw.github.com/DmitryBaranovskiy/raphael/master/raphael.js"></script>
 * 
 * @requires <a href='http://g.raphaeljs.com/'>gRaphael</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://g.raphaeljs.com/g.raphael.js"></script>
 * 
 * @requires <a href='http://g.raphaeljs.com/'>gRaphael</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://g.raphaeljs.com/g.pie.js"></script>
 * 
 * @requires <a href='http://blog.jquery.com/2011/09/12/jquery-1.7.1-released/'>jQuery Core 1.7.1</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
 * 
 * @author <a href="mailto:rajido@gmail.com">Rafael C. Jimenez</a>
 * 
 * @param {Object} options An object with the options for Solr Pie Chart component.
 *    
 * @option {string} target 
 *    Identifier of the DIV tag where the component should be displayed.
 *    
 * @option {string} chartTitle
 *    Title of the chart.
 *    
 * @option {string} solrUrl
 *    SOLR url. i.e. http://iann.pro/solr
 *
 * @option {string} facetField
 *    Solr facet field you would like to query to get the pie chart.
 *    
 * @example 
 * var myPieChart = new Biojs.SolrPieChart({
 * 		facetField : "field",
 *		chartTitle : "Title of the chart",
 *		solrUrl : "http://iann.pro/solr",
 *		target : "holder"		
 * });	
 * 
 */

Biojs.SolrPieChart = Biojs.extend(
/** @lends Biojs.SolrPieChart# */
{	
	constructor: function (options) {
		Biojs.console.enable();		
		if (this.opt.facetField !== undefined) {
			this.setFacetField (this.opt.facetField);
		}
	},
	
	
	/**
	 * Default values for the options
	 * @name Biojs.SolrPieChart-opt
	 */
	opt : {	
		facetField : "field",
 		chartTitle : "Title of the chart",
 		solrUrl : "http://iann.pro/solr",
 		target : "YourOwnDivId"
	},
	
	/**
	 * Array containing the supported event names
	 * @name Biojs.Sequence-eventTypes
	 */
	eventTypes : ["onRequestError"],
	
	/**
    * 
    *
    * @example
    * instance.setId('4991');
    * 
    */
	setFacetField: function(facetField) {
            	var chartTitle = this.opt.chartTitle;
            	var solrUrl = this.opt.solrUrl;
            	var url = solrUrl + "/select/?q=*:*&facet=true&facet.field=" + facetField + "&rows=0&wt=json&json.wrf=?";
				var target = this.opt.target;
				$.getJSON(url,
				function(json){	
					/* Get keys and values of facet fields */			
					var isEven = function(someNumber){
						return (someNumber%2 == 0) ? true : false;
					};
            		var facetData = json.facet_counts.facet_fields[facetField];
            		var facetDataKeys = [];
            		var facetDataValues = [];
            		var facetDataKeysDisplay = [];
            		for (key in facetData){
            			if(isEven(key)){
            				facetDataKeys.push(facetData[key]);	
            				facetDataKeysDisplay.push("%%.%% - " + facetData[key]);
            			} else {
            				facetDataValues.push(facetData[key]);	
            			}
					}

					/* Print pie charts */
	                var r = Raphael(target),
	                	//pie = r.piechart(300, 180, 100, facetDataValues, { legend: facetDataKeysDisplay, legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});
						pie = r.piechart(340, 180, 100, facetDataValues, { legend: facetDataKeysDisplay, legendpos: "west", href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]});	
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
				}); //$.getJSON

	}
	
});


