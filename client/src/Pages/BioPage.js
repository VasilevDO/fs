import React, { useContext,useState} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAge} from '../components/pwnz';


const BioPage = () => {

    const auth = useContext(AuthContext); //const {token,userName}=useContext(AuthContext);

    const [mern,setMern]=useState('MERN');
    const toggleMern=()=>{
        if (mern==='MERN') {
            setMern('Mongo, Express, React, Node');
        } else {
            setMern('MERN');
        }
    }





    return (
            <div className='biopage-container'>
                <div className='aboutMe'>
                <p className='pwnz-p10 pwnz-m0'>
                    Hello, my name is Dmitrii and Im a {getAge(new Date(1993,2,5))} years old human being
                    <br/>
                    Im glad to welcome you on my <a className='pwnz-clickable' onClick={toggleMern}>{mern}</a> stack project I made to learn something new (fullstack). 
                    Also Im trying to keep it useful, so there you can find some services/games Im using on a daily basis.
                    <br/>
                    To check them please, visit
                    <Link to={{pathname:'/services'}}> services </Link> 
                     and  
                    <Link to={{pathname:'/games'}}> games </Link> pages.
                    <br/>
                    Some information:
                    <br/>
                    This project came up with some mixing technologies (using both raw CSS and SASS for example), because Im new to this big (for me) 
                    project and i have to try a lot to find the way that fits me. So you can find react class components mixing with some react
                    hooks. 
                    
                    <br/>
                    Please welcome to leave some feedback so I can fix some bugs/process issues and make this project better.
                    <br/>
                    Even if its short and offensive (like garbage).
                    <br/>

                    
                    There are services powered by 3rd party apis: 
                    <Link to={{pathname:'/services',service:'Weather'}}>Weather service</Link>, 
                    <Link to={{pathname:'/games',game:'SudokuApi'}}>Sudoku game</Link>.
                </p>
                </div>
                

            </div>

    )
}

export default BioPage;