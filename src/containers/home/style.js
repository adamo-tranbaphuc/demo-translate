import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import {SHADOW_2, SHADOW_3, SHADOW_5} from "../../utils/consts/shadows";


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    txtNameApp: {
        fontSize: 30,
        color: '#2771c4',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginVertical: 12
    },
    viewMain: {
        marginHorizontal: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
        flex: 1,
        padding: 16,
        paddingBottom: 42,
        marginBottom: 50,
        justifyContent: 'flex-end',
        ...SHADOW_2
    },
    txtInput: {
        fontSize: 18,
        height:'45%',
        flex: 1,
        textAlignVertical: 'top',
        color:'#000'
    },
    txtResult: {
        fontSize: 18,
        height:'45%',
        flex: 1,
        width:'100%',
        textAlignVertical: 'top',
        color:'#000'
    },
    viewStroke: {
        width: '50%',
        backgroundColor: '#2771c4',
        height: 0.5,
        marginVertical: 12,
    },
    btnMic: {
        position: 'absolute',
        bottom: -30,
        backgroundColor: '#fff',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        alignSelf: 'center',
        ...SHADOW_5
    },
    iconMic: {
        fontSize: 30,
        color: '#2771c4'
    },
    txtHoldToRecord: {
        fontSize: 20,
        color: '#2771c4',
        alignSelf: 'center',
        marginBottom: 16
    }

});

export default styles;
