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
import {azureDetectLanguage, recognizeRecord, recognizeRecordAzure, translateRecordText} from "../../services/api";
import {LANGUAGES, METHOD_NAME} from "../../utils/consts/languages";
import Header from "../../components/home/header";
import AudioRecord from 'react-native-audio-record';
import {Buffer} from "buffer";

const header = Buffer.from([82, 73, 70, 70, 248, 167])
const Home = () => {

    const {mainLanguage, method} = useContext(MainLanguageContext);
    const refLanguageTranslate = useRef([LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase())]);
    const [languageTranslateResult, setLanguageTranslateResult] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const refNumOfLanguage = useRef(2);
    const audioRecorderPlayer: AudioRecorderPlayer = new AudioRecorderPlayer();

    useEffect(() => {
        AudioRecord.init({
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: 'audio.wav' // default 'audio.wav'
        });
        AudioRecord.on('data', data => {
            // const chunks = [header]
            const chunk = Buffer.from(data, 'base64');
            // chunks.push(chunk)
            // const pcm = wav.decode(Buffer.concat(chunks)).channelData

            // console.log('data', data);
            // console.log('chunk size', chunk);
            // console.log('pcm', pcm);
        });
    }, [])

    useEffect(() => {
        refLanguageTranslate.current[0] = LANGUAGES.find(language => language.code.toLowerCase() === mainLanguage.toLowerCase());
        setLanguageTranslateResult([])
    }, [mainLanguage])

    const onPressRecord = async () => {
        if (isRecording) {
            setShowLoading(true)
            await stopRecord();
        } else {
            await startRecord();
        }

        setIsRecording(!isRecording);
    }

    const startRecord = async () => {
        switch (method.name) {
            case METHOD_NAME.GOOGLE:
            case METHOD_NAME.GOOGLE_CUSTOM: {
                onStartRecordGoogle();
                break;
            }
            case METHOD_NAME.AZURE: {
                onStartRecordAzure();
                break;
            }
        }
    }

    const stopRecord = async () => {
        switch (method.name) {
            case METHOD_NAME.GOOGLE: {
                onStopRecordGoogle();
                break;
            }
            case METHOD_NAME.GOOGLE_CUSTOM: {
                onStopRecordGoogle();
                break;
            }
            case METHOD_NAME.AZURE: {
                onStopRecordAzure()
            }
        }
    }

    const onStartRecordGoogle = useCallback(async () => {
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

    const onStopRecordGoogle = useCallback(async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();

        await recognize(result);
    }, [method]);

    const onStartRecordAzure = useCallback(async () => {
        AudioRecord.start();
    }, []);

    const onStopRecordAzure = useCallback(async () => {
        let audioFile = await AudioRecord.stop();
        await recognize(audioFile)
    }, [method]);

    const recognize = useCallback(async (filePath) => {

        if (refLanguageTranslate.current.length < refNumOfLanguage.current) {
            //phat hien tat ca
            let resultRecognize = await onRecognize(filePath, LANGUAGES)
            // let resultLanguage = recognizeResult(resultRecognize,LANGUAGES)
            //
            //
            // // if (resultLanguage === refLanguageTranslate.current[0]) {
            // //     setShowLoading(false);
            // //     setLanguageTranslateResult([resultRecognize.transcript]);
            // //     return;
            // // }
            //
            // if (resultLanguage !== refLanguageTranslate.current[0]) {
            //     refLanguageTranslate.current = refLanguageTranslate.current.concat(resultLanguage);
            // }
            //
            // await translate(resultRecognize, resultLanguage);
        } else {
            // phat hien tu 2 ngon ngu hien tai
            let resultRecognize = await onRecognize(filePath, refLanguageTranslate.current)
            let resultLanguage =  recognizeResult(resultRecognize,refLanguageTranslate.current)

            await translate(resultRecognize, resultLanguage)
        }
    }, [method])

    const onRecognize = async (filePath, sourceLanguage) => {
        switch (method.name) {
            case METHOD_NAME.GOOGLE: {
                return undefined;
            }
            case METHOD_NAME.GOOGLE_CUSTOM: {
                return undefined;
            }
            case METHOD_NAME.AZURE: {
                return await recognizeRecordAzure(filePath, sourceLanguage);
            }
        }
    }

    const recognizeResult = useCallback((resultRecognize, sourceLanguage) => {
        if (resultRecognize.confidence === 0) {
            setShowLoading(false);
            setLanguageTranslateResult(["Lỗi: Không tìm thấy ngôn ngữ"])
            return;
        }

        let resultLanguage = sourceLanguage.find(language => language.code.toLowerCase() === resultRecognize.languageCode.toLowerCase());

        if (!resultLanguage) {
            setShowLoading(false);
            setLanguageTranslateResult(["Lỗi: Ngôn ngữ không được hỗ trợ"])
        }

        return resultLanguage;
    }, [])

    const translate = useCallback(async (resultRecognize, sourceLanguage) => {
        let resultTranslates = await translateRecordText(resultRecognize.transcript, sourceLanguage.languageCode, refLanguageTranslate.current)
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

    console.log(refLanguageTranslate)

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