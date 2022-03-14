import React from 'react';
import {Dimensions, StyleSheet,} from 'react-native';
import {SIZES} from "../../utils/consts";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewResults: {
        height: (Dimensions.get("screen").height) * 0.86,
        paddingBottom: (Dimensions.get("screen").height) * 0.08,
        alignItems:'center'
    },
    iconLoad: {
        width: '50%',
        height: 80,
    }

});

export default styles;
