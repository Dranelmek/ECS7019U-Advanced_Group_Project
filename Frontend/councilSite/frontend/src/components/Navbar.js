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

function projectLink() {
    window.open("https://github.com/Dranelmek/ECS7019U-Advanced_Group_Project")
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
                        <li onClick={() => setLoggedIn(!loggedIn)}>
                            {/* temporary toggle for logged in state */}
                            Map
                        </li>
                        <li>
                            Potholes
                        </li>
                        <li>
                            <Link to="/" onClick={projectLink}>Project</Link>
                        </li>
                        {navLogin(loggedIn)}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;