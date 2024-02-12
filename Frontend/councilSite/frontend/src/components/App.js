import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Potholes from './Potholes';
import Register from './Register';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, useContext, createContext } from 'react';

export const LoginContext = createContext()
export const UserContext = createContext()
export const APILINK = "http://localhost:8800/"

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: "No User"});

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={[user, setUser]}>
        <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/potholes" element={<Potholes />} />
          </Routes>
        </LoginContext.Provider>
        </UserContext.Provider>
        
      </div>
    </Router>
  );
}

export default App;
