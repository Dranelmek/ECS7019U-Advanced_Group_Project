import './styles/Login.css';

function Login() {
    return (
        <header className="App-header">
            <div className="Page-title">
            <p className="Login-title">Pothole Detection</p>
            <p className="Login-subtitle">Login</p>
            </div>
            <div className="Login-form-container">
                <form className="Login-form">
                    <label for="username" >Username:</label><br/>
                    <input type="text" id="username" name="username" className="Textfield"/><br/>
                    <label for="password">Password:</label><br/>
                    <input type="password" id="password" name="password" className="Textfield"/><br/>
                    <input type="submit" value="Login" className="Login-button"/>
                </form>
            </div>
        </header>
    );
}

export default Login;