/**
 * Created by pinku on 6/29/17.
 */

var names = [];
var edges = [];


var edgeGrid = [];
var mxid = 0 ;
var idNames = {};

var fEdges = [];
var fNames = [];
var graph = {};
var graph2 = {};

var inDegreeSize = [];
var outDegreeSize = [];

var  mxrndmvalue = 10;

$(document).ready(function() {

    var names_ret = {
        response: "",
        is_error: false,
        error: ""
    };
    var edges_ret = {
        response: "",
        is_error: false,
        error: ""
    };





    $.when(getAllNames(names_ret), getAllEdges(edges_ret)).done(function (a1, a2) {

        var u = names_ret.response;
        names = u;
        var len = u.length;
        fNames = [];
        mxid = 0;
        for (var i = 0; i < len; i++) {
            mxid = Math.max(mxid, u[i].Id);
            idNames[ u[i].Id] = u[i].name;
            var v = {
                "id": u[i].Id,
                "name": u[i].name,
                "group": Math.floor(Math.random() * mxrndmvalue) + 1
            }
            fNames.push(v);
        }

        edgeGrid = [];
        for(var i = 0 ; i<=mxid; i ++ ) {
            edgeGrid[i] = [];
        }

        u = edges_ret.response;
        edges = u;
        len = u.length;
        fEdges = [];
        for(var i = 0 ; i < len; i++) {
            if ((u[i].source in idNames) && (u[i].destination in idNames)) {

                if(u[i].source in outDegreeSize) {
                    outDegreeSize[u[i].source] ++;
                }
                else {
                    outDegreeSize[u[i].source] = 1;
                }

                if(u[i].destination in inDegreeSize) {
                    inDegreeSize[u[i].destination] ++;
                }
                else {
                    inDegreeSize[u[i].destination] = 1;
                }

                var v = {
                    "source": u[i].source,
                    "target": u[i].destination,
                    "value": Math.floor(Math.random() * mxrndmvalue) + 1
                }
                var w = {
                    "value": Math.floor(Math.random() * mxrndmvalue) + 1
                }
                edgeGrid[u[i].source][u[i].destination] = w;
                fEdges.push(v);
            }
        }
        graph = {
            "nodes": fNames,
            "links": fEdges
        };
        graph2 = graph;
        console.log(graph);
        visualizeForceField(graph, 8, 0, 0);
    });

});



function getAllNames(ret) {
    return $.ajax({
        url: '/getallnames',
        type: 'GET',
        success: function (response) {
            ret['response'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    });
}

function getAllEdges(ret) {
    return $.ajax({
        url: '/getalledges',
        type: 'GET',
        success: function (response) {
            ret['response'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    });
}

function SearchByName(ret) {
     return $.ajax({
        url: '/searchname',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['name'] = response;
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    });
}

function SearchOutDegree(ret) {
    return $.ajax({
        url: '/searchoutdegree',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['outdegree'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    })
}

function SearchInDegree(ret) {
    return $.ajax({
        url: '/searchindegree',
        data: $('form').serialize(),
        type: 'POST',
        success: function (response) {
            ret['indegree'] = JSON.parse(response);
        },
        error: function (error) {
            ret['is_error'] = true;
            ret['error'] = error;
        }
    })
}
