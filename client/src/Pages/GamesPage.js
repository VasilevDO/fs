import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import Tictactoe from '../components/Tictactoe';
import Sudoku from '../components/Sudoku';
import PwnzCard from '../components/PwnzCard';
import './GamesPage.css'

const HomePage=()=> {
    const {loading,request}=useHttp();
    const {token,userName}=useContext(AuthContext);
    const [game,setGame]=useState(null);

    const handleGamePick=(e)=> {
        console.log(e.target.innerText);
        let gameName=e.target.innerText.split(' ')[1];
        gameName=gameName.slice(0,1).toUpperCase()+gameName.slice(1);
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
        <h1>Games list:</h1>
        <div className='games-container'>
            <PwnzCard
             cardTitle="Tictactoe"
             cardDescription="Just a classic tictactoe game"
             buttonHandler={this.handleGamePick}
             buttonText="Play"></PwnzCard>
                <button onClick={handleGamePick}>Play tictactoe</button>
            <PwnzCard
             cardTitle="Sudoku"
             cardDescription="Fresh sudoku game never dissapoints"
             buttonHandler={this.handleGamePick}
             buttonText="Play"></PwnzCard>
                <button onClick={handleGamePick}>Play sudoku</button>
        </div>
        </>
        } 
       
             {game==='Tictactoe'?
             <>
             <button onClick={cancelGamePick}>Back</button>
             
             <Tictactoe></Tictactoe>
             </>
             :null}



            {game==='Sudoku'?
            <>
            <button onClick={cancelGamePick}>Back</button>

            <Sudoku></Sudoku>
            </>
            :null}
                    </>
    )
}

export default HomePage;