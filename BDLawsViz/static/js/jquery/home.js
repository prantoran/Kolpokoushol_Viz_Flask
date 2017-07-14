
console.log("en home.js");
$(document).ready(function() {
    console.log("document.cookie: ");
    console.log(document.cookie);

    var p = document.getElementById("homeusernametitle");
    p.innerHTML = "Welcome, " + getCookie("bdlawuser") + "!";



    $('#logoutButton').click(function() {
        removeCookie("bdlawuser");
        removeCookie("username");
        deleteAllCookies();

        window.location='logout';
    });

});
