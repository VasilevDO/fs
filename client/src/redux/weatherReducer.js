import { WEATHER_GET_WEATHER } from "./types"

const initialState = {
    data:{}
}

export const weatherReducer = (state = initialState, action) => {
    console.log(action.payload);
    switch (action.type) {
        case WEATHER_GET_WEATHER:
            return {
                ...state, data:action.payload[0],cities:action.payload[1]
            }
        default: return state
    }
}