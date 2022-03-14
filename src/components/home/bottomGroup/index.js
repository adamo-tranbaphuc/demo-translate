import React, {useEffect, useRef} from "react";
import {TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import LottieView from 'lottie-react-native';
import styles from "./style";
import {useNavigation} from "@react-navigation/native";

const BottomGroup = React.memo(({onPressRecord, isRecording}) => {

    const iconMic = useRef();

    const navigation = useNavigation();

    useEffect(() => {
        iconMic.current.play(69, 69);
    }, [])

    useEffect(() => {
        if (isRecording) {
            iconMic.current.play(0, 69);
        } else {
            iconMic.current.play(69, 69);
        }
    }, [isRecording])

    return (
        <View style={styles.container} pointerEvents={"box-none"}>
            <View style={styles.viewRound}/>

            <View style={styles.viewBtnGroup}>
                <TouchableOpacity onPress={() => navigation.navigate("User")}>
                    <Icon name={"person"} style={styles.iconUserAndSetting}/>
                </TouchableOpacity>


                <TouchableOpacity onPress={onPressRecord}>
                    <LottieView ref={iconMic} speed={1.5}
                                source={require('../../../assets/lotties/mic.json')}
                                style={styles.iconMic}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
                    <Icon name={"options"} style={styles.iconUserAndSetting}/>
                </TouchableOpacity>
            </View>
        </View>
    );
});

export default BottomGroup;