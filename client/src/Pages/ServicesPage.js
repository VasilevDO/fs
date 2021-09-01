import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PwnzCard from '../components/PwnzCard';
import Calculator from '../components/Calculator';
import PwnzGallery from '../components/PwnzGallery';
import WeatherTable from '../components/WeatherTable';
import Todolist from '../components/Todolist';
import ReduxSample from '../components/ReduxSample'
import Currency from '../components/Currency';
import { AuthContext } from '../context/AuthContext';
import './ServicesPage.css'

import galleryPNG from '../assets/gallery.png';
import calculatorPNG from '../assets/calculator.png';
import weatherPNG from '../assets/weather.png';
import todolistPNG from '../assets/todolist.png';
import reduxPng from '../assets/redux.png';
import currencyPng from '../assets/currency.png'

const ServicesPage = () => {
    const auth = useContext(AuthContext);
    const { service } = useParams();
    const history = useHistory();

    const handlePick = async (serviceName) => {
        history.push(`/services/${serviceName.toLowerCase()}`)
    }
    const cancelPick = () => {
        history.push(`/services`)
    }

    return (
        <>
            {service ?
                (<>
                    <div className='pwnz-button pwnz-m10 pwnz-fs25' >
                        {<div onClick={cancelPick}>Back to the services list</div>}
                    </div>

                    <div className='services-container'>
                        {service === 'calculator' ?
                            <Calculator></Calculator>
                            : service === 'gallery' ?
                                <PwnzGallery user={auth}></PwnzGallery>
                                : service === 'weather' ?
                                    <WeatherTable user={auth} />
                                    : service === 'todolist' ?
                                        <Todolist user={auth} />
                                        : service === 'redux' ?
                                            <ReduxSample user={auth} />
                                            : service === 'currency' ?
                                                <Currency user={auth} />
                                                :
                                                <p className='pwnz-fs25'>No service found</p>}
                    </div>
                </>)
                :
                (<>
                    <div className='services-header'>
                        <p className='pwnz-fs25 pwnz-t-c'>Services available</p>
                    </div>

                    <div className='services-container'>
                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Todolist"
                                cardDescription="To-do list helps you to know whats next"
                                buttonHandler={handlePick}
                                logo={todolistPNG}
                                buttonText="Open weather table"></PwnzCard>
                        </div>
                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Weather"
                                cardDescription="Weather table for 2 days powered by openweathermap"
                                buttonHandler={handlePick}
                                logo={weatherPNG}
                                buttonText="Open weather table"></PwnzCard>
                        </div>
                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Gallery"
                                cardDescription="Your personal images gallery designed to save your best moments"
                                buttonHandler={handlePick}
                                logo={galleryPNG}
                                buttonText="Open gallery"></PwnzCard>
                        </div>

                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Calculator"
                                cardDescription="Calculator designed by mad scientist only for personal use"
                                buttonHandler={handlePick}
                                logo={calculatorPNG}
                                buttonText="Open calculator"></PwnzCard>
                        </div>
                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Redux"
                                cardDescription="My first meeting with Redux state container (react-redux connect). There you can add some strings and nothing more"
                                buttonHandler={handlePick}
                                logo={reduxPng}
                                buttonText="Open redux sample"></PwnzCard>
                        </div>
                        <div className='pwnz-m10'>
                            <PwnzCard
                                cardTitle="Currency"
                                cardDescription="Currency table build with Redux state container (react-redux connect), powered by Fixer.io"
                                buttonHandler={handlePick}
                                logo={currencyPng}
                                buttonText="Open currency table"></PwnzCard>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default ServicesPage;