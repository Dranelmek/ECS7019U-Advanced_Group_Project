import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APILINK } from './App';
import axios from "axios";
import './styles/Register.css';


function Register() {

    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [conf, setConf] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [lName, setLName] = useState("");

    function handleLogin() {
        if (user.length <= 0 || email.length <= 0 || name.length <= 0 || lName.length <= 0) {
            window.alert("Please enter all values")
        } else {
            
            if (pass.length <= 0) {
                window.alert("Please select a password")
            } else if (pass === conf) {
                createUser()
                navigate("/login")
            } else {
                window.alert("Password must match")
            }
        }
        
    }

    async function createUser() {
        const loc = `${APILINK}user/addStaff`;
        const fullData = {
            'username': user,
            'password': pass,
            'user_first_name': name,
            'user_last_name': lName,
            'email': email
        }
        const jsonData = JSON.stringify(fullData)
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
            window.alert("Account created!")
            return data;
        } catch (e) {
            window.alert(e)
            return e;
        }
    }

    return (
        <header className="Register-header">
            <div className='Register-container'>
                <div className="Page-title">
                <p className="Register-title">Pothole Detection</p>
                <p className="Register-subtitle">Register</p>
                </div>
                <div className="Register-form-container">
                    <form className="Register-form" method='post'>
                        <label for="username" >Username:</label><br/>
                        <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        className="Textfield"/><br/>
                        <label for="email">Email:</label><br/>
                        <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="Textfield"/><br/>
                        <label for="first-name">First Name:</label><br/>
                        <input 
                        type="text" 
                        id="first-name" 
                        name="first-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="Textfield"/><br/>
                        <label for="last-name">Last Name:</label><br/>
                        <input 
                        type="text" 
                        id="last-name" 
                        name="last-name" 
                        value={lName}
                        onChange={(e) => setLName(e.target.value)}
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
                        <input type="button" value="Register" className="Register-button" onClick={handleLogin}/>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default Register;