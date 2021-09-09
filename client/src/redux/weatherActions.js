import { startAppProcessing, endAppProcessing, loadingFailed } from "./appActions";
import { WEATHER_GET_WEATHER } from "./types";
import { store } from "./store";

export function getWeatherData(city) {
    return async dispatch => {
        dispatch(startAppProcessing(WEATHER_GET_WEATHER));
        try {
            const method = 'POST';
            const time = [
                (new Date().getTime() / 1000 - 10).toFixed(0), //today in seconds
                (new Date().getTime() / 1000 - 10).toFixed(0) - 86400 //yesterday in seconds
            ]; //-10 secs to fix 'time in future' error
            const body = JSON.stringify({
                city: city,
                time: time
            });

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store.getState().app.user.token}`
            };
            const weatherObj = await fetch('/api/weather', { method, body, headers })
                .then(data => data.json());
            console.log('ckek2')
            dispatch({
                type: WEATHER_GET_WEATHER,
                payload: weatherObj
            });
        } catch (e) {
            loadingFailed(WEATHER_GET_WEATHER);
        }
        dispatch(endAppProcessing(WEATHER_GET_WEATHER));
    }
}