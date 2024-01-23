import './styles/Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
import { useState } from 'react';

function navLogin(check) {
    if (check) {
        return (
            <li>
                Profile
            </li>
        );
    } else {
        return (
            <li>
                <NavLink to="/login">Login</NavLink>
            </li>
        );
    }
}

function testListener() {
    window.open("https://www.youtube.com/watch?v=e58hWzRS8iE")
}

function Navbar() {

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <nav className='navbar'>
            <div className='container'>
                <div className='logo' onClick={testListener}>
                    <img id='logo' src={logo} alt="Pothole Detector" />
                </div>
                <div className='navbarContent'>
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            Map
                        </li>
                        <li onClick={() => setLoggedIn(!loggedIn)}>
                            {/* temporary toggle for logged in state */}
                            Project
                        </li>
                        {navLogin(loggedIn)}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;