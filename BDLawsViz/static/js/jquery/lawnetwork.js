
var graphRick;

function isNormalInteger(str) {
    if(typeof(n) == "string") {
        var n = Math.floor(Number(str));
        return String(n) === str && n > 0;
    }
    return str > 0;
}

function processHomeModal(d) {
    $("#homeModalTitle").html(d.name);
    var ret2 = {
        'response': {},
        'is_error': false,
        'error': ""
    }
    if(isNormalInteger(d.id)) {
        $.when(searchLawNetworkID(ret2, d.id)).done( function(a1) {

            graphRick = {
                id : d.id,
                nodes : [],
                links : [],
            }

            validationRick(graphRick, ret2.response);

            $("#homeModalLeftCol").html(GenerateParagraphs(graphRick));

            generateRickForceField(graphRick, 1);
            $("#homeModal").modal('show');
        });
    }
    else {
        $('#homeModalRghtCol').html("Node ID is invalid");
        $("#homeModal").modal('show');
    }
}


function validationRick(g, h) {
    h.links.forEach(function(d) {
        var p = {
            source: d.from,
            target: d.to,
            value: d.value,
            title: d.title
        };
        g.links.push(p);
    })
    h.nodes.forEach(function(d) {
        var p = {
            id: d.id,
            group: d.value,
            type: d.type,
            label: d.label
        };
        g.nodes.push(p);
    });
}

function GenerateParagraphs(g) {
    var ret = '';
    var nlen = g.links.length;
    for(var i = 0 ; i < nlen; i ++ ) {
        var cur = '<p id="edgeinfo_'+i.toString()+'" class="inner_phrase" >';
        //console.log(g.links[i].title);
        cur += g.links[i].title || "";
        cur += '</p>';
        ret += cur;
    }
    return ret;
}
