import { hideLoader, showAlert } from "./actions";
import { CREATE_ASYNC_STRING, CREATE_STRING } from "./types";


const bannedWords=['php','lol'];

export function checkForBannedWords({dispatch}) {
    return function (next) {
        return function (action) {
            if (action.type===CREATE_STRING||action.type===CREATE_ASYNC_STRING) {
                const bannedWordsInStr=bannedWords.filter(word=>action.payload.toLowerCase().includes(word));
                if (bannedWordsInStr.length) {
                    return dispatch(showAlert({
                            status:'red',
                            text:`Do not use mean words (${bannedWordsInStr.join(', ')}), please`
                        })); 
                }
            }
            return next(action);
        }
    }
}

export function checkInputNotEmpty({dispatch}) {
    return function (next) {
        return function (action) {
            if (action.type===CREATE_STRING||action.type===CREATE_ASYNC_STRING) {
                if (!action.payload.length) {
                    return dispatch(showAlert({
                        status:'red',
                        text:`String can not be empty`
                    })); 
                }
            }
            return next(action);
        }
    }
}