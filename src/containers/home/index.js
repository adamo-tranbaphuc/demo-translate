import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, StatusBar, Text, View} from "react-native";
import BottomGroup from "../../components/home/bottomGroup";
import styles from "./style";
import ResultTranslate from "../../components/home/resultTranslate";
import {MainLanguageContext} from "../../../App";
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    RecordBackType
} from "react-native-audio-recorder-player";
import {
    recognizeRecordGoogleGroup,
    recognizeRecordGoogleSingle,
    recognizeRecordGoogleTopGroup,
    textToSpeech,
    translateWord
} from "../../services/api";
import {LANGUAGES, METHOD_NAME} from "../../utils/consts/languages";
import Header from "../../components/home/header";
import LottieView from "lottie-react-native";
import Sound from "react-native-sound";

const audioSet: AudioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
    AudioSamplingRateAndroid: 16000,
    AVSampleRateKeyIOS: 16000,
};

const Home = () => {

    const {mainLanguage, method, gender, timeCut, sensitivity} = useContext(MainLanguageContext);
    const refLanguageTranslate = useRef([LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase())]);
    const [languageTranslateResult, setLanguageTranslateResult] = useState([[], []]);
    const refResult = useRef([[], []]);
    const [isRecording, setIsRecording] = useState(false);
    const [isAppSpeaking, setIsAppSpeaking] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const refNumOfLanguage = useRef(2);
    const audioRecorderPlayer: AudioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
    const refHeader = useRef();

    const refFlagRecord = useRef({timeStart: 0, haveWords: false});

    useEffect(() => {
        let setup = async () => {
            audioRecorderPlayer.removeRecordBackListener();

            await audioRecorderPlayer.setSubscriptionDuration(0.1);


            audioRecorderPlayer.addRecordBackListener(async (e: RecordBackType) => {
                if (e.currentMetering > -sensitivity) {
                    refFlagRecord.current.haveWords = true;
                    refFlagRecord.current.timeStart = new Date().getTime();
                } else {
                    if (new Date().getTime() - refFlagRecord.current.timeStart > timeCut && refFlagRecord.current.haveWords) {
                        let result = await onStopRecord();
                        recognize(result);
                        onStartRecord();
                    } else {
                        if (new Date().getTime() - refFlagRecord.current.timeStart > 4000) {
                            await onStopRecord();
                            onStartRecord();
                        }
                    }
                }
            });
        }

        setup()
    }, [timeCut, sensitivity, gender])

    useEffect(() => {
        refLanguageTranslate.current[0] = LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase());
        setLanguageTranslateResult([[], []]);
        refResult.current = [[], []];
    }, [mainLanguage])

    const onPressRecord = async () => {
        setIsRecording(!isRecording);
        if (isRecording) {
            // setShowLoading(true)
            let result = await onStopRecord();
            // await recognize(result);
        } else {
            onStartRecord();
        }
    }

    const onStartRecord = async () => {
        // const dirs = RNFetchBlob.fs.dirs;
        // const path = Platform.select({
        //     ios: 'hello.m4a',
        //     android: `${dirs.CacheDir}/sound.mp3`,
        // });

        //? Custom path
        // const uri = await audioRecorderPlayer.startRecorder(
        //   path,
        //   audioSet,
        // );
        // await audioRecorderPlayer.setSubscriptionDuration(0.1);
        //? Default path
        refFlagRecord.current.timeStart = new Date().getTime();
        refFlagRecord.current.haveWords = false;

        await audioRecorderPlayer.startRecorder(
            undefined,
            audioSet,
            true
        );

        // audioRecorderPlayer.addRecordBackListener(async (e: RecordBackType) => {
        //     if (e.currentMetering > -20) {
        //         refFlagRecord.current.haveWords = true;
        //         refFlagRecord.current.timeStart = new Date().getTime();
        //     } else {
        //         if (new Date().getTime() - refFlagRecord.current.timeStart > 1500 && refFlagRecord.current.haveWords) {
        //             cutWords();
        //             onStartRecord();
        //         } else {
        //             if (new Date().getTime() - refFlagRecord.current.timeStart > 3000) {
        //                 await onStopRecord();
        //                 onStartRecord();
        //             }
        //         }
        //     }
        // });
    }

    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        // audioRecorderPlayer.removeRecordBackListener();
        return result;
    }

    const recognize = useCallback(async (filePath) => {
        if (refLanguageTranslate.current.length < refNumOfLanguage.current) {
            setShowLoading(true);
            //phat hien tat ca
            let resultRecognize = await onRecognize(filePath, LANGUAGES)
            console.log(resultRecognize)
            let resultLanguage = recognizeResult(resultRecognize, LANGUAGES)

            if (resultLanguage === undefined) return;

            if (resultLanguage === refLanguageTranslate.current[0]) {
                if (refResult.current[0].length === 3)
                    refResult.current[0].shift();
                setLanguageTranslateResult([[...refResult.current[0], resultRecognize.transcript], []]);
                setShowLoading(false);
                return;
            }

            if (resultLanguage !== refLanguageTranslate.current[0]) {
                refLanguageTranslate.current = refLanguageTranslate.current.concat(resultLanguage);
            }

            console.log("resultLanguage")
            console.log(resultLanguage)
            await translate(resultRecognize, resultLanguage);
            setShowLoading(false)
        } else {
            // phat hien tu 2 ngon ngu hien tai
            let resultRecognize = await onRecognize(filePath, refLanguageTranslate.current)
            let resultLanguage = recognizeResult(resultRecognize, refLanguageTranslate.current)
            if (resultLanguage === undefined) return;

            await translate(resultRecognize, resultLanguage)
        }
    }, [method, gender, languageTranslateResult])

    const onRecognize = async (filePath, sourceLanguage) => {
        switch (method.name) {
            case METHOD_NAME.GOOGLE_GROUP: {
                return await recognizeRecordGoogleGroup(filePath, sourceLanguage);
            }
            case METHOD_NAME.GOOGLE_SINGLE: {
                return await recognizeRecordGoogleSingle(filePath, sourceLanguage);
            }
            case METHOD_NAME.GOOGLE_TOP_GROUP: {
                return await recognizeRecordGoogleTopGroup(filePath, sourceLanguage);
            }
        }
    }

    const convertTextToSpeech = async (resultTranslates, sourceLanguage) => {
        let languageNeedSpeak = sourceLanguage === refLanguageTranslate.current[0] ? refLanguageTranslate.current[1].code : refLanguageTranslate.current[0].code;
        let textNeedSpeak = sourceLanguage === refLanguageTranslate.current[0] ? resultTranslates[1] : resultTranslates[0];
        let path = await textToSpeech(textNeedSpeak, languageNeedSpeak, gender);

        setIsAppSpeaking(true);
        if (refFlagRecord.current.haveWords) {
            let result = await onStopRecord();
            recognize(result);
        } else {
            await onStopRecord();
        }

        const sound = new Sound(path, '', () => sound.play(() => {
            onStartRecord();
            setIsAppSpeaking(false);
        }));
    }

    const recognizeResult = useCallback((resultRecognize, sourceLanguage) => {
        if (resultRecognize.confidence === 0) {
            // setShowLoading(false);
            // setLanguageTranslateResult(["Error: Language not found"])
            return undefined;
        }

        let resultLanguage = sourceLanguage.find(language => language.code.toLowerCase() === resultRecognize.languageCode.toLowerCase());

        if (!resultLanguage) {
            // setShowLoading(false);
            // setLanguageTranslateResult(["Error: Unsupported language"])
            return undefined;
        }

        return resultLanguage;
    }, [])

    const translate = useCallback(async (resultRecognize, sourceLanguage) => {
        console.log(languageTranslateResult)
        let resultTranslates = await translateWord(resultRecognize.transcript, sourceLanguage.languageCode, refLanguageTranslate.current)
        // setShowLoading(false);
        let resultWithIndex = resultTranslates.map((resultWord, index) => {
            if (refResult.current[index].length === 3)
                refResult.current[index].shift();
            return [...refResult.current[index], resultWord];
        })

        refResult.current = [...resultWithIndex];
        setLanguageTranslateResult([...resultWithIndex]);
        refResult.current = [...resultWithIndex];

        await convertTextToSpeech(resultTranslates, sourceLanguage);
    }, [gender, languageTranslateResult])

    const renderResult = useCallback((itemResults, index) => {
        return (
            <ResultTranslate key={index.toString()} textResult={itemResults}
                             showLine={index === 0 && languageTranslateResult[1].length > 0}/>
        )
    }, [languageTranslateResult])

    const resetLanguage = useCallback(() => {
        refLanguageTranslate.current = refLanguageTranslate.current.filter((_, index) => {
            return index === 0;
        })
        setLanguageTranslateResult([[], []]);
        refResult.current = [[], []];
    }, [])

    const setManualSecondLanguage = (secondLanguage) => {

        if (secondLanguage) {
            if (refLanguageTranslate.current[1]) {
                if (secondLanguage !== refLanguageTranslate.current[1].value) {
                    refLanguageTranslate.current = [refLanguageTranslate.current[0], LANGUAGES.find(language => language.code.toLowerCase() === secondLanguage.toLowerCase())];
                    setLanguageTranslateResult([[], []]);
                    refResult.current = [[], []];
                }
            } else {
                refLanguageTranslate.current = [refLanguageTranslate.current[0], LANGUAGES.find(language => language.code.toLowerCase() === secondLanguage.toLowerCase())];
                setLanguageTranslateResult([[], []]);
                refResult.current = [[], []];
            }

        } else {
            if (refLanguageTranslate.current[1])
                resetLanguage()
        }
    }

    return (
        <Pressable style={styles.container} onPress={() => {
            refHeader.current.closeDropdownPicker()
        }}>
            <StatusBar
                animated={true}
                barStyle={'dark-content'}
                backgroundColor={'#fff'}
                translucent/>

            <Header resetLanguage={resetLanguage} mainLanguage={refLanguageTranslate.current[0]}
                    addLanguage={refLanguageTranslate.current[1]} setManualSecondLanguage={setManualSecondLanguage}
                    ref={refHeader}/>

                <ScrollView contentContainerStyle={styles.scrollViewResults}>
                    <View onStartShouldSetResponder={() => true}>
                        {languageTranslateResult.map(renderResult)}

                        {showLoading && (<View style={{alignItems: 'center'}}>
                            <Text style={{
                                color: "#565656", marginHorizontal: 40, textAlign: 'center', lineHeight: 32,
                                fontSize: 22,
                            }}>The waiting time will be longer while searching for the language</Text>
                            <LottieView autoPlay loop
                                        source={require('../../assets/lotties/loading.json')}
                                        style={styles.iconLoad}/>
                        </View>)}
                    </View>
                </ScrollView>


            <BottomGroup onPressRecord={onPressRecord} isRecording={isRecording} isAppSpeaking={isAppSpeaking}/>
        </Pressable>
    )

}

export default Home;
