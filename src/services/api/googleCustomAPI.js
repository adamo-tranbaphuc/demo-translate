import {API_KEY, URL_SPEECH_TO_TEXT, URL_TRANSLATE} from "../../utils/consts";
import {generateParamRequest} from "../../utils/helpers";
import {LANGUAGES} from "../../utils/consts/languages";
import RNFS from 'react-native-fs'

export async function fetchTranslateText(params) {
    let paramsRequest = {
        ...params,
        format: 'text',
        key: API_KEY
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

export async function translateRecordText(textNeedTranslate = "en", sourceLanguage = "en", targetLanguages = []) {

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

export async function fetchTranslateAudio(body) {

    let paramsRequest = {
        key: API_KEY
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

                let jsonResult = {
                    transcript: result.alternatives[0].transcript,
                    confidence: result.alternatives[0].confidence,
                    languageCode: result.languageCode
                };

                console.log(jsonResult);

                return jsonResult;
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

export async function recognizeRecord(filepath, languageCode = LANGUAGES) {
    let recordBase64 = await RNFS.readFile(filepath, "base64")

    let requests = languageCode.map((item) => {

        let body = {
            config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 16000,
                languageCode: "es-ES",
                alternativeLanguageCodes:["es-ES", "ja-JP", "ko-KR", "th-TH"]
            },
            audio: {
                content: recordBase64
            }
        };

        return fetchTranslateAudio(body).then(a => {
            return a
        });
    })

    return Promise.all(requests)
        .then(response => {
            return response.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current)
        })
}
