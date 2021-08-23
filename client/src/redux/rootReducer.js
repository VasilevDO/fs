import { combineReducers } from "redux";
import { stringsReducer } from "./stringsReducer";

export const rootReducer=combineReducers({
    strings:stringsReducer
})