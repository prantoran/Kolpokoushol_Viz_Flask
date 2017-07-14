import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "body": {
        "position": "relative"
    },
    "footer a": {
        "position": "absolute",
        "bottom": "5%",
        "right": "5%",
        "paddingTop": 1,
        "paddingRight": 1,
        "paddingBottom": 1,
        "paddingLeft": 32,
        "textDecoration": "none",
        "fontSize": 10,
        "color": "#818181",
        "display": "block",
        "transition": "0.3s"
    },
    "footer a p": {
        "fontSize": 16
    },
    "inputbuttons": {
        "backgroundColor": "#4CAF50",
        "border": "none",
        "color": "white",
        "paddingTop": 15,
        "paddingRight": 32,
        "paddingBottom": 15,
        "paddingLeft": 32,
        "textAlign": "center",
        "textDecoration": "none",
        "display": "inline-block",
        "fontSize": 16,
        "marginTop": 4,
        "marginRight": 2,
        "marginBottom": 4,
        "marginLeft": 2,
        "cursor": "pointer",
        "borderRadius": "10%"
    },
    "inputbuttons:hover": {
        "opacity": 0.5
    },
    "sT": {
        "position": "relative",
        "left": "9%",
        "width": "100%"
    },
    "viz": {
        "transition": "margin-left .5s",
        "marginLeft": "0%",
        "width": "80%"
    },
    "options": {
        "float": "right"
    },
    "sidePaneButton": {
        "position": "relative",
        "marginTop": "5%",
        "left": "40%",
        "right": "0%"
    },
    "sidePaneClearButton": {
        "position": "relative",
        "marginTop": "5%",
        "left": "40%",
        "right": "0%"
    },
    "leftButtons": {
        "position": "relative"
    },
    "leftBar": {
        "height": "100%",
        "width": "20%",
        "position": "fixed",
        "zIndex": 1,
        "top": 0,
        "left": 0,
        "backgroundColor": "#111",
        "overflowX": "hidden",
        "paddingTop": 60,
        "transition": "0.5s"
    },
    "queryOutputBlock": {
        "color": "#818181"
    },
    "navbarexpandbutton img": {
        "width": "3%",
        "height": "6%",
        "position": "fixed",
        "bottom": "50%",
        "left": "1%"
    }
});