import { CREATE_ASYNC_STRING, CREATE_STRING, SHOW_LOADER, HIDE_ALERT, HIDE_LOADER, SHOW_ALERT, DELETE_STRING, DELETE_ASYNC_STRING, START_PROCESSING, END_PROCESSING, LOADING_FAILED } from "./types";

export function createString(string) {
    return dispatch => {
        dispatch(hideAlert());
        dispatch({ type: CREATE_STRING, payload: string })
    }
}

export function deleteString(index) {
    return dispatch => {
        dispatch(hideAlert());
        dispatch({ type: DELETE_STRING, payload: index })
    }
}

export function createAsyncString(string) {
    return async dispatch => {
        dispatch(hideAlert());
        dispatch(startProcessing(CREATE_ASYNC_STRING));
        await new Promise(resolve => setTimeout(resolve, +1000 + Math.random() * 4000));//async operations should be there
        dispatch({ type: CREATE_ASYNC_STRING, payload: string });
        dispatch(endProcessing(CREATE_ASYNC_STRING));
    }
}

export function deleteAsyncString(index) {
    return async dispatch => {
        dispatch(hideAlert());
        dispatch(startProcessing(DELETE_ASYNC_STRING));
        await new Promise(resolve => setTimeout(resolve, +1000 + Math.random() * 4000));//async operations should be there
        dispatch({ type: DELETE_ASYNC_STRING, payload: index })
        dispatch(endProcessing(DELETE_ASYNC_STRING));
    }
}

export function startProcessing(process) {
    return {
        type: START_PROCESSING,
        payload: process
    }
}

export function endProcessing(process) {
    return {
        type: END_PROCESSING,
        payload: process
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

