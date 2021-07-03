import React, { useContext} from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';


const HomePage=()=> {
    const {loading}=useHttp();//const {loading,request}=useHttp();
    const {userName}=useContext(AuthContext); //const {token,userName}=useContext(AuthContext);

    if (loading) {
        return <Loader/>
    }
     
    return (
        <>
        <h1 className=''>Greetings, {userName}! There is my built-with-react part.<br>
               </br>
               Below you can find some interesting stuff.
             </h1>
        </>
    )
}

export default HomePage;