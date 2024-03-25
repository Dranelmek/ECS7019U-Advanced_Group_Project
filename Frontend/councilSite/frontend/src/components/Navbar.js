import './styles/Navbar.css';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.jpg';
import { useContext, useState } from 'react';
import { LoginContext, UserContext } from './App';

function testListener() {
    window.open("https://www.youtube.com/watch?v=e58hWzRS8iE")
}

function projectLink() {
    window.open("https://github.com/Dranelmek/ECS7019U-Advanced_Group_Project/tree/full")
}

function Navbar() {

    const [profileTrigger, setProfileTrigger] = useState(false);
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [user, setUser] = useContext(UserContext);

    function navLogin(check) {
        if (check) {
            return (
                <li onClick={() => setProfileTrigger(!profileTrigger)}>
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

    function display(bool) {
        if (bool) {
            return "profile-tab seen"
        } else {
            return "profile-tab unseen"
        }
    }

    function logout() {
        setUser({username: "No User"})
        setLoggedIn(false)
        setProfileTrigger(false)
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
                            <NavLink to="/map">Map</NavLink>
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
            <div className={display(profileTrigger)}>
                    <p className='active-user'>Logged in as: <br/> {user.username}</p>
                    <span className='logout-button' onClick={logout}>Log out</span>
            </div>
        </nav>
    );
}

export default Navbar;