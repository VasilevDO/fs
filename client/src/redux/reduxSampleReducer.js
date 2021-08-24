import { CREATE_ASYNC_STRING, CREATE_STRING } from "./types"

const initialState={
    strings:[],
    asyncStrings:[],
}


export const reduxSampleReducer=(state=initialState,action)=> {
    switch (action.type) {
        case CREATE_STRING:
            return {
                ...state,strings:state.strings.concat(action.payload)
            }
        case CREATE_ASYNC_STRING:{
            return {
                ...state,asyncStrings:state.asyncStrings.concat(action.payload)
            }
        }
        default: return state
    }
}