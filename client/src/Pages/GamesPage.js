import React, {useState } from 'react';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
import SudokuApi from '../components/SudokuApi';
import PwnzCard from '../components/PwnzCard';
import './GamesPage.css'
import TictactoeLogo from '../assets/tictactoe/tictactoeLogo.jpg'
import SudokuLogo from '../assets/sudoku/SudokuLogo.jpg'


const GamesPage=()=> {
    const [game,setGame]=useState(null);

    const handleGamePick=(gameName)=> {
        setGame(gameName);
    }

    const cancelGamePick=()=>{
        setGame(null);
    }

     
    return (
        <>
        {game?
            (<>
            <button className='big-button' onClick={cancelGamePick}>Back to the games list</button>         
            <div className='games-game'>
                {game==='Tictactoe'? 
                    <Tictactoe></Tictactoe>
                    :null}
                {game==='Sudoku'?
                    <Sudoku></Sudoku>
                    :null}
                {game==='SudokuApi'?
                    <SudokuApi></SudokuApi>
                    :null}
            </div>
            </>)
            :            
            (<>
            <h1>Games avaible:</h1>
            <div className='games-container'>
                <PwnzCard
                cardTitle="Tictactoe"
                cardDescription="Just a classic tictactoe game"
                buttonHandler={handleGamePick}
                logo={TictactoeLogo}
                buttonText="Play"></PwnzCard>
                
                <PwnzCard
                cardTitle="Sudoku"
                cardDescription="Simple sudoku with Math.random() based generator"
                buttonHandler={handleGamePick}
                logo={SudokuLogo}
                buttonText="Play"></PwnzCard>

                <PwnzCard
                cardTitle="SudokuApi"
                cardDescription="Sudoku with 3rd party generator (api)"
                buttonHandler={handleGamePick}
                logo={SudokuLogo}
                buttonText="Play"></PwnzCard>
            </div>
            </>)}
        </>
    )
}

export default GamesPage;