import './styles/Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import logo from './assets/logo.jpg';
import { useContext, useState } from 'react';
import { LoginContext, UserContext } from './App';

function testListener() {
    window.open("https://www.youtube.com/watch?v=e58hWzRS8iE")
}

function projectLink() {
    window.open("https://github.com/Dranelmek/ECS7019U-Advanced_Group_Project")
}

function Navbar() {

    const loggedIn = useContext(LoginContext)[0];
    const user = useContext(UserContext)[0];

    function displayUser() {
        window.alert(`Logged in as ${user.username}`)
    }

    function navLogin(check) {
        if (check) {
            return (
                <li onClick={displayUser}>
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
                        <li>
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