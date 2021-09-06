import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
import SudokuApi from '../components/SudokuApi';
import PwnzCard from '../components/PwnzCard';
import TictactoeLogo from '../assets/tictactoe/tictactoeLogo.jpg'
import SudokuLogo from '../assets/sudoku/SudokuLogo.jpg'


const GamesPage = () => {
    const { game } = useParams();
    const history = useHistory();

    const handleGamePick = (gameName) => {
        history.push(`/games/${gameName.toLowerCase()}`);
    }
    const cancelGamePick = () => {
        history.push(`/games`)
    }

    return (
        <div className='gamespage-container'>
            {game ?
                (<>
                    <div>
                        <div className='pwnz-button pwnz-m10 pwnz-fs25' >
                            <div onClick={cancelGamePick}>Back to the games list</div>
                        </div>
                    </div>
                    <div className='games-game'>
                        {game === 'tictactoe' ?
                            <Tictactoe></Tictactoe>
                            : game === 'sudoku' ?
                                <Sudoku></Sudoku>
                                : game === 'sudokuapi' ?
                                    <SudokuApi></SudokuApi>
                                    :
                                    <p className='pwnz-fs25'>No game found</p>}
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
                            cardDescription="Sudoku with 3rd party generator, powered by SuGoku (github.com /bertoort/sugoku)"
                            buttonHandler={handleGamePick}
                            logo={SudokuLogo}
                            buttonText="Play"></PwnzCard>
                    </div>
                </>)}
        </div>
    )
}

export default GamesPage;