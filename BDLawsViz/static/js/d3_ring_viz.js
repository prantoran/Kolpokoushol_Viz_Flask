//reference: http://d3plus.org/examples/advanced/9956853/   

var f           = [];
var id          = [];
var sd          = [];
var edges       = 0;
var chk         = [];

var bkpf        = [];
var bkpid       = [];
var bkpsd       = [];
var bkpedges    = [];
var bkpchk      = [];

const NodeNamesCSVPath = "static/n3.csv";
const NodeEdgesCSVPath = "static/gr2.csv";

function resetVariables(tp){
    if(tp==0){
        bkpf        = f;
        bkpid       = id;
        bkpsd       = sd;
        bkpedges    = edges;
        bkpchk      = chk;
    }
    else{
        f       = bkpf;
        id      = bkpid;
        sd      = bkpsd;
        edges   = bkpedges;
        chk     = bkpchk;   
    }

}

function clearVariables(){
        f       = [];
        id      = [];
        sd      = [];
        edges   = [];
        chk     = [];
}

var alen = 0;
d3.csv( NodeEdgesCSVPath, function(data){
    alen = data.length;
    d3.csv( NodeNamesCSVPath, function(namesData){
        edges = [];//debugging <<-----------------------------DELETE THIS
        for(var i = 0 , n = data.length;i<n;i++){

            if(data[i]["source"] == data[i]["destination"])continue; 
            var tmp = {} 
            if(!(data[i]["source"] in chk))chk[data[i]["source"]]=[];
                    //if( (data[i]["destination"] in chk[data[i]["source"]]))continue; //cancelling more than edge in both directions
            chk[data[i]["source"]][data[i]["destination"]]=1;

            tmp["source"] = data[i]["source"];
            tmp["target"] = data[i]["destination"];
                    //tmp["weight"]=1.0;   //<--------------------Tried to implement weight property of edges
                    //console.log(tmp);
            edges.push(tmp);
            for(var m in data[i]){
                if (!(data[i][m] in f)){
                    f[data[i][m]]=0;
                }
                f[data[i][m]]+=1;
            }
        }

        communities = d3plus.network.cluster(edges,[{"distance":100},{"nodeid":"string"}]);
        var groupID = [];
        console.log(communities[0].length);

        for(var i = 0 ; i < communities[0].length;i++){
            for(var j = 0 ; j<communities[0][i].length;j++){
                groupID[ communities[0][i][j] ] = i;
            }
        }

        var defaultGroupID = communities[0].length;
        var colors = [];

        names =[]
        for(var i = 0 ; i <namesData.length;i++){
            var ci      = namesData[i]['source'];
            names[ci]   =namesData[i]['destination'];
        }

        for(var m in f){

            var tmp         ={};
            tmp["id"]       =m;
            tmp["size"]     =f[m];
            tmp["name"]     =m+"."+names[m];
                    
            //determining color of nodes
            if(!(m in groupID)){
                groupID[m]=defaultGroupID;
            }    
            colors[m]=d3plus.color.random(groupID[m]);
            tmp["color"]    = colors[m];            

            sd.push(tmp);

        }   
                
        //subg = d3plus.network.subgraph(edges, "872",[ {"K":10}]);//for suome reason K is not working
         //       console.log(subg["nodes"]);
                


        resetVariables(0);

        var visualization = d3plus.viz()
            .container("#viz")
            .type("rings")
            //.type("rings") //hangs
            //.shape("donut") //hangs
            .data(sd) //this acts as an .attrs, sd will contain all the properties of the nodes
            .edges(edges)
            //.edges({"arrows": true})  //looks ugly
             //.edges({"label": "weight"}) //no effect on network
            .size("size")
            //.edges({"arrows":true});
            .id("id")
            //.attrs(nodeProperties) //extra list which contains extra attributes/properties
            //.focus("11")
            //.color(function(){return d3plus.color.random("1");})
            .color("color")
            .font("serif")
            .text("name")
            .title("Bangladesh Laws Network visualization")
            .focus("300")
            //.mouse({                
              //"move": false,                        // key will also take custom function
              //"click": function(_d,_viz){
                //console.log("hello");
              //} 
            //})   
            //.labels({"align":"right", "valign": "center"})
            .draw()

    })

})


function createVisualization(nid){
            var visualization = d3plus.viz()
            .container("#viz")
            .type("rings")
            //.type("rings") //hangs
            //.shape("donut") //hangs
            .data(sd) //this acts as an .attrs, sd will contain all the properties of the nodes
            .edges(edges)
            //.edges({"arrows": true})  //looks ugly
             //.edges({"label": "weight"}) //no effect on network
            .size("size")
            //.edges({"arrows":true});
            .id("id")
            //.attrs(nodeProperties) //extra list which contains extra attributes/properties
            //.focus("11")
            //.color(function(){return d3plus.color.random("1");})
            .color("color")
            .font("serif")
            .text("name")
            .title("Bangladesh Laws Network visualization")
            .focus(nid)
            //.mouse({                
              //"move": false,                        // key will also take custom function
              //"click": function(_d,_viz){
                //console.log("hello");
              //} 
            //})   
            //.labels({"align":"right", "valign": "center"})
            .draw()
}







