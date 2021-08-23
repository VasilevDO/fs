import React, { Component } from "react";
import "./Sudoku.css";
import { Loader } from "./Loader";


class Sudoku extends Component {
  constructor() {
    super();
    this.state = {
      board: this.basicBoard,
      solvedBoard: this.initializeBoard(),
      startingBoard: null,
      alert: null,
      solutionVisible: false,
      wrongCellsVisible: false,
      difficulty: "medium",
      loading: true
    };
  }

  basicBoard = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8]
  ];

  difficulties = {
    easy: [15, 30],
    medium: [30, 45],
    hard: [45, 81]
  };

  emptyBoard = new Array(9).fill(new Array(9).fill(null));

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

  swapRows = (matrix) => {
    let farr = matrix.concat();
    let row1 = Math.round(Math.random() * 8);
    let row2 = row1;
    if (row1 <= 2) {
      while (row2 === row1) {
        row2 = Math.round(Math.random() * 2);
      }
      farr[row1] = matrix[row2];
      farr[row2] = matrix[row1];
    } else if (row1 <= 5) {
      while (row2 === row1) {
        row2 = 3 + Math.round(Math.random() * 2);
      }
      farr[row1] = matrix[row2];
      farr[row2] = matrix[row1];
    } else if (row1 <= 8) {
      while (row2 === row1) {
        row2 = 6 + Math.round(Math.random() * 2);
      }
      farr[row1] = matrix[row2];
      farr[row2] = matrix[row1];
    }
    return farr;
  };

  swapColumns = (matrix) => {
    let farr = matrix.concat();
    farr = this.transposing(farr);
    farr = this.swapRows(farr);
    farr = this.transposing(farr);
    return farr;
  };

  swapBigRows = (matrix) => {
    let farr = matrix.concat();
    let block1 = Math.round(Math.random() * 2);
    let block2 = block1;
    while (block1 === block2) {
      block2 = Math.round(Math.random() * 2);
    }
    farr[block1 * 3] = matrix[block2 * 3];
    farr[block1 * 3 + 1] = matrix[block2 * 3 + 1];
    farr[block1 * 3 + 2] = matrix[block2 * 3 + 2];
    farr[block2 * 3] = matrix[block1 * 3];
    farr[block2 * 3 + 1] = matrix[block1 * 3 + 1];
    farr[block2 * 3 + 2] = matrix[block1 * 3 + 2];
    return farr;
  };

  swapBigColumns = (matrix) => {
    let farr = matrix.concat();
    farr = this.transposing(farr);
    farr = this.swapBigRows(farr);
    farr = this.transposing(farr);
    return farr;
  };

  randomMods = [
    this.swapBigRows,
    this.swapBigColumns,
    this.swapRows,
    this.swapColumns,
    this.transposing
  ];

  refresh = () => {
    let board = this.basicBoard.concat();
    const random = this.random(5555, 9999);
    for (let i = 0; i < random; i++) {
      let r = this.random(0, 4);
      board = this.randomMods[r](board);
    }
    this.setState({
      board: board
    });
  };

  shuffle = () => {
    let board = this.state.board.concat();
    const random = this.random(5555, 9999);
    for (let i = 0; i < random; i++) {
      let r = this.random(0, 4);
      board = this.randomMods[r](board);
    }
    this.setState({
      board: board
    });
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

  initializeBoard = () => {
    let solvedBoard = this.copyMatrix(this.basicBoard);
    const random = this.random(111, 222);
    for (let i = 0; i < random; i++) {
      let r = this.random(0, 4);
      solvedBoard = this.randomMods[r](solvedBoard);
    }
    return solvedBoard;
  };

  copyMatrix = (matrix) => {
    let copy = matrix.map((row) => row.concat());
    return copy;
  };

  prepareBoard = (difficulty, solvedBoard) => {
    let startingBoard = this.copyMatrix(solvedBoard);
    let lastStableX, lastStableY, savedCell;
    let deletedCells = -1;
    while (
      deletedCells < this.difficulties[difficulty.toLowerCase()][1] &&
      this.isSolveOnlyOne(startingBoard)
    ) {
      let x = this.random(0, 8);
      let y = this.random(0, 8);
      if (startingBoard[y][x] !== null) {
        savedCell = startingBoard[y][x];
        lastStableX = x;
        lastStableY = y;
        startingBoard[y][x] = null;
        deletedCells++;
      }
    }
    startingBoard[lastStableY][lastStableX] = savedCell;

    if (
      deletedCells < this.difficulties[difficulty.toLowerCase()][0] ||
      deletedCells > this.difficulties[difficulty.toLowerCase()][1]
    ) {
      return this.prepareBoard(difficulty, this.initializeBoard());
    }
    this.setState({
      board: startingBoard,
      startingBoard: startingBoard,
      solvedBoard: solvedBoard,
      loading: false
    });
    return;
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

  createNewPuzzle = () => {
    const difficulty = this.state.difficulty;
    const solvedBoard = this.copyMatrix(this.state.solvedBoard);
    this.prepareBoard(difficulty, solvedBoard);
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

  componentDidMount = () => {
    const difficulty = this.state.difficulty;
    const solvedBoard = this.copyMatrix(this.state.solvedBoard);
    this.prepareBoard(difficulty, solvedBoard);
  }

  render() {

    if (this.state.loading) {
      return <Loader />
    }

    const difficulty = this.state.difficulty;
    const startingBoard = this.state.startingBoard;
    const board = this.state.solutionVisible
      ? this.state.solvedBoard
      : this.state.board;

    let disabled, cellY, cellX, cellStyle;
    const alert = this.state.alert;
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
        this.createBoardDiv(0, 0, board),
        this.createBoardDiv(0, 3, board),
        this.createBoardDiv(0, 6, board)
      ],
      [
        this.createBoardDiv(3, 0, board),
        this.createBoardDiv(3, 3, board),
        this.createBoardDiv(3, 6, board)
      ],
      [
        this.createBoardDiv(6, 0, board),
        this.createBoardDiv(6, 3, board),
        this.createBoardDiv(6, 6, board)
      ]
    ];

    return (
      <>
        <div className="sudoku">
          <div className="sudoku-buttons" style={sudokuBoardStyle}>
            <div className='sudoku-buttons-row'>
              <div className='pwnz-button' >
                <div onClick={this.createNewPuzzle}>Set new puzzle</div>
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
                                  <div className="sudoku-cell">
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

export default Sudoku;
