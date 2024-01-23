import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import Home from './Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
            
        </Routes>
      </div>
    </Router>
  );
}

export default App;
