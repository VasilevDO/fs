import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';


const HomePage=()=> {
    const {loading,request}=useHttp();
    const {token,userName}=useContext(AuthContext);

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
        <h1 className=''>Greetings, {userName}! There is my built-with-react part.<br>
               </br>
               Below you can find some interesting stuff.
             </h1>
        </>
    )
}

export default HomePage;