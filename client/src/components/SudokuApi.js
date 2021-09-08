import React, { Component } from "react";
import { connect } from 'react-redux';
import "./Sudoku.css";
import { Loader } from './Loader';
import {getApiBoard} from '../redux/sudokuApiActions';


class SudokuApi extends Component {
  constructor() {
    super();
    this.state = {
      board: null,
      solvedBoard: null,
      startingBoard: null,
      alert: null,
      solutionVisible: false,
      wrongCellsVisible: false,
      difficulty: "medium"
    };
  }

  random = (a, b) => {
    return Math.round(a - 0.5 + Math.random() * (b - a + 1));
  };

  transposing = (matrix) => {
    let farr = [];
    for (let i = 0; i < matrix.length; i++) {
      let arr = [];
      for (let j = 0; j < matrix.length; j++) {
        arr.push(matrix[j][i]);
      }
      farr.push(arr);
    }
    return farr;
  };


  solve = (board) => {
    let solutions = [];
    function solve(board) {
      if (solved(board)) {
        solutions.push(board);
      }
      const possibilities = nextBoards(board);
      const validBoards = keepOnlyValid(possibilities);
      return searchForSolution(validBoards);
    }

    function searchForSolution(boards) {
      if (boards.length < 1) {
        return false;
      } else {
        let first = boards.shift();
        const tryPath = solve(first);
        if (tryPath !== false) {
          return tryPath;
        } else {
          return searchForSolution(boards);
        }
      }
    }

    function solved(board) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === null) {
            return false;
          }
        }
      }
      return true;
    }

    function nextBoards(board) {
      let res = [];
      const firstEmpty = findEmptySquare(board);
      if (firstEmpty !== undefined) {
        const y = firstEmpty[0];
        const x = firstEmpty[1];
        for (let i = 1; i <= 9; i++) {
          let newBoard = [...board];
          let row = [...newBoard[y]];
          row[x] = i;
          newBoard[y] = row;
          res.push(newBoard);
        }
      }
      return res;
    }

    function findEmptySquare(board) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] == null) {
            return [i, j];
          }
        }
      }
    }

    function keepOnlyValid(boards) {
      return boards.filter((b) => validBoard(b));
    }

    function validBoard(board) {
      return rowsGood(board) && columnsGood(board) && boxesGood(board);
    }
    function rowsGood(board) {
      for (let i = 0; i < 9; i++) {
        let cur = [];
        for (let j = 0; j < 9; j++) {
          if (cur.includes(board[i][j])) {
            return false;
          } else if (board[i][j] != null) {
            cur.push(board[i][j]);
          }
        }
      }
      return true;
    }

    function columnsGood(board) {
      for (let i = 0; i < 9; i++) {
        let cur = [];
        for (let j = 0; j < 9; j++) {
          if (cur.includes(board[j][i])) {
            return false;
          } else if (board[j][i] != null) {
            cur.push(board[j][i]);
          }
        }
      }
      return true;
    }

    function boxesGood(board) {
      const boxCoordinates = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
      ];
      for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
          let cur = [];
          for (let i = 0; i < 9; i++) {
            let coordinates = [...boxCoordinates[i]];
            coordinates[0] += y;
            coordinates[1] += x;
            if (cur.includes(board[coordinates[0]][coordinates[1]])) {
              return false;
            } else if (board[coordinates[0]][coordinates[1]] != null) {
              cur.push(board[coordinates[0]][coordinates[1]]);
            }
          }
        }
      }
      return true;
    }
    return solve(board) || solutions;
  };

  isSolveOnlyOne = (matrix) => {
    let board = this.copyMatrix(matrix);
    let solutions = this.solve(board);
    return solutions.length === 1;
  };

  handleCellChange = (e) => {
    let board = this.copyMatrix(this.state.board);
    let row = e.target.getAttribute("a-key").split(",")[0];
    let col = e.target.getAttribute("a-key").split(",")[1];
    board[row][col] = +e.target.value.match(/\d*/g)[0];
    this.setState({
      board: board
    });
  };


  copyMatrix = (matrix) => {
    let copy = matrix.map((row) => row.concat());
    return copy;
  };

  checkSolution = () => {
    const board = this.state.board;
    const solution = this.state.solvedBoard;
    const alert = board.join("") === solution.join("") ? "done" : "error";

    this.setState({
      alert: alert
    });
    setTimeout(() => {
      this.setState({
        alert: null
      });
    }, 2000);
  };

  toggleSolution = () => {
    this.setState({
      solutionVisible: !this.state.solutionVisible
    });
  };

  toggleWrongCells = () => {
    this.setState({
      wrongCellsVisible: !this.state.wrongCellsVisible
    });
  };

  createBoardDiv = (y, x, board) => {
    return [
      [board[y][x], board[y][x + 1], board[y][x + 2]],
      [board[y + 1][x], board[y + 1][x + 1], board[y + 1][x + 2]],
      [board[y + 2][x], board[y + 2][x + 1], board[y + 2][x + 2]]
    ];
  };

  handleDifficultyChange = (e) => {
    this.setState({
      difficulty: e.target.value
    });
  };

  swap0toNull = (board) => {
    return board.map(arr => {
      return arr.map(val => {
        return val === 0 ? null : val;
      })
    })
  }

  getBoard = async () => {
    try {
      let startingBoard = await fetch(`https://sugoku.herokuapp.com/board?difficulty=${this.state.difficulty}`)
        .then(response => response.json())
        .then(data => data.board);
      const data = { board: startingBoard };
      let solvedBoard = await fetch('https://sugoku.herokuapp.com/solve', {
        method: 'POST',
        body: this.encodeParams(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(response => response.json())
        .then(solvedBoard => solvedBoard.solution);
      startingBoard = this.swap0toNull(startingBoard);
      return {
        startingBoard: startingBoard,
        solvedBoard: solvedBoard,
        board: startingBoard
      }
    } catch (e) {

    }
  }

  getNewBoard = async () => {
    this.setState({
      loading: true
    })
    const { startingBoard, solvedBoard } = await this.getBoard();
    this.setState({
      startingBoard: startingBoard,
      solvedBoard: solvedBoard,
      board: startingBoard,
      loading: false
    });
  }



  componentDidMount = async () => {
      this.props.getApiBoard(this.state.difficulty);
    // const { startingBoard, solvedBoard } = await this.getBoard();
    // this.setState({
    //   startingBoard: startingBoard,
    //   solvedBoard: solvedBoard,
    //   board: startingBoard,
    //   loading: false
    // });
  }

  render() {
    console.log(this.props);

    const {difficulty, alert}=this.state;
    const startingBoard=this.state.startingBoard||Array(9).fill(Array(9).fill(1));
    const solvedBoard=this.state.solvedBoard||Array(9).fill(Array(9).fill(1));
    const board=this.state.board||Array(9).fill(Array(9).fill(1));
    const boardToShow=(this.state.solutionVisible? solvedBoard: board)||Array(9).fill(Array(9).fill(1));
    let disabled, cellY, cellX, cellStyle;
    const sudokuBoardStyle = {
      backgroundColor: alert ? (alert === "done" ? "green" : "red") : null
    };
    const toggleSolutionButtonText = this.state.solutionVisible
      ? "Hide solution"
      : "Show solution";
    const toggleWrongCells = this.state.wrongCellsVisible
      ? "Hide wrong cells"
      : "Show wrong cells";

    const boardDivs = [
      [
        this.createBoardDiv(0, 0, boardToShow),
        this.createBoardDiv(0, 3, boardToShow),
        this.createBoardDiv(0, 6, boardToShow)
      ],
      [
        this.createBoardDiv(3, 0, boardToShow),
        this.createBoardDiv(3, 3, boardToShow),
        this.createBoardDiv(3, 6, boardToShow)
      ],
      [
        this.createBoardDiv(6, 0, boardToShow),
        this.createBoardDiv(6, 3, boardToShow),
        this.createBoardDiv(6, 6, boardToShow)
      ]
    ];

    return (
      <>
        <div className="sudoku">
          <div className="sudoku-buttons" style={sudokuBoardStyle}>
            <div className='sudoku-buttons-row'>
              <div className='pwnz-button' >
                <div onClick={this.setNewBoard}>Set new puzzle</div>
              </div>
              <div>
                <select value={difficulty} onChange={this.handleDifficultyChange} className='browser-default'>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className='sudoku-buttons-row'>
              <div className='pwnz-button' >
                <div onClick={this.checkSolution}>Check solution</div>
              </div>
              <div className='pwnz-button' >
                <div onClick={this.toggleSolution}>{toggleSolutionButtonText}</div>
              </div>
              <div className='pwnz-button' >
                <div onClick={this.toggleWrongCells}>{toggleWrongCells}</div>
              </div>
            </div>
          </div>
          <div className="sudoku-board">
            {boardDivs.map((squaresRow, squaresRowIndex) => {
              return (
                <div className="sudoku-board-squares-row">
                  {squaresRow.map((square, squareIndex) => {
                    return (
                      <div className="sudoku-board-squares-row-square">
                        {square.map((squareRow, squareRowIndex) => {
                          return (
                            <div className="sudoku-board-squares-row-square-row">
                              {squareRow.map((cell, cellIndex) => {
                                cellY = squaresRowIndex * 3 + squareRowIndex;
                                cellX = squareIndex * 3 + cellIndex;
                                disabled =
                                  cell && cell === startingBoard[cellY][cellX];

                                cellStyle = this.state.wrongCellsVisible
                                  ? cell ===
                                    this.state.solvedBoard[cellY][cellX]
                                    ? null
                                    : { color: "red" }
                                  : null;
                                return (
                                  <div className="sudoku-cell" key={cellY + cellX}>
                                    <input
                                      a-key={[cellY, cellX]}
                                      value={cell ? cell : ""}
                                      onChange={this.handleCellChange}
                                      disabled={disabled}
                                      style={cellStyle}
                                    ></input>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    state: state.sudokuApi
  }
}

const mapDispatchToProps = {
  getApiBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(SudokuApi);
