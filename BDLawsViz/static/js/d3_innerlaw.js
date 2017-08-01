
var svgRick, colorRick, widthRick, heightRick;

var linkRick, nodeRick;
var innerSVGWidth, innerSVGHeight;
var simulationRick;
var cr = 10;
var el = 20;
var nodeByIdRick, nodeByIdRick, linksRick, bilinksRick;

// *** START Node Highlighting *** //


var toggleRick = 0;
var edgeGridRick = [];
var textRick;

var curHighlightedPara;
var lstHighlightedPara;


function neighboringRick(a, b) {
    if(a.id === b.id) return 1;
    return edgeGridRick[a.id][b.id] ? 1: 0;
}

function connectedNodesRick() {
    if (toggleRick == 0) {
        d = d3.select(this).node().__data__;
        console.log(d);
        nodeRick.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 0.8 : 0.1;
        });
        // linkRick.style("opacity", function (o) {
        //     return d.index==o.source.index | d.index==o.target.index ? 0.8 : 0.1;
        // });
        toggleRick = 1;
    } else {
        nodeRick.style("opacity", 0.8);
        //linkRick.style("opacity", function(d){return d.opacity;});
        toggleRick = 0;
    }
}

// *** END Node Highlighting *** //



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


function generateRickForceField(graphRick, searchFlagRick) {
    resetRick();
    para = "";
    lstHighlightedPara = "";
    document.getElementById("homeModalRghtCol").innerHTML = '<svg class="svg_frame" id="rickviz" width='+ innerSVGWidth + ' height='+innerSVGHeight+ ' ></svg>'
                                                            + '<br>Show Node Names <input id="tglInnerNms" type="checkbox" name="showNodeRickNames" value="showNodeRickNames" checked>';

    var p = document.getElementById("tglInnerNms");
    p.addEventListener('change', function(event) {
        if(p.checked) {
            textRick.style("opacity", 1);
        }
        else {
            textRick.style("opacity", 0);
        }
    })


    svgRick = d3.select("#rickviz");
    //widthRick = +svgRick.attr("width");
    //heightRick = +svgRick.attr("height");
    widthRick = innerSVGWidth;
    heightRick = innerSVGHeight;

    colorRick = d3.scaleOrdinal(d3.schemeCategory20);

    simulationRick = d3.forceSimulation()
    .force("link", d3.forceLink().distance(el).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(widthRick / 2, heightRick / 2));

    nodesRick = graphRick.nodes;
    nodeByIdRick = d3.map(nodesRick, function(d) {return d.id; });
    console.log(nodeByIdRick);
    linksRick = graphRick.links;
    bilinksRick = [];

    var nlenRick = nodesRick.length;
    for(var i = 0 ; i<=nlenRick; i ++ ) {
        edgeGridRick[i] = [];
    }


    nlenRick = linksRick.length;

    console.log(graphRick.links);
    console.log(graphRick.nodes);

    for( var i = 0; i <nlenRick; i ++ ) {
        var w = {
            value: 1
        }
        var l = linksRick[i];
        edgeGridRick[l.source][l.target] = w;
        edgeGridRick[l.target][l.source] = w;


        console.log(typeof(l.target));
    }


    console.log(edgeGridRick);
    for( var j = 0; j < nlenRick; j ++ ) {

        var l = linksRick[j];
        console.log(l);
        var s = l.source = nodeByIdRick.get(l.source),
            t = l.target = nodeByIdRick.get(l.target),
            i = {
                type: "curvy",
                linkid: j
            };
        nodesRick.push(i);
        linksRick.push({source: s, target: i}, {source: i, target: t});
        bilinksRick.push([s,i,t]);
    }








    console.log(bilinksRick);



    linkRick = svgRick.selectAll(".link")
                    .data(bilinksRick)
                    .enter().append("path")
                    .attr("class", "linkRick");

    linkRick.on("click", function(d) {
        console.log(d);
        var id = d[1].linkid;
        var para;
        console.log("lstpra:" + lstHighlightedPara);
        if(lstHighlightedPara) {
            para = document.getElementById(lstHighlightedPara);
            para.classList.remove('highlight');
        }
        curHighlightedPara = "edgeinfo_" + id;
        console.log(curHighlightedPara);
        para = document.getElementById(curHighlightedPara);

        console.log(para.innerHTML);
        para.classList.add('highlight');

         para.scrollIntoView(true);

        lstHighlightedPara = curHighlightedPara;
        console.log(id);
    });

    nodeRick = svgRick.selectAll(".node")
                    .data(nodesRick.filter(function(d) { return d.id; }))
                    .enter().append("circle")
                    .attr("class", "nodeRick")
                    .attr("r", cr)
                    .on('click', connectedNodesRick)
                    .style("fill", function(d) { return color(d.group); })
                    .style("stroke", function(d) { return d3.rgb(color(d.group)).darker(); })
                    .call(d3.drag()
                        .on("start", dragstartedRick)
                        .on("drag", draggedRick)
                        .on("end", dragendedRick));

    nodeRick.append("title")
            .text(function(d) { return d.label; });

    console.log("pass");

    if(searchFlagRick) {
        textRick = svgRick.append("g").attr("class", "labels").selectAll("g")
            .data(nodesRick)
            .enter().append("g");

        textRick.append("text")
            .attr("x", 14)
            .attr("y", ".31em")
            .style("font-family", "sans-serif")
            .style("font-size", "0.9em")
            .text(function (d) {
                return d.label;
            });
    }



    simulationRick
        .nodes(nodesRick)
        .on("tick", tickedRick);

    simulationRick.force("link")
        .links(linksRick);

    function tickedRick() {

            linkRick.attr("d", positionLinkRick);

            nodeRick.attr("transform", positionNodeRick);

            if(textRick) {
                textRick
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            }
    }
}
function positionLinkRick(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNodeRick(d) {
    d.x = Math.max(cr,Math.min(widthRick-cr,d.x));
    d.y = Math.max(cr, Math.min(heightRick-cr,d.y));
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


function toggleNamesRick(event) {
    console.log("en toggle");
    if(document.getElementById("tglInnerNms").checked) {
        textRick.style("opacity", 1);
    }
    else {
        textRick.style("opacity", 0);
    }
}
