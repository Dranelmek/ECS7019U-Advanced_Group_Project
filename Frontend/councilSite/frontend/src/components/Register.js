import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function Register() {

    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [conf, setConf] = useState("");

    function handleLogin() {
        if (user.length > 0) {
            if (pass.length <= 0) {
                window.alert("Please select a password")
            } else if (pass === conf) {
                window.alert("Account created")
                navigate("/login")
            } else {
                window.alert("Password must match")
            }
        } else {
            window.alert("Please enter a username")
        }
        
    }

    return (
        <header className="Login-header">
            <div className="Page-title">
            <p className="Login-title">Pothole Detection</p>
            <p className="Login-subtitle">Register</p>
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
                    <label for="confirm">Confirm Password:</label><br/>
                    <input 
                    type="password" 
                    id="confirm" 
                    name="confirm" 
                    value={conf}
                    onChange={(e) => setConf(e.target.value)}
                    className="Textfield"/><br/>
                    <input type="button" value="register" className="Login-button" onClick={handleLogin}/>
                </form>
            </div>
        </header>
    );
}

export default Register;