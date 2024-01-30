import './styles/Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
import { useContext, useState } from 'react';
import { LoginContext } from './App';

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

    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    return (
        <nav className='navbar'>
            <div className='container'>
                <Link to='/' className='logo' onClick={testListener}>
                    <img id='logo' src={logo} alt="Pothole Detector" />
                </Link>
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
                            <NavLink to="/potholes">Potholes</NavLink>
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