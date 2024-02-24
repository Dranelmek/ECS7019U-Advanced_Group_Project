import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Potholes from './Potholes';
import AddPothole from './AddPothole';
import Register from './Register';
import PotholeMap from './PotholeMap';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, useContext, createContext, useEffect } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";

export const LoginContext = createContext()
export const UserContext = createContext()
export const APILINK = "http://localhost:8800/"

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: "No User"});
  const [cookies, setCookie] = useCookies(["activeUser", "login"])

  useEffect(() => {
    setCookie("activeUser", user, {path: "/"});
    setCookie("login", loggedIn, {path: "/"});
  }, [loggedIn]);

  useEffect(() => {
    if (cookies.login == null) {
      setCookie("activeUser", user, {path: "/"});
      setCookie("login", loggedIn, {path: "/"});
    } else {
      setUser(cookies.activeUser);
      setLoggedIn(cookies.login);
    }
  }, []);
  
  return (
    <CookiesProvider>
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
              <Route path="/map" element={<PotholeMap />}/>
              <Route path="/add_pothole" element={<AddPothole />} />
            </Routes>
          </LoginContext.Provider>
          </UserContext.Provider>
          
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
