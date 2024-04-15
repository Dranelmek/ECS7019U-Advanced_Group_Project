import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import Potholes from './Potholes';
import AddPothole from './AddPothole';
import Register from './Register';
import PotholeMap from './PotholeMap';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { useState, createContext, useEffect } from 'react';
import { CookiesProvider, useCookies } from "react-cookie";

export const LoginContext = createContext()
export const UserContext = createContext()
export const PotholeContext = createContext()

// Change this variable to the hosted domain of the API. 
export const APILINK = "http://localhost:8800/"

function App() {
/**
 * Parent component that contains the router to switch between sub components.
 * Sets up cookies for logged in sessions.
 */

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: "No User"});
  const [cookies, setCookie] = useCookies(["activeUser", "login"])
  const [potholeList, setPotholeList] = useState([0])

  // Cookies setup.
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

  // Request pothole list from API.
  useEffect(() => {
    const  fetchPotholes = async () => {
        const response = await fetch(
            `${APILINK}pothole`,
            {
                method: 'GET'
            }
        )
        const data = await response.json()
        setPotholeList(data)
    }
    fetchPotholes()
  }, []);
  
  return (
    <CookiesProvider>
      <Router>
        <div className="App">
        
          <UserContext.Provider value={[user, setUser]}>
          <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
          <PotholeContext.Provider value={[potholeList, setPotholeList]}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/potholes" element={<Potholes />} />
              <Route path="/map" element={<PotholeMap />}/>
              <Route path="/add_pothole" element={<AddPothole />} />
            </Routes>
          </PotholeContext.Provider>
          </LoginContext.Provider>
          </UserContext.Provider>
          
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
