import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Navbar from './components/navbar/navbar';
import Home from "./pages";
import Dashboard from './pages/dashboard/dashboard';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
        </Routes>
      </Router>
  )
}

export default App