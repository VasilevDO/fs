import React, { useContext} from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAge} from '../components/pwnz';


const BioPage = () => {

    const auth = useContext(AuthContext); //const {token,userName}=useContext(AuthContext);







    return (
            <div className='biopage-container'>
                <div className='aboutMe'>
                <span>Hello, my name is Dmitrii and im a {getAge(new Date(1993,2,5))} years old human being
                <br/>
                I can work with api: <Link to={{pathname:'/services',service:'Weather'}}>Weather service</Link>, <Link to={{pathname:'/games',game:'SudokuApi'}}>Sudoku game</Link>
                </span>
                
                
                <span></span>
                </div>
                

            </div>

    )
}

export default BioPage;