import React, { useContext } from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import WeatherTable from '../components/WeatherTable';
import './HomePage.css';
import Todolist from '../components/Todolist';
import PwnzGallery from '../components/PwnzGallery';
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
                    <Todolist user={auth} format='mini' />
                </div>
            </div>
        </>
    )
}

export default HomePage;