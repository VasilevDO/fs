import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAge } from '../components/pwnz';

const BioPage = () => {
    const [mern, setMern] = useState('MERN');
    const toggleMern = () => {
        if (mern === 'MERN') {
            setMern('Mongo, Express, React, Node');
        } else {
            setMern('MERN');
        }
    }

    return (
        <div className='biopage-container'>
            <div className='aboutMe pwnz-m20 pwnz-p20'>
                <div className='pwnz-fs23 pwnz-bb-lightgray'>
                    <span>
                        Hello, my name is Dmitrii and Im an {getAge(new Date(1993, 2, 5))} years old web developer (beginner) from Saint-Petersburg, Russia.
                        <br />
                        Im glad to welcome you on my <span className='pwnz-clickable' onClick={toggleMern}>{mern}</span> stack project I made to learn something new.
                    </span>
                </div>
                <div>
                    <p>
                        Also Im trying to keep it useful, so there you can find some services/games I really use.
                        To check them please, visit the&nbsp;
                        <Link to={{ pathname: '/services' }}>services</Link>
                        &nbsp;and&nbsp;
                        <Link to={{ pathname: '/games' }}>games</Link> pages.
                        <br />
                        <span className='pwnz-fwb'>Note:</span> this project came up with some mixing (using both raw CSS and SASS for example), because
                        and I have to try a lot to find a better way. So you can find react class components mixed with react
                        functional components, react-redux connect mixed with react-redux hooks. And some duct tape.
                        <br />
                        There are services powered by 3rd party APIs and carefully stored using Redux:&nbsp;
                        <Link to={{ pathname: '/services/weather' }}>weather service</Link>,&nbsp;
                        <Link to={{ pathname: '/services/currency' }}>currency rates table</Link>,&nbsp;
                        <Link to={{ pathname: '/games/sudokuapi' }}>sudoku game</Link>.
                        <br />
                        <br />
                        Technologies/libraries used:
                        <ul className='default pwnz-mt0'>
                            <li>MongoDB</li>
                            <li>Express</li>
                            <li>React</li>
                            <li>Node</li>
                            <li>MaterializeCSS</li>
                            <li>SASS</li>
                            <li>Webpack</li>
                            <li>Redux</li>
                            <li>Jquery</li>
                        </ul>
                    </p>
                </div>
                <div className='pwnz-bt-lightgray'>
                    <p className='pwnz-m0'>
                        Feel free to leave some feedback so I can fix some bugs/process issues and make this project better.
                        <br />
                        Very appreciated.
                        <br />
                        Even if its short and offensive.
                    </p>
                </div>
            </div>
        </div>

    )
}

export default BioPage;