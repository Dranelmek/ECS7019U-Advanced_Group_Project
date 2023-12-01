import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <div className="Page-title">
          <p className="Login-title">Pothole Detection</p>
          <p className="Login-subtitle">Login</p>
        </div>
        
        <Login />
      </header>
    </div>
  );
}

export default App;
