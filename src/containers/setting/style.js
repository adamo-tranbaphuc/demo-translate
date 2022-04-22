import React from 'react';
import {StyleSheet,} from 'react-native';
import {SHADOW_3} from "../../utils/consts/shadows";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewContent: {
        width: "100%",
    },
    viewInfor: {
        width: "100%",
        paddingHorizontal: '3%',
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical:16
    },
    title: {
        color: "#565656",
        fontSize: 18,
    },
    touchRadio: {
        paddingVertical: 4,
        flexDirection: 'row'
    },
    txtRadio: {
        marginLeft: 8,
        fontSize: 18,
        color: "#565656",
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
        flex: 1,
        height: 40
    },
    txtLabel: {
        fontSize: 18,
        color: "#7c7c7c",
        textAlign: 'right'
    },
    txtDropdownStyle: {
        fontSize: 18,
        color: "#7c7c7c",
    }
});

export default styles;
