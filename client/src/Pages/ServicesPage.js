import React, {useState,useContext } from 'react';
import PwnzCard from '../components/PwnzCard';
import Calculator from '../components/Calculator';
import PwnzGallery from '../components/PwnzGallery';
import WeatherTable from '../components/WeatherTable';
import Todolist from '../components/Todolist';

import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

import './ServicesPage.css'


import galleryPNG from '../assets/gallery.png';
import calculatorPNG from '../assets/calculator.png';
import weatherPNG from '../assets/weather.png';
import todolistPNG from '../assets/todolist.png';


const ServicesPage=()=> {
    const auth = useContext(AuthContext);
    const [service,setService]=useState(null);
    const {loading,request}=useHttp();
    const [galleryImages,setGalleryImages]=useState(null);




    const handlePick= async (serviceName)=> {
        setService(serviceName);
    }

    const cancelPick=()=>{
        setService(null);
    }


    return (
        <>
        {service?
            (<>
            <button className='big-button' onClick={cancelPick}>Back to the services list</button>   
            <div className='services-container'>
                {service==='Calculator'? 
                    <Calculator></Calculator>
                    :null}
                {service==='Gallery'?
                    <PwnzGallery user={auth}></PwnzGallery>:null
                }
                {service==='Weather'?
                    <WeatherTable user={auth}/>
                :null}
                {service==='Todolist'?
                    <Todolist user={auth}/>
                :null}
            </div>
            </>)
            :            
            (<>
                <h1>Services avaible:</h1>
                <div className='services-container'>
                    <PwnzCard
                     cardTitle="Todolist"
                     cardDescription="To-do list helps you to know whats next"
                     buttonHandler={handlePick}
                     logo={todolistPNG}
                     buttonText="Open weather table"></PwnzCard>

                    <PwnzCard
                     cardTitle="Weather"
                     cardDescription="Weather table for 2 days powered by openweathermap"
                     buttonHandler={handlePick}
                     logo={weatherPNG}
                     buttonText="Open weather table"></PwnzCard>

                    <PwnzCard
                     cardTitle="Gallery"
                     cardDescription="Your personal images gallery designed to save your best moments"
                     buttonHandler={handlePick}
                     logo={galleryPNG}
                     buttonText="Open gallery"></PwnzCard>
                     
                    <PwnzCard
                     cardTitle="Calculator"
                     cardDescription="Calculator designed by mad scientist only for personal use"
                     buttonHandler={handlePick}
                     logo={calculatorPNG}
                     buttonText="Open calculator"></PwnzCard>
                </div>
                </>)}
        </>
    )
}

export default ServicesPage;