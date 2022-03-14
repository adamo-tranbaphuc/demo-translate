import getPath from "@flyerhq/react-native-android-uri-path";
import RNFS from "react-native-fs";
import {Buffer} from "buffer";

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getBufferFromUri(uri: string) {
    const path = getPath(uri);
    const utf8string = await RNFS.readFile(path, 'base64');

    return Buffer.from(utf8string, 'base64');
}