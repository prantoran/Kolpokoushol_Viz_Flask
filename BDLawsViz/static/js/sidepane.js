/* Set the width of the side navigation to 250px */
function openNav() {
	document.getElementById("leftBar").style.width = "0px";
    document.getElementById("mySidenav").style.width = "28%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
	document.getElementById("leftBar").style.width = "210px";
    document.getElementById("mySidenav").style.width = "0";
}

function openMySearchBar() {
	document.getElementById("leftBar").style.width = "0px";
    document.getElementById("mySearchBar").style.width = "28%";
}

function closeMySearchBar() {
	document.getElementById("leftBar").style.width = "210px";
    document.getElementById("mySearchBar").style.width = "0";
}

function spreadMySearchBar() {
	var p = document.getElementById('shrinkButton');
	p.style="visibility:visible;";
	p = document.getElementById('spreadButton');
	p.style="visibility:hidden;";
	p = document.getElementById('mySearchBar');
	p.style="width:100%;";
}


function shrinkMySearchBar(){
	var p = document.getElementById('shrinkButton');
	p.style="visibility:hidden;";
	p = document.getElementById('spreadButton');
	p.style="visibility:visible;";	
	p = document.getElementById('mySearchBar');
	p.style="width:28%;";
}

function clearSearch(){
	var p = document.getElementById('queryOutputBlock');
	p.innerHTML = "";
	p = document.getElementById('sT');
	p.value="";
}