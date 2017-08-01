import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "nodeRick": {
        "stroke": "#fff",
        "strokeWidth": 1.5
    },
    "linkRick": {
        "fill": "none",
        "stroke": "#bbb",
        "strokeWidth": 7
    },
    "svg_frame": {
        "border": "2px solid #bbb"
    },
    "inner_phrase": {
        "border": "1px solid #bbb",
        "marginTop": 1,
        "marginRight": 1,
        "marginBottom": 1,
        "marginLeft": 1
    },
    "highlight": {
        "backgroundColor": "yellow"
    }
});