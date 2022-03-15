export function splitArrayToSubArray(sourceArray, numOfSubArray = 1) {

    let result = [];
    while (sourceArray.length) {
        result.push(sourceArray.splice(0, numOfSubArray));
    }

    return result;
}

export function compareConfidence(item_1, item_2) {
    if (item_1.confidence > item_2.confidence) {
        return -1;
    }
    if (item_1.confidence < item_2.confidence) {
        return 1;
    }
    return 0;
}