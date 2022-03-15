import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ScrollView, StatusBar, View} from "react-native";
import BottomGroup from "../../components/home/bottomGroup";
import styles from "./style";
import ResultTranslate from "../../components/home/resultTranslate";
import {MainLanguageContext} from "../../../App";
import LottieView from "lottie-react-native";
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
    translateWord
} from "../../services/api";
import {LANGUAGES, METHOD_NAME} from "../../utils/consts/languages";
import Header from "../../components/home/header";

const Home = () => {

    const {mainLanguage, method} = useContext(MainLanguageContext);
    const refLanguageTranslate = useRef([LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase())]);
    const [languageTranslateResult, setLanguageTranslateResult] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const refNumOfLanguage = useRef(2);
    const audioRecorderPlayer: AudioRecorderPlayer = new AudioRecorderPlayer();

    useEffect(() => {
        refLanguageTranslate.current[0] = LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase());
        setLanguageTranslateResult([])
    }, [mainLanguage])

    const onPressRecord = async () => {
        setIsRecording(!isRecording);
        if (isRecording) {
            setShowLoading(true)
            let result = await onStopRecord();
            await recognize(result);
        } else {
            onStartRecord();
        }
    }

    const onStartRecord = useCallback(async () => {
        const audioSet: AudioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
            AudioSamplingRateAndroid: 16000,
            AVSampleRateKeyIOS: 16000
        };
        console.log(audioSet)
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

        //? Default path
        const uri = await audioRecorderPlayer.startRecorder(
            undefined,
            audioSet,
        );

        audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
            console.log('record-back', e);
        });
    }, []);

    const onStopRecord = useCallback(async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        return result;
    }, []);

    const recognize = useCallback(async (filePath) => {

        if (refLanguageTranslate.current.length < refNumOfLanguage.current) {
            //phat hien tat ca
            let resultRecognize = await onRecognize(filePath, LANGUAGES)
            console.log(resultRecognize)
            let resultLanguage = recognizeResult(resultRecognize, LANGUAGES)

            if(resultLanguage===undefined) return;

            if (resultLanguage === refLanguageTranslate.current[0]) {
                setShowLoading(false);
                setLanguageTranslateResult([resultRecognize.transcript]);
                return;
            }

            if (resultLanguage !== refLanguageTranslate.current[0]) {
                refLanguageTranslate.current = refLanguageTranslate.current.concat(resultLanguage);
            }
            console.log("resultLanguage")
            console.log(resultLanguage)
            await translate(resultRecognize, resultLanguage);
        } else {
            // phat hien tu 2 ngon ngu hien tai
            let resultRecognize = await onRecognize(filePath, refLanguageTranslate.current)
            let resultLanguage = recognizeResult(resultRecognize, refLanguageTranslate.current)
            if(resultLanguage===undefined) return;

            await translate(resultRecognize, resultLanguage)
        }
    }, [method])

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

    const recognizeResult = useCallback((resultRecognize, sourceLanguage) => {
        if (resultRecognize.confidence === 0) {
            setShowLoading(false);
            setLanguageTranslateResult(["Error: Language not found"])
            return undefined;
        }

        let resultLanguage = sourceLanguage.find(language => language.code.toLowerCase() === resultRecognize.languageCode.toLowerCase());

        if (!resultLanguage) {
            setShowLoading(false);
            setLanguageTranslateResult(["Error: Unsupported language"])
            return undefined;
        }

        return resultLanguage;
    }, [])

    const translate = useCallback(async (resultRecognize, sourceLanguage) => {
        let resultTranslates = await translateWord(resultRecognize.transcript, sourceLanguage.languageCode, refLanguageTranslate.current)
        setShowLoading(false);
        setLanguageTranslateResult(resultTranslates)
    }, [])

    const renderResult = useCallback((item, index) => {
        return (
            <ResultTranslate key={item + index} textResult={item}
                             showLine={index !== languageTranslateResult.length - 1}/>
        )
    }, [languageTranslateResult])

    const resetLanguage = useCallback(() => {
        refLanguageTranslate.current = refLanguageTranslate.current.filter((_, index) => {
            return index === 0;
        })
        setLanguageTranslateResult([])
    }, [])


    return (
        <View style={styles.container}>
            <StatusBar
                animated={true}
                barStyle={'dark-content'}
                backgroundColor={'#fff'}
                translucent/>

            <Header resetLanguage={resetLanguage} mainLanguage={refLanguageTranslate.current[0]}
                    addLanguage={refLanguageTranslate.current[1]}/>

            <ScrollView contentContainerStyle={styles.scrollViewResults}>

                {languageTranslateResult.map(renderResult)}

                {showLoading && <LottieView autoPlay loop
                                            source={require('../../assets/lotties/loading.json')}
                                            style={styles.iconLoad}/>}
            </ScrollView>

            <BottomGroup onPressRecord={onPressRecord} isRecording={isRecording}/>
        </View>
    )

}

export default Home;