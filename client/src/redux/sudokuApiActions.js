import { SUDOKUAPI_GET_NEW_BOARD } from "./types";

export function getApiBoard(difficulty) {
    return async dispatch => {
        const encodeBoard = (board) => board.reduce((result, row, i) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '')
        const encodeParams = (params) =>
            Object.keys(params)
                .map(key => key + `=%5B${encodeBoard(params[key])}%5D`)
                .join('&');
        const swap0toNull = (board) => {
            return board.map(arr => {
                return arr.map(val => {
                    return val === 0 ? null : val;
                })
            })
        }
        let startingBoard = await fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
            .then(response => response.json())
            .then(data => data.board);
        const data = { board: startingBoard };
        let solvedBoard = await fetch('https://sugoku.herokuapp.com/solve', {
            method: 'POST',
            body: encodeParams(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(response => response.json())
            .then(solvedBoard => solvedBoard.solution);
        startingBoard = swap0toNull(startingBoard);
        dispatch({
            type: SUDOKUAPI_GET_NEW_BOARD, payload: [
                startingBoard,solvedBoard
            ]
        })
    }
}