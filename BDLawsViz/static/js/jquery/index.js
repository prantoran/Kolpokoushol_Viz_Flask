


$(document).ready(function() {
    function setIndexItems() {
        var p = document.getElementById("indexNavItems");
        var h = "";
        if(getCookie("bdlawuser") == "") {
            h += '<li role="presentation" class="active"><a href="#">Home</a></li>';
            h += '<li role="presentation"><a href="showsignin">Sign In</a></li>';
            h += '<li role="presentation"><a href="showsignup" onclick="window.location="logout;">Sign Up</a></li>';
        }
        else {
            h += '<li role="presentation" class="active"><a href="#">Home</a></li>';
            h += '<li role="presentation"><a href="logout">Log Out</a></li>';
        }
        p.innerHTML = h;
    }

    setIndexItems();
});
