import { SHOW_LOADER,HIDE_LOADER, GET_USER, SET_USER } from "./types"

const initialState={
    loading:false,
    user:{}
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
        default: return state
    }
}