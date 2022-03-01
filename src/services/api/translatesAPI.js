import {API_KEY, URL} from "../../utils/consts";
import {generateParamRequest} from "../../utils/helpers";

export async function postTranslate(textNeedTranslate = "", sourceLanguage = "", targetLanguage = "") {
    let paramsRequest = {
        q: textNeedTranslate,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text',
        key: API_KEY
    }

    let urlToRequest = URL + generateParamRequest(paramsRequest);

    return await fetch(urlToRequest, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.data.translations[0].translatedText);
}
