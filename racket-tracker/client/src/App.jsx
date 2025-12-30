import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Navbar from './components/navbar/navbar';
import Home from "./pages";
import Dashboard from './pages/dashboard/dashboard';
import { BrandPage } from './pages/brand/BrandPage';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brands" element={<BrandPage />} />
        </Routes>
      </Router>
  )
}

export default App