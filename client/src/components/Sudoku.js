import React, { Component } from "react";
import "./Sudoku.css";

class Sudoku extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: this.basicBoard,
      solvedBoard: this.initializeBoard(),
      startingBoard: null,
      alert: null,
      solutionVisible: false
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

  deleteRandomCell = (matrix) => {
    let x = this.random(0, 8);
    let y = this.random(0, 8);
    let savedCell = matrix[x][y];
    matrix[x][y] = null;
    return [matrix, x, y, savedCell];
  };

  solve = (board) => {
    function solve(board) {
      if (solved(board)) {
        return board;
      } else {
        const possibilities = nextBoards(board);
        const validBoards = keepOnlyValid(possibilities);
        return searchForSolution(validBoards);
      }
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
    return solve(board);
  };

  setEmptyBoard = () => {
    let board = this.emptyBoard.concat();
    this.setState({ board: board });
  };

  isSolveOnlyOne = (matrix) => {
    function mirrorMatrix(matrix) {
      return matrix
        .concat()
        .map((row) => row.concat().reverse())
        .reverse();
    }
    let board = matrix.concat();
    let mirrorBoard = mirrorMatrix(board);
    let firstSolve = this.solve(board);
    let secondSolve = this.solve(mirrorBoard);
    return firstSolve.join("") === mirrorMatrix(secondSolve).join("");
  };

  solveBoard = () => {
    let board = this.state.board.concat();
    this.setState({
      board: this.solve(board)
    });
  };

  handleCellChange = (e) => {
    let board = this.copyMatrix(this.state.board);
    let row = e.target.getAttribute("a-key").split(",")[0];
    let col = e.target.getAttribute("a-key").split(",")[1];
    board[row][col] = +e.target.value;
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

  prepareBoard = () => {
    let startingBoard = this.copyMatrix(this.state.solvedBoard);
    let lastStableX, lastStableY, savedCell;
    while (this.isSolveOnlyOne(startingBoard)) {
      let res = this.deleteRandomCell(startingBoard);
      startingBoard = res[0];
      lastStableX = res[1];
      lastStableY = res[2];
      savedCell = res[3];
    }
    startingBoard[lastStableX][lastStableY] = savedCell;
    this.setState({
      board: startingBoard,
      startingBoard: startingBoard
    });
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

  createNewPuzzle = () => {
    this.setState({
      board: this.basicBoard,
      solvedBoard: this.initializeBoard(),
      startingBoard: null,
      alert: null,
      solutionVisible: false
    });
  };

  render() {
    if (!this.state.startingBoard) {
      this.prepareBoard();
      return null;
    }
    const startingBoard = this.state.startingBoard;
    const board = this.state.solutionVisible
      ? this.state.solvedBoard
      : this.state.board;
    let disabled;
    const alert = this.state.alert;
    const tableStyle = {
      border: alert
        ? alert === "done"
          ? "5px solid green"
          : "5px solid red"
        : null
    };
    const toggleSolutionButtonText = this.state.solutionVisible
      ? "Hide solution"
      : "Show solution";

    return (
      <>
        <div className="sudoku">
          <div className="sudoku-buttons">
            <button onClick={this.checkSolution}>Check solution</button>
            <button onClick={this.toggleSolution}>
              {toggleSolutionButtonText}
            </button>
            <button onClick={this.createNewPuzzle}>Set new puzzle</button>
          </div>
          <table style={tableStyle}>
            <tbody>
              {board.map((row, rowIndex) => {
                return (
                  <tr className="sudoku-row">
                    {row.map((col, colIndex) => {
                      return (
                        <td className="sudoku-item">
                          {
                            (disabled =
                              board[rowIndex][colIndex] &&
                              board[rowIndex][colIndex] ===
                                startingBoard[rowIndex][colIndex])
                          }
                          <input
                            a-key={[rowIndex, colIndex]}
                            value={col ? col : ""}
                            onChange={this.handleCellChange}
                            disabled={disabled}
                          ></input>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
export default Sudoku;
