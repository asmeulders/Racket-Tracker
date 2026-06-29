import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./index";
import Layout from './components/layout/Layout';
import { StoreDashboard } from './features/dashboard/components/StoreDashboard';
import { Store } from './features/store/Store';
import { ItemList } from './features/store';
import { ViewItem } from './features/viewItem/components/ViewItem';
import { StoreSettings } from './features/store/components/StoreSettings';
import './App.css'


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
          </Route>
          <Route path="/store" element={<Store />}>
            <Route index element={<StoreDashboard />} />
            <Route path="view-list/:type" element={<ItemList />} />
            <Route path="view-item/:type/:id" element={<ViewItem />} /> 
            <Route path="settings" element={<StoreSettings />} /> 
          </Route>
        </Routes>
      </Router>
  )
}

export default App