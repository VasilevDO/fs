import { SHOW_LOADER,HIDE_LOADER, CURRENCY_GET_CURRENCY } from "./types";

export function getCurrency(token) {
    return async dispatch=>{
        dispatch(showLoader());
        const method="GET";
        const body=null;
        const headers = {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
          };
        const currency = await fetch('/api/currency', { method, body, headers })
        .then(data => data.json());
        dispatch({type:CURRENCY_GET_CURRENCY,payload:currency})
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

