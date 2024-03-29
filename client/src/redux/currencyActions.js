import { endProcessing, startProcessing } from "./actions";
import { SHOW_LOADER,HIDE_LOADER, CURRENCY_GET_CURRENCY, CURRENCY_CHANGE_BASE_CURRENCY } from "./types";

export function getCurrency(token) {
    return async dispatch=>{
        dispatch(startProcessing(CURRENCY_GET_CURRENCY));
        const method="GET";
        const body=null;
        const headers = {
            'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
          };
        const {currency} = await fetch('/api/currency', { method, body, headers })
        .then(data => data.json());
        dispatch({type:CURRENCY_GET_CURRENCY,payload:currency})
        dispatch(endProcessing(CURRENCY_GET_CURRENCY));
    }
}

export function changeBaseCurrency(value) {
    return dispatch=>{
        dispatch({type:CURRENCY_CHANGE_BASE_CURRENCY,payload:value})
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

