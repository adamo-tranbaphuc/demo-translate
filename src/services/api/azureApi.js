import 'react-native-get-random-values';
import {
    AudioConfig,
    AutoDetectSourceLanguageConfig,
    AutoDetectSourceLanguageResult,
    SpeechConfig,
    SpeechRecognizer
} from 'microsoft-cognitiveservices-speech-sdk';
import {API_KEY_AZURE, REGION_AZURE} from "../../utils/consts";
import {getBufferFromUri, splitArrayToSubArray} from "../../utils/helpers";

const SPEECH_CONFIG = SpeechConfig.fromSubscription(API_KEY_AZURE, REGION_AZURE);

export async function azureDetectLanguage(audioConfig, sourceLanguageArray) {
    console.log(sourceLanguageArray)
    let autoDetectSourceLanguageConfig = await AutoDetectSourceLanguageConfig.fromLanguages(sourceLanguageArray);
    console.log(autoDetectSourceLanguageConfig)
    let speechRecognizer = await SpeechRecognizer.FromConfig(SPEECH_CONFIG, autoDetectSourceLanguageConfig, audioConfig);
    speechRecognizer.privProperties.privValues[0] = autoDetectSourceLanguageConfig.privProperties.privValues[0].substring(0, 5);
    speechRecognizer.privProperties.privValues[5] = autoDetectSourceLanguageConfig.privProperties.privValues[0];
    console.log(speechRecognizer)
    return new Promise((resolve) => {
        speechRecognizer.recognizeOnceAsync((result: SpeechRecognitionResult) => {
            let languageDetectionResult = AutoDetectSourceLanguageResult.fromResult(result);
            resolve(languageDetectionResult.language)
        }, {})
    });
}

async function recognizeBatch(audioConfig, sourceLanguageArray) {
    if (sourceLanguageArray.length > 1) {
        let sourceLanguageSubArray = splitArrayToSubArray(sourceLanguageArray, 4);

        let requests = sourceLanguageSubArray.map(async (item) => {
            return await azureDetectLanguage(audioConfig, item)
        })

        return Promise.all(requests)
            .then(response => {
                console.log(response)
                // return recognizeBatch(audioConfig, response);
            })
        // requests[0].then(response => {
        //     console.log(response)
        //     requests[1].then(response => {
        //         console.log(response)
        //         requests[2].then(response => {
        //             console.log(response)
        //         })
        //     })
        // })

    } else {
        console.log("ket qua")
        console.log(sourceLanguageArray)
    }
}


export async function recognizeRecordAzure(filePath, sourceLanguage) {

    const fileBuf = await getBufferFromUri(filePath);
    const audioConfig = AudioConfig.fromWavFileInput(fileBuf);

    let sourceLanguageArray = sourceLanguage.map((item) => item.code);

    await recognizeBatch(audioConfig, sourceLanguageArray);
}