import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
import PwnzCard from '../components/PwnzCard';
import './GamesPage.css'
import TictactoeLogo from '../assets/tictactoe/tictactoeLogo.jpg'
import SudokuLogo from '../assets/sudoku/SudokuLogo.jpg'

const HomePage=()=> {
    const {loading,request}=useHttp();
    const {token,userName}=useContext(AuthContext);
    const [game,setGame]=useState(null);

    const handleGamePick=(gameName)=> {
        setGame(gameName);
    }

    const cancelGamePick=()=>{
        setGame(null);
    }

    /*const fetchLinks=useCallback(async ()=> {
        try {
            const fetched=await request('/api/link','GET',null, {
                Authorization:`Bearer ${token}`
            });
            setLinks(fetched);
        } catch (e) {

        }
    },[token,request]);

    useEffect(()=>{
        fetchLinks()
    },[fetchLinks]);*/

    if (loading) {
        return <Loader/>
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
             <button onClick={cancelGamePick}>Back</button>
             <div className='games-game'>
             
             
             <Tictactoe></Tictactoe>
             </div>
             </>
             :null}



            {game==='Sudoku'?
            <>
            <button onClick={cancelGamePick}>Back</button>
            <div className='games-game'>
            

            <Sudoku></Sudoku>
            </div>
            </>
            :null}
                    </>
    )
}

export default HomePage;