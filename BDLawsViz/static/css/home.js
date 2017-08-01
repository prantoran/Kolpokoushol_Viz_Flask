import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "homeusernametitle": {
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
    "homeusernametitle a:hover": {
        "color": "#f1f1f1"
    },
    "offcanvas a:focus": {
        "color": "#f1f1f1"
    }
});