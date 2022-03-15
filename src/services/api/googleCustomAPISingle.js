import {API_KEY_GOOGLE, URL_SPEECH_TO_TEXT} from "../../utils/consts";
import {generateParamRequest} from "../../utils/helpers";
import {LANGUAGES} from "../../utils/consts/languages";
import RNFS from 'react-native-fs'

export async function fetchTranslateAudio(body) {

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

export async function recognizeRecordGoogleSingle(filePath, languageCode = LANGUAGES) {
    let recordBase64 = await RNFS.readFile(filePath, "base64")

    let requests = languageCode.map((item) => {

        let body = {
            config: {
                encoding: "WEBM_OPUS",
                sampleRateHertz: 16000,
                languageCode: item.code
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
