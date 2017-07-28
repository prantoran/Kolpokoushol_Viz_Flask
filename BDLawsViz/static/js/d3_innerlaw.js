
var svgRick, colorRick, widthRick, heightRick;

var linkRick, nodeRick;
var simulationRick;
var cr = 10;
var el = 10;
var nodeByIdRick, nodeByIdRick, linksRick, bilinksRick;

function resetRick() {
    if (svgRick) {
        svgRick.remove();
    }
    if (nodeRick) {
        nodeRick.remove();
    }
    if (linkRick) {
        linkRick.remove();
    }
    if (simulationRick) {
        simulationRick = d3.forceSimulation()
        //.force("link", d3.forceLink())
            .force("link", null)
            .force("charge", null)
            .force("center", null);
    }
}


function generateRickForceField(graphRick) {
    resetRick();


    document.getElementById("homeModalRghtCol").innerHTML = '<svg id="rickviz" width='+browserWidth/2 +' height='+browserHeight/2+' ></svg>'

    svgRick = d3.select("#rickviz");
    widthRick = +svgRick.attr("width");
    heightRick = +svgRick.attr("height");

    colorRick = d3.scaleOrdinal(d3.schemeCategory20);

    simulationRick = d3.forceSimulation()
    .force("link", d3.forceLink().distance(el).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(widthRick / 2, heightRick / 2));

    nodesRick = graphRick.nodes;
    nodeByIdRick = d3.map(nodesRick, function(d) {return d.id; });
    linksRick = graphRick.links;
    bilinksRick = [];


    var nlenRick = linksRick.length;

    for( var j = 0; j < nlenRick; j ++ ) {
        var l = linksRick[j];
        var s = l.source = nodeByIdRick.get(l.source),
            t = l.target = nodeByIdRick.get(l.target),
            i = {};
        nodesRick.push(i);
        linksRick.push({source: s, target: i}, {source: i, target: t});
        bilinksRick.push([s,i,t]);
    }

    linkRick = svgRick.selectAll(".link")
                    .data(bilinksRick)
                    .enter().append("path")
                    .attr("class", "linkRick");

    nodeRick = svgRick.selectAll(".node")
                    .data(nodesRick.filter(function(d) { return d.id; }))
                    .enter().append("circle")
                    .attr("class", "nodeRick")
                    .attr("r", cr)
                    .attr("fill", function(d) { return color(d.group); })
                    .call(d3.drag()
                        .on("start", dragstartedRick)
                        .on("drag", draggedRick)
                        .on("end", dragendedRick));

    nodeRick.append("title")
            .text(function(d) { return d.id; });

    simulationRick
        .nodes(nodesRick)
        .on("tick", tickedRick);

    simulationRick.force("link")
        .links(linksRick);

    function tickedRick() {

            linkRick.attr("d", positionLinkRick);

            nodeRick.attr("transform", positionNodeRick);
                    //.attr("cx", function(d) {return d.x = Math.max(cr,Math.min(widthRick-cr,d.x));})
                    //.attr("cy", function(d) {return d.y = Math.max(cr, Math.min(heightRick-cr,d.y));});
    }
}
function positionLinkRick(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNodeRick(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstartedRick(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function draggedRick(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragendedRick(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}
