
var allPaths = ['home','','logout','index'];

function setCookie(cname, cvalue, exdays, cpath = []) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();

    var n = cpath.length;
    if(n == 0) {
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + cpath;
    }
    else {
        for(var i = 0 ; i < n ; i ++ ) {
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + cpath[i];
        }
    }
}


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function checkCookie() {
    var username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}

function removeCookie(cname) {
    document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    var n = allPaths.length;
    for(var i = 0; i < n; i ++ ) {
        document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'+allPaths[i]+';';

    }
}


function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        removeCookie(name);
    }
}

// returns javascript array of objects
function getAllEventCookies() {

}
