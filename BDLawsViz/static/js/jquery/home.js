
$(document).ready(function() {
    var p = document.getElementById("homeusernametitle");
    p.innerHTML = "Welcome, " + getCookie("bdlawuser") + "!";
});
