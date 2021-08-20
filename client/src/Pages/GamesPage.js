import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
import SudokuApi from '../components/SudokuApi';
import PwnzCard from '../components/PwnzCard';
import './GamesPage.css'
import TictactoeLogo from '../assets/tictactoe/tictactoeLogo.jpg'
import SudokuLogo from '../assets/sudoku/SudokuLogo.jpg'


const GamesPage = () => {
    const auth = useContext(AuthContext);
    const location = useLocation();
    const [game, setGame] = useState(location.game||null);

    const handleGamePick = (gameName) => {
        setGame(gameName);
    }
    const cancelGamePick = () => {
        setGame(null);
    }

    return (
        <>
            {game ?
                (<>



                    <div className='pwnz-button pwnz-m10 pwnz-fs25' >
                        <div onClick={cancelGamePick}>Back to the games list</div>
                    </div>

                    <div className='games-game'>
                        {game === 'Tictactoe' ?
                            <Tictactoe></Tictactoe>
                            : null}
                        {game === 'Sudoku' ?
                            <Sudoku></Sudoku>
                            : null}
                        {game === 'SudokuApi' ?
                            <SudokuApi></SudokuApi>
                            : null}
                    </div>
                </>)
                :
                (<>

                    <div className='services-header'>
                        <p className='pwnz-fs25 pwnz-t-c'>Games avaible</p>
                    </div>
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