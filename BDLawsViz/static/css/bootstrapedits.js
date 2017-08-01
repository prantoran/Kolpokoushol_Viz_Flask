import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "body modal-admin": {
        "width": 99 * vw,
        "height": 70 * vh
    },
    "modal-dialog": {},
    "modal-body": {},
    "modal-scrolldiv": {
        "height": 70 * vh,
        "overflowY": "auto"
    }
});