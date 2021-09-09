import { GET_USER, SET_USER, SHOW_LOADER, HIDE_LOADER, APP_START_PROCESSING, APP_END_PROCESSING } from "./types";

export function getUser() {
    return async dispatch => {
        dispatch(showLoader());
        // const method="GET";
        // const body=null;
        // const headers = {
        //     'Content-Type': 'application/json',
        //      Authorization: `Bearer ${token}`
        //   };
        // const {currency} = await fetch('/api/currency', { method, body, headers })
        // .then(data => data.json());
        dispatch({ type: GET_USER, payload: 'keker' })
        dispatch(hideLoader());
    }
}
export function setUser(user) {
    return {
        type: SET_USER, payload: user
    }

}

export function showLoader() {
    return {
        type: SHOW_LOADER
    }
}

export function hideLoader() {
    return {
        type: HIDE_LOADER
    }
}


export function startAppProcessing(process) {
    return {
        type: APP_START_PROCESSING,
        payload: process
    }
}

export function endAppProcessing(process) {
    return {
        type: APP_END_PROCESSING,
        payload: process
    }
}


export function loadingFailed(process) {
    return {
        type:LOADING_FAILED,
        payload:process
    }
}
