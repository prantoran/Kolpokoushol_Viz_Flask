
function processSearchButton(){

	var p = document.getElementsByName('searchText')[0].value;
	console.log(p);
}

function clearVisualization(){
	var p = document.getElementById('viz');
	p.innerHTML = "";

}

function reloadVisualization(){
	document.getElementById("leftBar").style.width = "25%";
	location.reload();

}
