import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    Text, Pressable, TextInput
} from 'react-native';
import styles from './style';
import {postTranslate} from "../../services/api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Voice from '@react-native-voice/voice';
import * as Animatable from 'react-native-animatable';
import debounce from "lodash.debounce";

const PressableAnimatable = Animatable.createAnimatableComponent(Pressable);

const Home = () => {

    const [recordStatus, setRecordStatus] = useState(false);

    const refResultText = useRef();
    const refInputText = useRef("");
    const refInput = useRef();

    const delayedQuery = debounce(valueInput => translate(valueInput), 1000);
    const onChangeText = useCallback((text) => {
        refInputText.current = text;
        delayedQuery(refInputText.current);
    }, []);

    useEffect(() => {
        //Setting callbacks for the process status
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            //destroy the process after switching the screen
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechEnd = (e) => {
        //Invoked when SpeechRecognizer stops recognition
        console.log('onSpeechEnd: ', e);
        setRecordStatus(false);
    };

    const onSpeechResults = (e) => {
        //Invoked when SpeechRecognizer is finished recognizing
        console.log('onSpeechResults: ', e);
        if (e.value.length > 0) {
            refInput.current.setNativeProps({text: e.value[0]})
            refInputText.current =e.value[0];
            translate(refInputText.current)
        }
    };


    const startRecognizing = async () => {
        //Starts listening for speech for a specific locale
        try {
            await Voice.start('vi-VI');
            setRecordStatus(true);
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    const stopRecognizing = async () => {
        //Stops listening for speech
        try {
            await Voice.stop();
            setRecordStatus(false);
        } catch (e) {
            //eslint-disable-next-line
            console.error(e);
        }
    };

    const translate = useCallback(async (value) => {
        let resultTranslate = await postTranslate(value, 'vi', 'en')
        refResultText.current.setNativeProps({text: resultTranslate})
    }, [])

    return (
        <View style={styles.container}>

            <Text style={styles.txtNameApp}>Translation app</Text>

            <View style={styles.viewMain}>
                {/*header*/}


                <TextInput
                    ref={refInput}
                    placeholder={"Enter words to translate"}
                    style={styles.txtInput}
                    returnKeyType={'done'}
                    onChangeText={onChangeText}
                />
                <View style={styles.viewStroke}/>
                <TextInput
                    placeholder={"Result"}
                    ref={refResultText}
                    editable={false}
                    style={styles.txtResult}
                />

                <PressableAnimatable animation={recordStatus ? "pulse" : ""} iterationCount="infinite"
                                     style={styles.btnMic} onPress={recordStatus ? stopRecognizing : startRecognizing}>
                    <Icon name={recordStatus?"record-circle":"microphone"} style={styles.iconMic}/>
                </PressableAnimatable>


            </View>

            <Text style={styles.txtHoldToRecord}>Press and say</Text>

        </View>
    );
};

export default Home;
