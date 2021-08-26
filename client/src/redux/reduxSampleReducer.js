import { CREATE_ASYNC_STRING, CREATE_STRING, SHOW_ALERT, HIDE_ALERT, STORE_STRING } from "./types"

const initialState={
    strings:[],
    asyncStrings:[],
    storedString:''
}


export const reduxSampleReducer=(state=initialState,action)=> {
    switch (action.type) {

        case STORE_STRING:
            return {
                ...state,storedString:action.payload
            }
        case CREATE_STRING:
            return {
                ...state,strings:state.strings.concat(action.payload)
            }
        case CREATE_ASYNC_STRING:{
            return {
                ...state,asyncStrings:state.asyncStrings.concat(action.payload)
            }
        }
        case SHOW_ALERT:{
            return {
                ...state,alert:action.payload
            }
        }
        case HIDE_ALERT:{
            return {
                ...state,alert:false
            }
        }
        default: return state
    }
}