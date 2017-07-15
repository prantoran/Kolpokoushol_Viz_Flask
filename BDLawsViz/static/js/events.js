
const EVENT_NODE = 1;

function getEventID(p) {
    return "event" + p.toString();
}

function addEventToCookie(u, addTimeStampFlag) {
    eventID = getCookie("curevent");
    if(eventID == "") {
        eventID = 1;
    }
    else {
        eventID = parseInt(eventID) + 1;
    }
    setCookie("curevent", eventID, 7, allPaths);


    var d = new Date();
    startTime = getCookie("starttime");
    if(startTime == "") {
        startTime = d.getSeconds();
        setCookie("starttime", startTime, 7, allPaths);
    }
    else {
        startTime = parseInt(startTime) + 1;
    }

    key = getEventID(eventID);
    value = "";
    if(addTimeStampFlag) {
        console.log(d);
        value += "_" + (d.getSeconds() - startTime).toString();
    }
    setCookie(key,value,7,[,'logout','home'])
    console.log("updated cookies:");
    console.log(document.cookie);
}
