import React from 'react';
import {Dimensions, StyleSheet,} from 'react-native';
import {SIZES} from "../../../utils/consts";
import {SHADOW_3} from "../../../utils/consts/shadows";


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
    },
    pickerStyle: {

        zIndex: 2,
        borderRadius: 8,
        borderWidth: 0,
        height: 40,
        backgroundColor: "#fff",
    },
    dropdownContainerStyles: {
        zIndex: 2,

        borderRadius: 8,
        borderWidth: 0,
        backgroundColor: "#fff",
        ...SHADOW_3
    },
    dropdownContainer: {
        width: "45%",
        flex: 3,
        height: 40,
    },
    txtLabel: {
        fontSize: 18,
        color: "#8c0b0b",
        textAlign: 'right'
    },
    txtDropdownStyle: {
        fontSize: 18,
        color: "#7c7c7c"
    }
});

export default styles;
