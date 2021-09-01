import { CREATE_ASYNC_STRING, CREATE_STRING, SHOW_ALERT, HIDE_ALERT, DELETE_STRING, DELETE_ASYNC_STRING } from "./types"

const initialState = {
    strings: [],
    asyncStrings: [],
    inputValue: ''
}


export const reduxSampleReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_STRING:
            return {
                ...state, strings: state.strings.concat(action.payload)
            }
        case DELETE_STRING:
            return {
                ...state, strings: state.strings.filter((item,index) => index !== action.payload)
            }
        case CREATE_ASYNC_STRING: {
            return {
                ...state, asyncStrings: state.asyncStrings.concat(action.payload)
            }
        }
        case DELETE_ASYNC_STRING:
            return {
                ...state, asyncStrings: state.asyncStrings.filter((item,index) => index !== action.payload)
            }
        case SHOW_ALERT: {
            return {
                ...state, alert: action.payload
            }
        }
        case HIDE_ALERT: {
            return {
                ...state, alert: false
            }
        }
        default: return state
    }
}