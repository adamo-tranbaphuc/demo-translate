import {API_KEY_GOOGLE, URL_SPEECH_TO_TEXT} from "../../utils/consts";
import {compareConfidence, generateParamRequest} from "../../utils/helpers";
import {LANGUAGES} from "../../utils/consts/languages";
import RNFS from 'react-native-fs'
import {recognizeRecordGoogleGroupWithBase64} from "./googleAPIGroup";

export async function fetchTranslateAudioTopGroup(body) {

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

export async function recognizeRecordGoogleTopGroup(filePath, languageCode = LANGUAGES) {
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

        return fetchTranslateAudioTopGroup(body).then(a => {
            return a
        });
    })

    return Promise.all(requests)
        .then(async (response) => {

            if(languageCode.length>2) {
                response.sort(compareConfidence);
                let top4Language = response.splice(0, 4);
                return await recognizeRecordGoogleGroupWithBase64(recordBase64, top4Language);
            }else {
                return response.reduce((prev, current) => (prev.confidence > current.confidence) ? prev : current)
            }
        })
}
