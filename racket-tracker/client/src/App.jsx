import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./pages";
import Layout from './components/layout/Layout';
import { StoreDashboardPage } from './pages/store-dashboard/StoreDashboardPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/store-dashboard" element={<StoreDashboardPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App