import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "sidenav": {
        "height": "100%",
        "width": "0%",
        "position": "absolute",
        "zIndex": 1,
        "top": 0,
        "left": 0,
        "backgroundColor": "#111",
        "overflowX": "hidden",
        "paddingTop": 60,
        "transition": "0.5s",
        "opacity": 0.9
    },
    "sidenav a": {
        "paddingTop": 8,
        "paddingRight": 8,
        "paddingBottom": 8,
        "paddingLeft": 32,
        "textDecoration": "none",
        "fontSize": 25,
        "color": "#818181",
        "display": "block",
        "transition": "0.3s"
    },
    "sidenav a:hover": {
        "color": "#f1f1f1"
    },
    "offcanvas a:focus": {
        "color": "#f1f1f1"
    },
    "sidenav closebtn": {
        "position": "absolute",
        "top": 0,
        "right": 25,
        "fontSize": 36
    },
    "sidenav spreadbtn": {
        "position": "absolute",
        "top": 0,
        "left": 0,
        "fontSize": 36
    },
    "sidenav shrinkbtn": {
        "position": "absolute",
        "top": "0%",
        "left": "0%",
        "fontSize": 36,
        "visibility": "hidden"
    }
});