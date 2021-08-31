import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import WeatherTable from '../components/WeatherTable';
import Currency from '../components/Currency';
import './HomePage.css';
import Todolist from '../components/Todolist';
import PwnzBlog from '../components/PwnzBlog';

const HomePage = () => {
    const auth = useContext(AuthContext); //const {token,userName}=useContext(AuthContext);

    return (
        <>
            <div className='homepage-container'>
                <div className='pwnz-blog'>
                    <PwnzBlog user={auth} />
                </div>
                <div className='pwnz-widgets'>
                    <WeatherTable user={auth} format='micro' />
                    <Currency user={auth} />
                    <Todolist user={auth} format='mini' />
                </div>
            </div>
        </>
    )
}

export default HomePage;