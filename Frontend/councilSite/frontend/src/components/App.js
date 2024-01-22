import './styles/App.css';
import Navbar from './Navbar';
import Login from './Login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="login" element={<Login />} />
            
        </Routes>
      </div>
    </Router>
  );
}

export default App;
