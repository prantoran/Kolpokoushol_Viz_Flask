import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "html": {
        "overflow": "auto"
    },
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
        "outline": "none",
        "border": "none",
        "color": "#DCDCDC",
        "paddingTop": 15,
        "paddingRight": 32,
        "paddingBottom": 15,
        "paddingLeft": 32,
        "textAlign": "center",
        "textDecoration": "none",
        "fontSize": 16,
        "marginTop": "1%",
        "marginRight": "1%",
        "marginBottom": "1%",
        "marginLeft": "1%",
        "borderRadius": "5%"
    },
    "inputbuttons:hover": {
        "color": "white"
    },
    "success": {
        "backgroundColor": "#4CAF50"
    },
    "success:hover": {
        "backgroundColor": "#46a049"
    },
    "warning": {
        "backgroundColor": "#ff9800"
    },
    "warning:hover": {
        "background": "#e68a00"
    },
    "sT": {
        "outline": "none",
        "position": "relative",
        "left": "5%",
        "right": "5%",
        "borderRadius": "5%",
        "width": "100%",
        "display": "block"
    },
    "scrolldiv": {
        "height": "70%",
        "overflow": "auto",
        "marginBottom": "5%"
    },
    "viz": {
        "position": "absolute"
    },
    "::-webkit-scrollbar": {
        "width": 10,
        "opacity": 0.2
    },
    "::-webkit-scrollbar-track": {
        "WebkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.3)",
        "WebkitBorderRadius": 10,
        "borderRadius": 10,
        "opacity": 0.2
    },
    "::-webkit-scrollbar-thumb": {
        "WebkitBorderRadius": 10,
        "borderRadius": 10,
        "opacity": 0.2,
        "background": "rgba(112,112,112,0.7)",
        "WebkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.5)"
    },
    "::-webkit-scrollbar-thumb:window-inactive": {
        "background": "rgba(176,176,176,0.2)"
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