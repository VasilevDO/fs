import { combineReducers } from "redux";
import { appReducer } from "./appReducer";
import { reduxSampleReducer } from "./reduxSampleReducer";
import { currencyReducer } from "./currencyReducer";

export const rootReducer=combineReducers({
    reduxSample:reduxSampleReducer,
    app:appReducer,
    currency:currencyReducer
})