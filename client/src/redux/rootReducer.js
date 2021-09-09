import { combineReducers } from "redux";
import { appReducer } from "./appReducer";
import { reduxSampleReducer } from "./reduxSampleReducer";
import { currencyReducer } from "./currencyReducer";
import { sudokuApiReducer } from "./sudokiApiReducer";
import {weatherReducer} from './weatherReducer';

export const rootReducer=combineReducers({
    reduxSample:reduxSampleReducer,
    app:appReducer,
    currency:currencyReducer,
    sudokuApi:sudokuApiReducer,
    weather:weatherReducer
})