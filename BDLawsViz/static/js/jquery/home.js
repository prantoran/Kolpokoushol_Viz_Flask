
$(document).ready(function() {
    innerSVGHeight = ((2*window.innerHeight)/3);
    innerSVGWidth = ((4*window.innerWidth)/9);

    console.log("innerSVGHeight:" + innerSVGHeight);
    var p = document.getElementById("homeusernametitle");
    p.innerHTML = "Welcome, " + getCookie("bdlawuser") + "!";
});
