(function ($) {

AjaxSolr.metaGlobeMap = AjaxSolr.AbstractFacetWidget.extend({ 

  afterRequest: function () {
var mapWidth = 960,
mapHeight = 600,
focused = false,
ortho = true, 
sens = 0.25;
k=1;
x = mapWidth / 2;
y = mapHeight / 2;
k = 1;
centered = null;

var zoom2D = false;

if (Manager.currentTab==undefined || Manager.currentTab!='3D Globe')
        return;
      

      var self = this;
      $(this.target).empty();
      var innerhtml='';
      for (var i in this.field){
        innerhtml+='<div id="iann_globe'+this.field[i]+'"></div>';
      } 
      $(this.target).html(innerhtml); 


var countriesWithEvents = {};

var radius = 2,  // px
        hoverRadius = 20; // px

var projectionGlobe = d3.geo.orthographic()
.scale(300)
.rotate([0, 0])
.translate([mapWidth / 2, mapHeight / 2])
.clipAngle(90);

var projectionMap = d3.geo.equirectangular()
.scale(145)
.translate([mapWidth / 2, mapHeight / 2])

var projection = projectionGlobe;

var path = d3.geo.path()
.projection(projection)
.pointRadius( function(d,i) {
            return radius;
          });



      // Define the longitude and latitude scales, which allow us to map lon/lat coordinates to pixel values:
      var lambda = d3.scale.linear()
          .domain([0, mapWidth])
          .range([-180, 180]);

      var phi = d3.scale.linear()
          .domain([0, mapHeight])
          .range([90, -90]);

var countryList = d3.select(this.target).append("select").attr("name", "countries");


var svgMap = d3.select(this.target).append("svg")
.attr("overflow", "hidden")
.attr("width", mapWidth)
.attr("height", mapHeight);


var backgroundCircle = svgMap.append("svg:circle")
            .attr('cx', mapWidth / 2)
            .attr('cy', mapHeight / 2)
            .attr('r', 0)
            .attr('class', 'geo-globe');

var zoneTooltip = d3.select(this.target).append("div").attr("class", "zoneTooltip");


infoLabel = d3.select(this.target).append("div").attr("class", "infoLabel");


//var world = svgMap.append("g");

var g = svgMap.append('g');


//Rotate to default before animation

var locations = svgMap.append('g')
          .attr('id', 'locations');

        // Having defined the projection, update the backgroundCircle radius:
      backgroundCircle.attr('r', projection.scale() );



function defaultRotate() {
  d3.transition()
  .duration(1500)
  .tween("rotate", function() {
    var r = d3.interpolate(projection.rotate(), [0, 0]);
    return function(t) {
      projection.rotate(r(t));
      g.selectAll("path").attr("d", path);
    };
  })
};

//Loading data

// queue()
// .defer(d3.json, "data/world-countries.json")
// .defer(d3.tsv, "data/world-110m-country-names.tsv")
// .await(ready);

d3.json('data/world-countries.json', function(world) { 
          
//function ready(error, world, countryData) {

  var countryById = {},
  countries = world.features;//topojson.feature(world, world.objects.countries).features;

  //Adding countries by name

  d3.tsv('data/world-110m-country-names.tsv', function(countryData) { 


      countryData.forEach(function(d) {
        //console.log("idhar="+JSON.stringify(d));
        countryById[d.name] = d.name;
      });

      countryData.forEach(function(d) {
          countryById[d.name] = d.name;
          option = countryList.append("option");
          option.text(d.name);
          option.property("value", d.name);
      });

});

  var collectionCountriesData = [];
  var collectionCountries = [];


  for (var i = 0, l = self.manager.response.response.docs.length; i < l; i++) {
        var doc = self.manager.response.response.docs[i];
       
      // {  
         // "type": "Feature",
        // "geometry": {
        //   "type": "Point",
        //   "coordinates": [
        //     "-0.1198244",
        //     "51.5112139"
        //   ]
        // },
        // "properties": {
        //   "name": "London, UK"
        // }

      // }  

           // if(collectionCountries.indexOf(doc.country) === -1){

                var obj = new Object();

                obj.type = 'Feature';
                

                var inside = new Object();

                inside.type = 'Point';

                var onemore = new Object();

                inside.coordinates = [];
                //lon lat

                inside.coordinates.push(doc.longitude);
                inside.coordinates.push(doc.latitude);
              
                obj.geometry = inside;  


                obj.properties = new Object();
                obj.properties.name = doc.city+", "+ doc.country;

                collectionCountries.push(doc.country);


                collectionCountriesData.push(obj);

         // }
          

    }     

    plotMarkers();
         //console.log("yaha kya haal="+JSON.stringify(collection.features)); 
        // Plot the positions on the map:
    function plotMarkers(){   

          $(locations).empty();
             circles = locations.selectAll('path')
            .data(collectionCountriesData)
            .enter()
            .append('svg:path')
              .attr('class', 'geo-node')
              .attr('d', path);
              //.on('mouseover', mouseover)
              //.on('mouseout', mouseout);

          circles.append('svg:title')
              .text( function(d) { return d.properties.name; } );

    }


  //Drawing countries on the globe

  // var world = g.selectAll("path").data(countries);
  // world.enter().append("path")
  // //.attr("class", "mapData")
  // .attr('class', 'geo-path')

  // .attr("d", path)
  // .classed("ortho", ortho = true);


var world = g.selectAll('path')
          .data(countries)
          .enter()
          .append('path')
            .attr('class', 'geo-path')
            .attr('d', path)
              .classed("ortho", ortho = true); 
        



 var zoom = d3.behavior.zoom(true)
            .scale( projection.scale() )
            .scaleExtent([100, 800])
            .on("zoom", globeZoom);

  // svgMap.call(zoom)
  //         .on('dblclick.zoom', null);


    function globeZoom() {

      if(ortho === false){
          if (d3.event) {
            var _scale = d3.event.scale;

              projection.scale(_scale);
              backgroundCircle.attr('r', _scale);
              path.pointRadius( radius );

              //features.attr('d', path);
            svgMap.selectAll("path").attr("d", path);
            //circles.attr('d', path); 
          }
          }; // end IF
    };


 // g.attr("transform","translate(" + translatedGlobeX + "," + translatedGlobeY+ ")");

  svgMap.call(d3.behavior.drag()
    .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
    .on("drag", function() {
      var lambda = d3.event.x * sens,
      phi = -d3.event.y * sens,
      rotate = projection.rotate();
      //Restriction for rotating upside-down
      phi = phi > 30 ? 30 :
      phi < -30 ? -30 :
      phi;
      projection.rotate([lambda, phi]);
      g.selectAll("path.ortho").attr("d", path);
      g.selectAll(".focused").classed("focused", focused = false);

      svgMap.selectAll("path").attr("d", path);


    }))


  //Events processing
  var toplist = zoneTooltip.append("ul").attr("class","zoneTooltipList");

  world.on("mouseover", function(d) {
    if (zoom2D === false) {
     
   // } else {
     /*
      zoneTooltip.text(countryById[d.id])
      .style("left", (d3.event.pageX + 7) + "px")
      .style("top", (d3.event.pageY - 15) + "px")
      .style("display", "block");
     
    */
    infoLabel.text(d.properties.name)
          .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px")

    .style("display", "inline");

  } 
   
      
   // }
  })
  .on("mouseout", function(d) {
   // if (ortho === true) {
      infoLabel.style("display", "none");
   // } else {
      //zoneTooltip.style("display", "none");
//}
  })
  .on("mousemove", function() {
   // if (ortho === false) {
     // zoneTooltip.style("left", (d3.event.pageX + 7) + "px")
     // .style("top", (d3.event.pageY - 15) + "px");
   // }
  })
  .on("dblclick", function(d) {


    console.log("dbclick, "+JSON.stringify(d));

    var clickable = false;
    for (var i = 0, l = self.manager.response.response.docs.length; i < l; i++) {
        var doc = self.manager.response.response.docs[i];
       

        //console.log("yaha aaja"+doc.country+"and, "+countryById[d.id]);
        if(d.properties.name.indexOf(doc.country) > -1){
        //if(d.properties.name===doc.country){

            clickable = true;
            break;

        }
  

    }               


    if(!clickable){
                     console.log("yaha aaja1");

      return;
    }

    if (focused === d && zoom2D === true ) {
      zoom2D = false;
      zoomin2D(d);
      circles.style("display", "block");

      return reset();

    }


    if(zoom2D === true){
      return;
    }

    //g.selectAll(".focused").classed("focused", false);
    //g.transition()
     // .duration(750)
     // .attr("transform", "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      //.style("stroke-width", 1.5 / k + "px");

   // d3.select(this).classed("focused", foc === true used = d);
   // infoLabel.text(countryById[d.id])
   // .style("display", "inline");


    

    infoLabel.text(d.properties.name)
    .style("display", "inline");


          g.selectAll(".focused").classed("focused", false);
        d3.select(this).classed("focused", focused = d);

 // g.selectAll(".focused")
   //   .classed("active", centered && function(d) { return d === centered; });


    //Transforming Globe to Map

    if (ortho === true) {
       // defaultRotate();
      //setTimeout(function() {
        openGlobe(d);
    }

   
  });


  function openGlobe(d){


        backgroundCircle.style("display", "none");

        g.selectAll(".ortho").classed("ortho", ortho = false);
        projection = projectionMap;
        path.projection(projection);
        g.selectAll("path").transition().duration(5000).attr("d", path);

          //circles.attr('d', path);
        circles.transition().duration(5000).attr("d", path);


      //}
      //, 1600);

        zoom2D = true;
        setTimeout(function() {
          function heres() {

            zoomin2D(d);

          };

          heres();
        }, 5000);
       
    
      tooltipCreate(d);
     
  }


///

var x, y, k, centered;

function zoomin2D(d) 
{
  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 3;
    centered = d;
  } else {
    x = mapWidth / 2;
    y = mapHeight / 2;
    k = 1;
    centered = null;
  }
    g.selectAll(".focused").classed("focused", true);

    g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });


  g.transition()
      .duration(800)
      .attr("transform", "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

  
  //circles.style("display", "none");

  circles.transition()
      .duration(800)
      .attr("transform", "translate(" + mapWidth / 2 + "," + mapHeight / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

  //locations.selectAll("path").transition().duration(5000).attr("d", path);

  //g.selectAll("path").attr("transform","translate(" + translatedGlobeX + "," + translatedGlobeY+ ")");

}
  ///TEST

  var selectionCountries = d3.select("select").data(countries);

  selectionCountries.on("change", function(d) {
      var rotate = projection.rotate(),
      focusedCountry = country(countries, this),
      p = d3.geo.centroid(focusedCountry);

      //console.log("select mie+"+JSON.stringify(countries)+", d="+JSON.stringify(d));

      svgMap.selectAll(".focused").classed("focused", focused = false);

    //Globe rotating

    (function transition() {
      d3.transition()
      .duration(2500)
      .tween("rotate", function() {
        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
        return function(t) {
          projection.rotate(r(t));
          svgMap.selectAll("path").attr("d", path)
          .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
          

        };
      })
      })();


       // setTimeout(function() {
       //    function heres() {

       //      openGlobe(d);

       //    };

       //    heres();
       //  }, 2600);


      
    });


    function country(cnt, sel) { 
      for(var i = 0, l = cnt.length; i < l; i++) {
        if(cnt[i].properties.name == sel.value) {return cnt[i];}
      }
    };



  ///TEST



  //Adding extra data when focused

  function focus(d) {
    if (focused === d) return reset();
    g.selectAll(".focused").classed("focused", false);
    d3.select(this).classed("focused", focused = d);
  }

  function reset() {
    g.selectAll(".focused").classed("focused", focused = false);
    infoLabel.style("display", "none");
    zoneTooltip.style("display", "none");

    //Transforming Map to Globe

    plotMarkers();


    projection = projectionGlobe;
    path.projection(projection);
    g.selectAll("path").transition().duration(5000).attr("d", path)
    g.selectAll("path").classed("ortho", ortho = true);

    locations.selectAll("path").transition().duration(5000).attr("d", path)


    backgroundCircle.style("display", "block");


  }

  function tooltipCreate(d){
    $(toplist).empty();

    var countryHasEvents = false;

    var country;
     for (var i = 0, l = self.manager.response.response.docs.length; i < l; i++) {
        var doc = self.manager.response.response.docs[i];
       
        //console.log("self value :" + doc);
        if(d.properties.name.indexOf(doc.country) > -1){
        //if(d.properties.name=== doc.country){

            country = doc.country;

            infoLabel.text(doc.country)
                    .style("display", "inline");
            
            var here = "<a href="+doc.link+" class=iann_item_title>"+doc.title+"</a><br><span class=iann_item_date>"+doc.start+"-"+doc.end+"</span><br><span class=iann_item_place>"+doc.provider+","+doc.city+","+doc.country+"</span><br><span class=iann_item_author>"+doc.host+"</span>";

           toplist.append("li").html(here);

           countryHasEvents = true;
            
       
        }
        

    }

    if(countryHasEvents){

        zoneTooltip
          .style("left", (d3.event.pageX + 7) + "px")
          .style("top", (d3.event.pageY - 15) + "px")
          .style("display", "block");

    }
     
     
       
  }


});
}
});
})(jQuery);