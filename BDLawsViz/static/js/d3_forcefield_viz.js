/**
 * Created by pinku on 7/3/17.
 */


var browserWidth = window.innerWidth.toString();
var browserHeight = window.innerHeight.toString();

var mx = 9;
var mn = 1;
var dtb = 150;
var db = 3;
var etb = 10;
var ld = 100;

var getAllEdgeDisBuff = 100;
var minRadiusSQ;

var bx_op = '0.7';

var edgeWidthFunc;
var forceLinkDistanceFunc;

var markerWidth;
var markerHeight;

var tip, ex, ey;
var link, node;

var svg;
var color;
var text;
var simulation;

// *** START Node Highlighting *** //

var toggle = 0;

function neighboring(a, b) {
    if(a.id === b.id) return 1;
    return edgeGrid[a.id][b.id] ? 1: 0;
}

function connectedNodes() {
    if (toggle == 0) {
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 0.8 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 0.8 : 0.1;
        });
        toggle = 1;
    } else {
        node.style("opacity", 0.8);
        link.style("opacity", function(d){return d.opacity;});
        toggle = 0;
    }
}

// *** END Node Highlighting *** //

function reset() {
    if (svg) {
        svg.remove();
    }
    if (node) {
        node.remove();
    }
    if (link) {
        link.remove();
    }
    if (simulation) {
        simulation = d3.forceSimulation()
        //.force("link", d3.forceLink())
            .force("link", null)
            .force("charge", null)
            .force("center", null);
    }
}

function visualizeForceField(graph, minRadius, searchFlag, coolArrowFlag) {
     reset();
     minRadiusSQ = minRadius*minRadius;

    document.getElementById("viz").innerHTML = '<svg width="1300" height="630"></svg>'
    simulation = d3.forceSimulation();
    svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    graph.nodes.forEach(function(d) {
        if( (Math.sqrt(minRadiusSQ + inDegreeSize[d.id]) ) > minRadius) {
            d.radius = Math.floor(Math.sqrt(minRadiusSQ + inDegreeSize[d.id]) );
        }
        else {
            d.radius = minRadius;
        }
    });

    if(searchFlag) {

        edgeWidthFunc = function(d) { return etb + d.value; }
        markerWidth = 2;
        markerHeight = 2;

        forceLinkDistanceFunc = function(d){
            return Math.max(ld, dtb*(((mx-mn+1)-d.value+db)/(mx-mn+1)) );
        }

        svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 14)
            .attr("refY", 0)
            .attr("markerWidth", markerWidth)
            .attr("markerHeight", markerHeight)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5")
            .style('stroke', 'none')
            .attr('fill', '#123')
            .style('stroke', 'white')
            .style('opacity', .9);
    }
    else {
        edgeWidthFunc = function(d) { return Math.sqrt(d.value); };

        forceLinkDistanceFunc = function(d) {
            return Math.max(ld, dtb*(((mx-mn+1)-d.value+db)/(mx-mn+1)) );
        }

        if( coolArrowFlag) {
            svg.append("defs").selectAll("marker")
                .data(["suit", "licensing", "resolved"])
                .enter().append("marker")
                .attr("id", function(d) { return d; })
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 20)
                .attr("refY", 0)
                .attr("markerWidth", markerWidth)
                .attr("markerHeight", markerHeight)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
                .style("stroke", "#123")
                .style("opacity", "0.6");
        }

    }
    graph.links.forEach(function (d) {
        d.opacity = Math.round( 10 * Math.max(Math.min(0.9, d.value/mx), 0.1) ) / 10;
    });

    svg.append("text")            // append text
        .style("fill", "#0B3C22" )      // make the text black
        .style("writing-mode", "lr") // set the writing mode
        .attr("x", 1.8*(width/5) )         // set x position of left side of text
        .attr("y", (height/12) )         // set y position of bottom of text
        .text("Bangladesh Law Network")   // define the text to display
        .style("font-size", "34px");

    color = d3.scaleOrdinal(d3.schemeCategory20);

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function(d){return d.id;})
            .distance( forceLinkDistanceFunc ))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));


    configureLinks(graph, edgeWidthFunc, searchFlag);

    configureNodes(graph, searchFlag);

    if(searchFlag) {
        text = svg.append("g").attr("class", "labels").selectAll("g")
            .data(graph.nodes)
            .enter().append("g");

        text.append("text")
            .attr("x", 14)
            .attr("y", ".31em")
            .style("font-family", "sans-serif")
            .style("font-size", "0.7em")
            .text(function (d) {
                return d.name;
            });
    }

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

}

function ticked(searchFlag) {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); });

    if(text){
        text
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    }

}


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}
function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}
function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function configureLinks(graph, edgeWidthFunc, searchFlag) {

    if(searchFlag) {
        link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width",  edgeWidthFunc)
          .attr('marker-end','url(#arrowhead)')
          .style('opacity',function(d){return d.opacity;});
    }
    else {
        link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
          .attr("stroke-width",  edgeWidthFunc)
            .style("marker-end",  "url(#suit)") // Modified line
          .style('opacity',function(d){return d.opacity;});
    }

  link.append("title")
      .text(function (d) {return "cited";});

  link.on("click",function(d){
    console.log("edges clicked");
    if (tip) tip.remove();

    ex = ( d.source.x + d.target.x ) /2;
    ey = ( d.source.y + d.target.y ) /2;

    console.log(d);
    tip  = svg.append("g")
      .attr("transform", "translate(" + ex  + "," + ey + ")");

     var rect = tip.append("rect")
                .style("fill", "white")
                .style("stroke", '#123')
                .style('opacity', bx_op);

     console.log("rect pass");



    tip.append("text")
      .text("Source")
      .attr("dy", "1em")
      .attr("x", 5);

    tip.append("text")
      .text("name: " + d.source.name )
      .attr("dy", "2em")
      .attr("x", 5);

    tip.append("text")
      .text("id: " + d.source.id )
      .attr("dy", "3em")
      .attr("x", 5);

    tip.append("text")
      .text("group: " + d.source.group )
      .attr("dy", "4em")
      .attr("x", 5);

    tip.append("text")
      .text("")
      .attr("dy", "5em")
      .attr("x", 5);



    tip.append("text")
      .text("Target")
      .attr("dy", "6em")
      .attr("x", 5);

    tip.append("text")
      .text("name: " + d.target.name )
      .attr("dy", "7em")
      .attr("x", 5);

    tip.append("text")
      .text("id: " + d.target.id )
      .attr("dy", "8em")
      .attr("x", 5);

    tip.append("text")
      .text("group: " + d.target.group )
      .attr("dy", "9em")
      .attr("x", 5);

    tip.append("text")
      .text("")
      .attr("dy", "10em")
      .attr("x", 5);


    tip.append("text")
      .text("Edge Strength: " + d.value)
      .attr("dy", "11em")
      .attr("x", 5);





    var bbox = tip.node().getBBox();
    rect.attr("width", bbox.width + 5)
        .attr("height", bbox.height + 5)
  });
}

function configureNodes(graph) {
  node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function(d){return d.radius;})
      .attr("fill", function(d) { return color(d.group); })
      .style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on('dblclick', connectedNodes);;


  node.append("title")
      .text(function(d) { return d.name; });




  node.on("click", function(d){
    if (tip) tip.remove();

    tip  = svg.append("g")
      .attr("transform", "translate(" + d.x  + "," + d.y + ")");

    var rect = tip.append("rect")
                .style("fill", "white")
                .style("stroke", '#123')
                .style('opacity', bx_op );


    tip.append("text")
      .text("Name: " + d.name)
      .attr("dy", "1em")
      .attr("x", 5);




    tip.append("text")
      .text("Group: " + d.group)
      .attr("dy", "2em")
      .attr("x", 5);

    if(outDegreeSize[d.id]) {
        tip.append("text")
          .text("Cited: " + outDegreeSize[d.id].toString() + " law(s).")
          .attr("dy", "3em")
          .attr("x", 5);
    }

    if(inDegreeSize[d.id]) {
        tip.append("text")
          .text("Cited by: " + inDegreeSize[d.id].toString() + " law(s).")
          .attr("dy", "4em")
          .attr("x", 5);
    }

    tip.append("text")
      .text("Id: " + d.id)
      .attr("dy", "5em")
      .attr("x", 5);

    var bbox = tip.node().getBBox();
    rect.attr("width", bbox.width + 5)
        .attr("height", bbox.height + 5)
  });
}