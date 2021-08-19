import React, {useContext} from 'react';
import {NavLink,useHistory} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
    const history=useHistory();
    const auth=useContext(AuthContext);
    const logoutHandler =(e) => {
      e.preventDefault();
      auth.logout();
      history.push('/');
    }

    return (
        <nav>
            <div className='nav-wrapper blue darken-1 pwnz-navbar' style={{padding:'0 2rem'}}>
                <span className='brand-logo'>pwnzforever/{auth.userName}</span>
                <ul id='nav-mobile' className='right hide-on-med-and-down'>
                    <li><NavLink to='/home'>Home</NavLink></li>
                    <li><NavLink to='/services'>Services</NavLink></li>
                    <li><NavLink to='/games'>Games</NavLink></li>
                    <li><NavLink to='/bio'>Bio</NavLink></li> 
                    <li><a href='/' onClick={logoutHandler}>Logout</a></li>
                </ul>
            </div>

        </nav>

    )
}