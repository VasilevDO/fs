import { combineReducers } from "redux";
import { appReducer } from "./appReducer";
import { reduxSampleReducer } from "./reduxSampleReducer";

export const rootReducer=combineReducers({
    reduxSample:reduxSampleReducer,
    app:appReducer
})