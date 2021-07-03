import React, {useState } from 'react';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
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
           
            null:
            <>
            
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
             cardDescription="Fresh sudoku game never dissapoints"
             buttonHandler={handleGamePick}
             logo={SudokuLogo}
             buttonText="Play"></PwnzCard>
        </div>
        </>
        } 
       
             {game==='Tictactoe'?
             <>
             <button className='big-button' onClick={cancelGamePick}>Back to the games list</button>
             <div className='games-game'>
             
            
             <Tictactoe></Tictactoe>
             </div>
             </>
             :null}



            {game==='Sudoku'?
            <>
            
             <button className='big-button' onClick={cancelGamePick}>Back to the games list</button>
            <div className='games-game'>
            <Sudoku></Sudoku>
            </div>
            </>
            :null}
                    </>
    )
}

export default GamesPage;