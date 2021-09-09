import { startAppProcessing, endAppProcessing } from "./appActions";
import { WEATHER_GET_WEATHER } from "./types";

export function getWeather() {
    return async dispatch => {
        dispatch(startAppProcessing(WEATHER_GET_WEATHER));
        dispatch(endAppProcessing(WEATHER_GET_WEATHER));
    }
}