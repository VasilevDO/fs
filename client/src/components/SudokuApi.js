import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Sudoku.css';
import { getApiBoard } from '../redux/sudokuApiActions';
import { SUDOKUAPI_GET_NEW_BOARD } from '../redux/types';


class SudokuApi extends Component {
  constructor() {
    super();
    this.state = {
      board: null,
      alert: null,
      solutionVisible: false,
      wrongCellsVisible: false,
      difficulty: 'medium'
    };
  }

  plugBoard = Array(9).fill(Array(9).fill(' '));

  createBoardDiv = (y, x, board) => {
    return [
      [board[y][x], board[y][x + 1], board[y][x + 2]],
      [board[y + 1][x], board[y + 1][x + 1], board[y + 1][x + 2]],
      [board[y + 2][x], board[y + 2][x + 1], board[y + 2][x + 2]]
    ];
  };

  copyMatrix = (matrix) => {
    let copy = matrix.map((row) => row.concat());
    return copy;
  };

  componentDidMount = async () => {
    this.props.getApiBoard(this.state.difficulty);
  }

  handleDifficultyChange = (e) => {
    this.setState({
      difficulty: e.target.value
    });
  };

  handleCellChange = (e) => {
    const board = this.copyMatrix(this.state.board || this.props.state.startingBoard);
    const row = e.target.getAttribute('a-key').split(',')[0];
    const col = e.target.getAttribute('a-key').split(',')[1];
    board[row][col] = +e.target.value.match(/\d*/g)[0];
    this.setState({
      board: board
    });
  };

  toggleSolution = () => {
    this.setState({
      solutionVisible: !this.state.solutionVisible
    });
  };

  checkSolution = () => {
    const board = this.state.board||this.props.state.startingBoard;
    const solution = this.props.state.solvedBoard;
    const alert = board.join('') === solution.join('') ? 'done' : 'error';
    this.setState({
      alert: alert
    });
    setTimeout(() => {
      this.setState({
        alert: null
      });
    }, 2000);
  };

  toggleWrongCells = () => {
    this.setState({
      wrongCellsVisible: !this.state.wrongCellsVisible
    });
  };

  render() {
    const reduxState = this.props.state;
    const processing = this.props.processing;
    const { difficulty, alert } = this.state;
    const startingBoard = reduxState.startingBoard || this.plugBoard;
    const solvedBoard = reduxState.solvedBoard || this.plugBoard;
    const board = this.state.board || startingBoard;
    const boardToShow = (this.state.solutionVisible ? solvedBoard : board) || this.plugBoard;
    let disabled, cellY, cellX, cellStyle;
    const sudokuBoardStyle = {
      backgroundColor: alert ? (alert === 'done' ? 'green' : 'red') : null
    };
    const toggleSolutionButtonText = this.state.solutionVisible
      ? 'Hide solution'
      : 'Show solution';
    const toggleWrongCells = this.state.wrongCellsVisible
      ? 'Hide wrong cells'
      : 'Show wrong cells';

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
      <div className='sudoku'>
        <div className='sudoku-buttons' style={sudokuBoardStyle}>
          <div className='sudoku-buttons-row'>
            <div className={'pwnz-button' + (processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-animatedLoading pwnz-button-disabled' : '')} >
              <div onClick={() => {
                this.setState({
                  board:null
                })
                this.props.getApiBoard(this.state.difficulty)
              }}>Get new puzzle</div>
            </div>
            <div>
              <select value={difficulty} onChange={this.handleDifficultyChange} className={(processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-button-disabled' : '')}>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
            </div>
          </div>
          <div className='sudoku-buttons-row'>
            <div className={'pwnz-button'+(processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-button-disabled' : '')}>
              <div onClick={this.checkSolution}>Check solution</div>
            </div>
            <div className={'pwnz-button'+(processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-button-disabled' : '')} >
              <div onClick={this.toggleSolution}>{toggleSolutionButtonText}</div>
            </div>
            <div className={'pwnz-button'+(processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-button-disabled' : '')} >
              <div onClick={this.toggleWrongCells}>{toggleWrongCells}</div>
            </div>
          </div>
        </div>
        <div className={'sudoku-board'+(processing.includes(SUDOKUAPI_GET_NEW_BOARD) ? ' pwnz-button-disabled' : '')}>
          {boardDivs.map((squaresRow, squaresRowIndex) => {
            return (
              <div className='sudoku-board-squares-row'>
                {squaresRow.map((square, squareIndex) => {
                  return (
                    <div className='sudoku-board-squares-row-square'>
                      {square.map((squareRow, squareRowIndex) => {
                        return (
                          <div className='sudoku-board-squares-row-square-row'>
                            {squareRow.map((cell, cellIndex) => {
                              cellY = squaresRowIndex * 3 + squareRowIndex;
                              cellX = squareIndex * 3 + cellIndex;
                              disabled =
                                cell && cell === startingBoard[cellY][cellX];

                              cellStyle = this.state.wrongCellsVisible
                                ? cell ===
                                  solvedBoard[cellY][cellX]
                                  ? null
                                  : { color: 'red' }
                                : null;
                              return (
                                <div className='sudoku-cell' key={cellY + cellX}>
                                  <input
                                    a-key={[cellY, cellX]}
                                    value={cell ? cell : ''}
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
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.sudokuApi,
    processing: state.app.processing
  }
}

const mapDispatchToProps = {
  getApiBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(SudokuApi);