// import 'react-native-get-random-values';
// import {
//     AudioConfig,
//     AutoDetectSourceLanguageConfig,
//     AutoDetectSourceLanguageResult,
//     SpeechConfig,
//     SpeechRecognizer
// } from 'microsoft-cognitiveservices-speech-sdk';
// import {API_KEY_AZURE, REGION_AZURE} from "../../utils/consts";
// import {getBufferFromUri, splitArrayToSubArray} from "../../utils/helpers";
//
// const SPEECH_CONFIG = SpeechConfig.fromSubscription(API_KEY_AZURE, REGION_AZURE);
//
// export async function azureDetectLanguage(audioConfig, sourceLanguageArray) {
//
//     console.log(sourceLanguageArray)
//     let autoDetectSourceLanguageConfig = AutoDetectSourceLanguageConfig.fromLanguages(sourceLanguageArray);
//     console.log(autoDetectSourceLanguageConfig)
//
//     // let hjgh = SpeechRecognizer.properties
//     // console.log(hjgh)
//
//     let speechRecognizer = SpeechRecognizer.FromConfig(SPEECH_CONFIG, autoDetectSourceLanguageConfig, audioConfig)
//     console.log(speechRecognizer.privProperties.privValues)
//
//     // speechRecognizer.privProperties.privValues[0] = autoDetectSourceLanguageConfig.privProperties.privValues[0].substring(0, 5);
//     // speechRecognizer.privProperties.privValues[5] = autoDetectSourceLanguageConfig.privProperties.privValues[0];
//     // let params = JSON.parse(speechRecognizer.privReco.privSpeechContext.toJSON());
//     // params.languageId.languages=sourceLanguageArray;
//     // speechRecognizer.privReco.privSpeechContext = JSON.stringify(params);
//
//
//     return new Promise( (resolve) => {
//         speechRecognizer.recognizeOnceAsync((result: SpeechRecognitionResult) => {
//             let languageDetectionResult = AutoDetectSourceLanguageResult.fromResult(result);
//             console.log(languageDetectionResult)
//             speechRecognizer.
//             resolve(languageDetectionResult.language)
//         }, (e)=>{
//             console.log(e)})
//     });
// }
//
// async function recognizeBatch(audioConfig, sourceLanguageArray) {
//     if (sourceLanguageArray.length > 1) {
//         let sourceLanguageSubArray = splitArrayToSubArray(sourceLanguageArray, 4);
//
//         // let requests = sourceLanguageSubArray.map(async (item) => {
//         //     return await azureDetectLanguage(audioConfig, item)
//         // })
//
//         // return Promise.all(requests)
//         //     .then(response => {
//         //         console.log(response)
//         //         // return recognizeBatch(audioConfig, response);
//         //     })
//
//         return await azureDetectLanguage(audioConfig, sourceLanguageSubArray[0]).then(response => {
//             console.log("kaao")
//             console.log(response)
//             azureDetectLanguage(audioConfig, sourceLanguageSubArray[1]).then(response => {
//                 console.log(response)
//                 azureDetectLanguage(audioConfig, sourceLanguageSubArray[2]).then(response => {
//                     console.log(response)
//                 })
//             })
//         })
//
//     } else {
//         console.log("ket qua")
//         console.log(sourceLanguageArray)
//     }
// }
//
//
// export async function recognizeRecordAzure(filePath, sourceLanguage) {
//
//     const fileBuf = await getBufferFromUri(filePath);
//     const audioConfig = AudioConfig.fromWavFileInput(fileBuf);
//
//     let sourceLanguageArray = sourceLanguage.map((item) => item.code);
//
//     await recognizeBatch(audioConfig, sourceLanguageArray);
// }