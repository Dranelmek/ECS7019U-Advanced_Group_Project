import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Potholes from './Potholes';
import Register from './Register';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, useContext, createContext } from 'react';

export const LoginContext = createContext()

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div className="App">
        <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/potholes" element={<Potholes />} />
              
          </Routes>
        </LoginContext.Provider>
        
      </div>
    </Router>
  );
}

export default App;
