import React from 'react';
import {Dimensions, StyleSheet,} from 'react-native';


const styles = StyleSheet.create({
    container: {
        position:'absolute',
        width:'100%',
        alignSelf:'center',
        flexDirection: 'column',
        alignItems: 'center',
        bottom: '-78%',
        // backgroundColor:'red'
    },
    viewRound: {
        width: Dimensions.get("screen").height,
        height: Dimensions.get("screen").height,
        backgroundColor: '#f5f5f5',
        borderRadius: 1000
    },
    viewBtnGroup: {
        flexDirection: 'row',
        width: '100%',
        justifyContent:'space-around',
        position: "absolute",
        top: 0,
        alignItems:'flex-end'
    },
    iconMic:{
        width:160,
        height:160,
        alignSelf:'flex-start'
    },
    iconUserAndSetting: {
        fontSize: 36,
        color: "#7e7e7e"
    }
});

export default styles;
