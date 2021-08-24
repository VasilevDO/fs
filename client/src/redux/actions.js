import { CREATE_ASYNC_STRING, CREATE_STRING, SHOW_LOADER,HIDE_LOADER } from "./types";

export function createString(string) {
    return {
        type:CREATE_STRING,
        payload:string
    }
}

export function createAsyncString(string) {
    return async dispatch=>{
        dispatch(showLoader());
        await new Promise(resolve=>setTimeout(resolve,3000));//async operations should be there
        dispatch({type:CREATE_ASYNC_STRING,payload:string})
        dispatch(hideLoader());
    }
}

export function showLoader() {
    return {
        type:SHOW_LOADER
    }
}

export function hideLoader() {
    return {
        type:HIDE_LOADER
    }
}

