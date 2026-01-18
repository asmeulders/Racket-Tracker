import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./index";
import Layout from './components/layout/Layout';
import { StoreDashboardPage} from "./components/dashboard/StoreDashboardPage"
import { EditOrderPage } from './components/order/OrderPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/store-dashboard" element={<StoreDashboardPage />} />
            <Route path="/edit-order/:id" element={<EditOrderPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App