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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brands" element={<BrandPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/strings" element={<StringPage />} />
          <Route path="/rackets" element={<RacketPage />} />
          <Route path="/orders" element={<OrderPage />} />
        </Routes>
      </Router>
  )
}

export default App