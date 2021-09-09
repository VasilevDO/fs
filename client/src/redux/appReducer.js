import { SHOW_LOADER,HIDE_LOADER, GET_USER, SET_USER, APP_START_PROCESSING, APP_END_PROCESSING } from "./types"

const initialState={
    loading:false,
    user:{},
    processing:[]
}

export const appReducer = (state=initialState,action)=> {
    switch (action.type) {
        case SHOW_LOADER:
            return {...state,loading:true}
        case HIDE_LOADER:
            return {...state,loading:false}
        case GET_USER:
            return {...state,user:action.payload}
        case SET_USER:
            return {...state,user:action.payload}
        case APP_START_PROCESSING: {
            return {...state,processing:Array.from(new Set(state.processing).add(action.payload))}
        }
        case APP_END_PROCESSING: {
            return {...state, processing:state.processing.filter(item=>item!==action.payload)}
        }
        default: return state
    }
}