import React, {useEffect, useRef} from "react";
import {TouchableOpacity, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import LottieView from 'lottie-react-native';
import styles from "./style";
import {useNavigation} from "@react-navigation/native";

const BottomGroup = React.memo(({onPressRecord, isRecording, isAppSpeaking}) => {

    const iconMic = useRef();

    const navigation = useNavigation();

    useEffect(() => {
        iconMic.current.play(69, 69);
    }, [])

    useEffect(() => {
        if(isAppSpeaking){
            iconMic.current.play(69, 69);
        }else
        if (isRecording) {
            iconMic.current.play(0, 69);
        } else {
            iconMic.current.play(69, 69);
        }
    }, [isRecording, isAppSpeaking])

    return (
        <View style={styles.container} pointerEvents={"box-none"}>
            <View style={styles.viewRound}/>

            <View style={styles.viewBtnGroup}>
                <TouchableOpacity onPress={() => navigation.navigate("User")}>
                    <Icon name={"person"} style={styles.iconUserAndSetting}/>
                </TouchableOpacity>


                <TouchableOpacity onPress={onPressRecord}>
                    <LottieView ref={iconMic} speed={1.5}
                                colorFilters={[
                                    {
                                        keypath: 'base',
                                        color: isAppSpeaking?"#90A4AE":(isRecording?'#F00000':"#00BCD4"),
                                    },
                                    {
                                        keypath: 'Base Layer 4',
                                        color: isAppSpeaking?"#90A4AE":(isRecording?'#F00000':"#B2EBF2"),
                                    },
                                    {
                                        keypath: 'Base Layer 3',
                                        color: isAppSpeaking?"#90A4AE":(isRecording?'#F00000':"#4DD0E1"),
                                    },
                                ]}
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
