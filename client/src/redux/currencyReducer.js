import { CURRENCY_GET_CURRENCY } from "./types"

const initialState={
    currency:{}
}


export const currencyReducer=(state=initialState,action)=> {
    switch (action.type) {
        // case CREATE_STRING:
        //     return {
        //         ...state,strings:state.strings.concat(action.payload)
        //     }
        case CURRENCY_GET_CURRENCY:{
            return {
                ...state,currency:action.payload
            }
        }
        default: return state
    }
}