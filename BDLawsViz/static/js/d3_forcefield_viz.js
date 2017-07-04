/**
 * Created by pinku on 7/3/17.
 */


var mx = 9;
var mn = 1;
var dtb = 150;
var db = 3;
var etb = 10;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    //.force("link", d3.forceLink())
    .force("link", d3.forceLink().id(function(d){return d.id;}).distance(function(d){return dtb*(((mx-mn+1)-d.value+db)/(mx-mn+1));}))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("static/combined.json", function(error, graph) {
  if (error) throw error;

  var tip;
  var ex;
  var ey;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return etb + d.value; });



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
       .style("stroke", "steelblue");
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

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 15)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  node.append("image")
      .attr("xlink:href", "https://github.com/favicon.ico")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16);

  node.on("click", function(d){
    console.log("node clicked");
    if (tip) tip.remove();

    tip  = svg.append("g")
      .attr("transform", "translate(" + d.x  + "," + d.y + ")");

    var rect = tip.append("rect")
      .style("fill", "white")
      .style("stroke", "steelblue");

    tip.append("text")
      .text("Name: " + d.name)
      .attr("dy", "1em")
      .attr("x", 5);

    tip.append("text")
      .text("Group: " + d.group)
      .attr("dy", "2em")
      .attr("x", 5);

    var con = graph.links
      .filter(function(d1){
        return d1.source.id === d.id;
      })
      .map(function(d1){
        return d1.target.name + " with weight " + d1.weight;
      })

    tip.append("text")
      .text("Connected to: " + con.join(","))
      .attr("dy", "3em")
      .attr("x", 5);

    var bbox = tip.node().getBBox();
    rect.attr("width", bbox.width + 5)
        .attr("height", bbox.height + 5)
  });


  var text = svg.append("g").attr("class", "labels").selectAll("g")
    .data(graph.nodes)
  .enter().append("g");

  text.append("text")
    .attr("x", 14)
    .attr("y", ".31em")
    .style("font-family", "sans-serif")
    .style("font-size", "0.7em")
    .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  }
});

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