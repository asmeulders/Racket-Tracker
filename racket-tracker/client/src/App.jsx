import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./index";
import Layout from './components/layout/Layout';
import { StoreDashboardPage } from './features/dashboard/StoreDashboardPage';
import { ViewItem } from './features/viewItem/ViewItem';
import './App.css'

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/store-dashboard" element={<StoreDashboardPage />} />
            <Route path="/view-item/:type/:id" element={<ViewItem />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App