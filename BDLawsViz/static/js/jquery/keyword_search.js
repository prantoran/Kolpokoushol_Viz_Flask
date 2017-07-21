/**
 * Created by pinku on 7/7/17.
 */

var visited = {};

function setNetworkSearchJqueryClick() {
    $(document).ready(function() {

        $("#searchText_form").submit(function(e) {
            e.preventDefault();
        });

        $('#sidePaneButton').click(function() {

            var keyword = document.getElementById('sT').value;

            if(keyword=="") {
                var q = document.getElementById('queryOutputBlock');
                q.innerHTML = "<a style='padding:7% 0% 0% 10%;font-size:18px;' href='#'>The query field is empty. Nothing to show.</a><br/>";
            }
            else {

                var ret = {
                    'response': {},
                    'query_params': {
                        'query': keyword,
                        'ngram': 0,
                        'exclude_unigram': 1
                    },
                    'is_error': false,
                    'error': ""
                }



                $.when( searchByKeyword(ret, buildQueryParams(ret['query_params']) ) ).done( function( a1) {
                    console.log(ret['response']);
                    var p = "";
                    var linkText = "http://bdlaws.minlaw.gov.bd/pdf_part.php?id=";

                    if(ret['is_error']) {
                        p = "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                        p += "Error occurred:</a><br/>";
                        p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href=''>";
                        p += ret['error']+"</a><br/>";
                    }
                    else {
                        p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                        p += "The keyword(s):</a><br/>";
                        p += "<a style='font-size:18px;padding:0% 0% 0% 6%;'>";
                        p += keyword+"</a><br/>";

                        var fnd = false;
                        var u = ret.response.ids;
                        console.log("u:");
                        console.log(u);
                        var len = u.length;
                        for (var i=0;i <len; i ++ ) {

                            console.log(u[i]);
                            if(idNames[u[i]] == undefined) continue;
                            if( fnd == false ) {
                                p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                                p += "The following laws are found that related to the keywords:</a><br/>";
                                fnd = true;
                            }
                            p += "<a style='font-size:18px;padding:0% 0% 0% 6%;' href='";
                            p += linkText+u[i]+"'>";
                            p += "( ID: "+u[i]+" ) "+ idNames[u[i]]+"</a><br/>";
                        }
                        if( fnd == false ) {
                            p += "<a style='font-size:18px;padding:0% 0% 0% 0%;' href='#'>";
                            p += "No related laws found.</a><br/>";
                        }
                        p += "<br/>";
                    }
                    document.getElementById('queryOutputBlock').innerHTML = p ;

                    produceKeywordSearchNetwork(ret.response.ids);

                });

            }
        });
    });
}


function buildQueryParams(p) {
    var ret = "";
    for ( var key in p ) {
        if ( ret == "" ) {
            ret += "?";
        }
        else {
            ret += "&";
        }
        ret = ret  + key + "="+ p[key];
    }
    return ret;
}

function produceKeywordSearchNetwork(res) {
    visited = {};
    fNames = [];
    var u = res;
    var len = u.length;

    for (var i = 0; i < len; i++) {
        if( u[i] in visited ) {
            visited[u[i]] ++;
            continue;
        }
        visited[u[i]] = 1;
        var v = {
            "id": u[i],
            "name": idNames[u[i]],
            "group": Math.floor(Math.random() * mxrndmvalue) + 1
        }
        fNames.push(v);
    }
    fEdges = [];
    len = fNames.length;
    var x,y;
    for(var i = 0 ; i < len; i ++ ) {
        x = fNames[i].id;
        for(var  j = 0 ; j < len ; j ++ ) {
            if ( i == j ) continue;
            y = fNames[j].id;
            if(edgeGrid[x][y]) {
                var v = {
                    "source": x,
                    "target": y,
                    "value": edgeGrid[x][y].value
                }
                fEdges.push(v);
            }
        }
    }

    graph = {
        "nodes": fNames,
        "links": fEdges
    };
    var sf = 1;
    var coolf = 0;
    if (graph.nodes.length > 150) {
        sf = 0;
        if(graph.links.length < 1000) {
            coolf = 1;
        }
    }
    visualizeForceField(graph, Math.min(10, Math.max(0, 4000/graph.nodes.length) ) , sf, coolf);
}
