import React, {Component} from 'react';
import './Tictactoe.css';
import fanfare1 from '../assets/tictactoe/fanfare.png';
import fanfare2 from '../assets/tictactoe/fanfare2.png';


function Square (props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
      </button>
);
}

class Board extends Component {
  renderSquare(i) {
   return <Square
   value={this.props.squares[i]}
   onClick={()=>this.props.onClick(i)}
   />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Tictactoe extends Component {
  constructor (props) {
    super(props);
    this.state={
      history:[{
        squares:Array(9).fill(null),
      }],
      stepNumber:0,
      xIsNext:true,
      players:{
        true:'X-player',
        false:'O-player',
      },
    };
  }

  handleClick(i) {
    const history=this.state.history.slice(0,this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if (calculateWinner(squares)||squares[i]) {
      return;
    }
    squares[i]=this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history:history.concat([{
        squares:squares,
      }]),
      stepNumber:history.length,
      xIsNext: !this.state.xIsNext,
    });
  };

  jumpTo(step) {
    this.setState({
      stepNumber:step,
      xIsNext:(step%2)===0,
    });
  }

  updateFP (val) {
    let oldSP=this.state.players[false];
    this.setState({
      players:{
        true:val,
        false:oldSP,
      }
    });
  }

  updateSP (val) {
    let oldFP=this.state.players[true];
    this.setState({
      players:{
        true:oldFP,
        false:val,
      }
    });
  }

  render() {
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner=calculateWinner(current.squares);
    let opacity='opacity0';
    let status;
    const moves=history.map((step,move)=>{
      const desc= move ?
      'Go to move #'+move :
      'Go to game start';
      return (
        <li key={move}>
          <button onClick={()=>{
            this.jumpTo(move);
          }}>{desc}</button>
        </li>
      );
    });

  if (!moves) {
      status='Next player: '+(this.state.players[this.state.xIsNext]);
    } else if (winner) {
      status='Winner: '+ (winner==='X'? this.state.players[true]:this.state.players[false]);
    } else if (checkSquares(current.squares)){
     status='Tie';
      moves.splice(1,moves.length);
    } else {
      status='Next player: '+(this.state.players[this.state.xIsNext]);
    } 

    if (status&&status.includes('Winner')) opacity='opacity1';

    return (
      <div className="game tictactoe">
        <div>
         <div className='game-announcer'>
           <div><img 
            className={opacity}
            src={fanfare1}
            width={100}
            alt=''
            /></div>
           <p className='pwnz-fs25'>{status}</p>
           <div><img 
            className={opacity}
            src={fanfare2}
            width={100}
            alt=''
            /></div>
          </div>
        <div className='game-players'>
          <div>
            <p className='text-center'>X-player name:</p>
            <input defaultValue={this.state.players.true} onChange={event=>this.updateFP(event.target.value)}></input>
          </div>
          <div>
            <p className='text-center'>O-player name:</p>
            <input defaultValue={this.state.players.false} onChange={event=>this.updateSP(event.target.value)}></input>
          </div>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        </div>
        <div>
        <div className="moves">
          <ol>{moves}</ol>
        </div>
        </div>
      </div>
    );
  }
}

// ========================================



function calculateWinner(squares) {
const lines = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6],
];
for (let i=0;i<lines.length;i++) {
const [a,b,c]=lines[i];
if (squares[a]&&squares[a]===squares[b]&&squares[a]===squares[c]) {
 return squares[a];
}
}
return null;
}

function checkSquares(arr) {
 if (arr.concat().includes(null)) return false;
 return true;
}

export default Tictactoe;