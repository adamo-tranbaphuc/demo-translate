import {API_KEY_GOOGLE, URL_SPEECH_TO_TEXT, URL_TRANSLATE} from "../../utils/consts";
import {generateParamRequest, splitArrayToSubArray} from "../../utils/helpers";
import RNFS from 'react-native-fs'

export async function fetchTranslateText(params) {
    let paramsRequest = {
        ...params,
        format: 'text',
        key: API_KEY_GOOGLE
    }

    let urlToRequest = URL_TRANSLATE + generateParamRequest(paramsRequest);

    return await fetch(urlToRequest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse)
            return jsonResponse.data.translations[0].translatedText
        });
}

export async function translateWord(textNeedTranslate = "en", sourceLanguage = "en", targetLanguages = []) {

    let requests = targetLanguages.map((item) => {

        let params = {
            q: textNeedTranslate,
            source: sourceLanguage,
            target: item.languageCode
        }

        return sourceLanguage === item.languageCode ? textNeedTranslate : fetchTranslateText(params);
    })

    return Promise.all(requests)
        .then(response => {
            return response;
        })
}

export async function googleDetectLanguage(body) {

    let paramsRequest = {
        key: API_KEY_GOOGLE
    }

    let urlToRequest = URL_SPEECH_TO_TEXT + generateParamRequest(paramsRequest);

    return await fetch(urlToRequest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse)
            if (jsonResponse.results?.length > 0) {
                let result = jsonResponse.results[0];

                return {
                    transcript: result.alternatives[0].transcript,
                    confidence: result.alternatives[0].confidence,
                    languageCode: result.languageCode
                };
            } else return ({
                confidence: 0
            })
        })
        .catch((error) => {
            console.log(error)
            return ({
                confidence: 0
            })
        })
}

async function recognizeBatch(recordBase64, sourceLanguageArray) {
    if (sourceLanguageArray.length > 1) {
        let sourceLanguageSubArray = splitArrayToSubArray(sourceLanguageArray, 4);

        let requests = sourceLanguageSubArray.map(async (item) => {
            console.log("-----------------")
            console.log(item)
            let body = {
                config: {
                    encoding: "WEBM_OPUS",
                    sampleRateHertz: 16000,
                    languageCode: item[0],
                    alternativeLanguageCodes: item
                },
                audio: {
                    content: recordBase64
                }
            };

            return googleDetectLanguage(body);
        })

        return Promise.all(requests)
            .then(response => {
                return recognizeBatch(recordBase64, response.length > 1 ? response.map((item) => item.languageCode) : response);
            })

    } else {
        console.log(sourceLanguageArray)
        return {
            transcript: sourceLanguageArray[0].transcript,
            confidence: sourceLanguageArray[0].confidence,
            languageCode: sourceLanguageArray[0].languageCode
        };
    }
}

export async function recognizeRecordGoogleGroup(filePath, sourceLanguage) {

    let recordBase64 = await RNFS.readFile(filePath, "base64");

    let sourceLanguageArray = sourceLanguage.map((item) => item.code);

    return await recognizeBatch(recordBase64, sourceLanguageArray);
}

export async function recognizeRecordGoogleGroupWithBase64(recordBase64, sourceLanguage) {
    let sourceLanguageArray = sourceLanguage.map((item) => item.languageCode);

    return await recognizeBatch(recordBase64, sourceLanguageArray);
}
