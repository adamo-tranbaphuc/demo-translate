import React from 'react';
import {Dimensions, StyleSheet,} from 'react-native';
import {SIZES} from "../../../utils/consts";


const styles = StyleSheet.create({
    container: {
        width:'100%',
        marginTop:SIZES.HEIGHT_STATUSBAR,
        paddingHorizontal:'6%',
        paddingVertical:22,
        flexDirection:'row',
        justifyContent:'space-around'
    },
    textLanguage:{
        color:'#424242',
        fontWeight:'bold',
        fontSize:22,
        flex:3,
    },
    iconReload:{
        fontSize:34,
        color:"#00BCD4",
        marginHorizontal:8
    }
});

export default styles;
