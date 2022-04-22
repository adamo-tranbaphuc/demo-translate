import {API_KEY_GOOGLE, GENDER_VOICE, URL_SPEECH_TO_TEXT, URL_TEXT_TO_SPEECH} from "../../utils/consts";
import {generateParamRequest} from "../../utils/helpers";
import {LANGUAGES} from "../../utils/consts/languages";
import RNFS from 'react-native-fs'
import Sound from "react-native-sound";

export async function textToSpeech(text, languageCode, gender = GENDER_VOICE.MALE) {
    console.log(languageCode)
    let paramsRequest = {
        key: API_KEY_GOOGLE
    }

    let body = {
        input: {
            text: text
        },
        voice: {
            "languageCode": languageCode,
            "ssmlGender": gender
        },
        audioConfig: {
            audioEncoding: "MP3"
        }
    };

    let urlToRequest = URL_TEXT_TO_SPEECH + generateParamRequest(paramsRequest);

    return await fetch(urlToRequest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(jsonResponse => {
            const path = `${RNFS.DocumentDirectoryPath}/textToSpeech.mp3`;
            return RNFS.writeFile(path, jsonResponse.audioContent, 'base64').then(() => path);
        })
        .catch((error) => {
            console.log(error)
        })
}
