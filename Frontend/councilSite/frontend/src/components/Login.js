import './styles/Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    function toRegister() {
        navigate("/register");
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
                        <input type="text" id="username" name="username" className="Textfield"/><br/>
                        <label for="password">Password:</label><br/>
                        <input type="password" id="password" name="password" className="Textfield"/><br/>
                        <input type="button" value="Login" className="Login-button"/>
                        <input type="button" value="Register" className="Login-button" onClick={toRegister}/>
                    </form>
                </div>
            </div>
        </header>
    );
}

export default Login;