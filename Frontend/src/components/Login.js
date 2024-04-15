import { useState, useContext } from 'react';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { APILINK, LoginContext, UserContext } from './App';



function Login() {
/**
 * Login form for council members' staff access.
 */

    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [globalUser, setGUser] = useContext(UserContext);

    // login handling.
    async function loginRequest() {
        const payload = {
            username: user,
            password: pass
        }
        const jsonData = JSON.stringify(payload)
        const loc = `${APILINK}user/login`
        const settings = {
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            method: 'POST',
            body: jsonData
        };
        try {
            const fetchResponse = await fetch(loc, settings);
            const data = await fetchResponse.json();
            console.log(data.isAdmin);
            if (data.username) {
                window.alert(`Successfully logged in!`);
                login(data)
            } else {
                window.alert(`Something went wrong!`);
            }
            
        } catch (e) {
            window.alert(e)
        }
    }
    function login(userdata) {
        setGUser(userdata)
        setLoggedIn(true)
        navigate("/")
    }

    return (
        <header className="Login-header">
            <div className='Login-container'>
                <div className="Page-title">
                <p className="Login-title">Pothole Detection</p>
                <p data-testid="Login-subtitle" className="Login-subtitle">Login</p>
                </div>
                <div className="Login-form-container">
                    <form data-testid="Login-form" className="Login-form" method='post'>
                        <label htmlFor="username" >Username:</label><br/>
                        <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="Textfield"/><br/>
                        <label htmlFor="password">Password:</label><br/>
                        <input 
                        data-testid="password"
                        type="password" 
                        id="password" 
                        name="password" 
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="Textfield"/><br/>
                        <input type="button" value="Login" className="Login-button" onClick={loginRequest}/>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default Login;