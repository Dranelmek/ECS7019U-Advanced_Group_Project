import { useState, useContext } from 'react';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { APILINK, LoginContext, UserContext } from './App';



function Login() {

    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [globalUser, setGUser] = useContext(UserContext);

    function toRegister() {
        navigate("/register");
    }

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
                <p className="Login-subtitle">Login</p>
                </div>
                <div className="Login-form-container">
                    <form className="Login-form" method='post'>
                        <label for="username" >Username:</label><br/>
                        <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="Textfield"/><br/>
                        <label for="password">Password:</label><br/>
                        <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        className="Textfield"/><br/>
                        <input type="button" value="Login" className="Login-button" onClick={loginRequest}/>
                        <input type="button" value="Register" className="Login-button" onClick={toRegister}/>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default Login;