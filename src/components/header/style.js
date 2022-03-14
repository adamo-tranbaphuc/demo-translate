import React from 'react';
import {StyleSheet,} from 'react-native';
import {SHADOW_3} from "../../utils/consts/shadows";
import {SIZES} from "../../utils/consts";


const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingTop: SIZES.HEIGHT_STATUSBAR,
        ...SHADOW_3
    },
    headerView: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 6
    },
    txtHeader: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
        color: "#00BCD4",
    },
    button: {
        width: 38,
        height: 38,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    }

});

export default styles;
