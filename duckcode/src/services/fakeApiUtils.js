/**
 * Simulates a delay from an API call.
 * 
 * @param {number} ms The duration of delay 
 * @param {any} resolveContent The content if the promise is fulfilled
 * @param {any} rejectContent (default: null) The content if the promise is rejected
 * @param {boolean} isFulfilled (default: true) the outcome of the Promise, true if fulfilled, false otherwise
 * @returns a Promise. This is in line with the asynchronous nature of API calls. 
 */
export function delay(ms, resolveContent, rejectContent=null, isFulfilled=true) {
    // make sure that if the rejected content is not provided, the fake API call defaults to fulfilled
    if (rejectContent === null) {
        isFulfilled = true;
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isFulfilled) {
                resolve(resolveContent);
            } else {
                reject(rejectContent);
            }
        }, ms);
    });
}


