export function splitArrayToSubArray(sourceArray, numOfSubArray = 1) {

    let result = [];
    while (sourceArray.length) {
        result.push(sourceArray.splice(0, numOfSubArray));
    }

    return result;
}