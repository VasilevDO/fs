import { SUDOKUAPI_GET_NEW_BOARD } from "./types"

const initialState = {
    board:null
}

export const sudokuApiReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUDOKUAPI_GET_NEW_BOARD:
            return {
                ...state, board:action.payload[0], startingBoard:action.payload[0], solvedBoard:action.payload[1]
            }
        default: return state
    }
}