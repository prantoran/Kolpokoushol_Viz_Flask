/**
 * Created by pinku on 7/7/17.
 */

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
                        'ngram': 0
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

    fNames = [];
    var u = res;
    var len = u.length;

    for (var i = 0; i < len; i++) {

        var v = {
            "id": u[i],
            "name": idNames[u[i]],
            "group": Math.floor(Math.random() * mxrndmvalue) + 1
        }
        fNames.push(v);
    }

    fEdges = [];
    for(i = 0 ; i < len; i ++ ) {
        for( j = 0 ; j < len ; j ++ ) {
            if ( i == j ) continue;
            if(edgeGrid[u[i]][u[j]]) {
                var v = {
                    "source": edgeGrid[u[i]][u[j]].source,
                    "target": edgeGrid[u[i]][u[j]].target,
                    "value": edgeGrid[u[i]][u[j]].value
                }
                fEdges.push(v);
            }
        }
    }

    graph = {
        "nodes": fNames,
        "links": fEdges
    };
    console.log(graph);
    visualizeForceField(graph, 1);
}