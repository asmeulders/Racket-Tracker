import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Navbar from './components/navbar/navbar';
import Home from "./pages";
import { StoreDashboardPage } from './pages/store-dashboard/StoreDashboardPage';
import { BrandPage } from './pages/brand/BrandPage';
import { UserPage } from './pages/users/UserPage';
import { StringPage } from './pages/strings/StringPage';
import { RacketPage } from './pages/rackets/RacketPage';
import { OrderPage } from './pages/orders/OrderPage';

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/store-dashboard" element={<StoreDashboardPage />} />
        </Routes>
      </Router>
  )
}

export default App