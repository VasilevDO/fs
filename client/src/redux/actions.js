import { CREATE_ASYNC_STRING, CREATE_STRING, SHOW_LOADER, HIDE_ALERT, HIDE_LOADER, SHOW_ALERT, STORE_STRING, RETURN_STRING } from "./types";

export function createString(string) {
    return dispatch => {
        dispatch(hideAlert());
        dispatch({type:STORE_STRING,payload:string})
        dispatch({ type: CREATE_STRING, payload: string })
    }
}

export function storeString(string) {
    return dispatch => {
        dispatch({type:STORE_STRING, payload:string})
    }
}

export function returnString(string) {
    return dispatch => {
        dispatch({type:RETURN_STRING, payload:string})
    }
}

export function createAsyncString(string) {
    return async dispatch => {
        dispatch(showLoader());
        dispatch(hideAlert());
        dispatch({type:STORE_STRING,payload:string})
        await new Promise(resolve => setTimeout(resolve, 1000));//async operations should be there
        dispatch({ type: CREATE_ASYNC_STRING, payload: string })
        dispatch(hideLoader());
    }
}

export function showAlert(alert) {
    return dispatch => {
        dispatch({ type: SHOW_ALERT, payload: alert })
    }
}

export function hideAlert() {
    return {
        type: HIDE_ALERT
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

