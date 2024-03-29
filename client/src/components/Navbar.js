import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const logoutHandler = (e) => {
        e.preventDefault();
        auth.logout();
        history.push('/');
    }

    return (
        <nav className='pwnz-nav'>
            <div className='nav-wrapper blue darken-1 pwnz-nav-wrapper'>
                <span className='brand-logo'>pwnzforever/{auth.userName}</span>
                <ul id='nav-mobile' className='right hide-on-med-and-down'>
                    <li><NavLink to='/home'>Home</NavLink></li>
                    <li><NavLink to='/services'>Services</NavLink></li>
                    <li><NavLink to='/games'>Games</NavLink></li>
                    <li><NavLink to='/bio'>Bio</NavLink></li>
                    <li><a href='/' onClick={logoutHandler}>Logout</a></li>
                </ul>
            </div>
            <div className='pwnz-button pwnz-40x40 pwnz-scrollTopButton pwnz-fs25 pwnz-d-n' >
                <div className='pwnz-scrollTop0 pwnz-p0'>↑</div>
            </div>
        </nav>
    )
}