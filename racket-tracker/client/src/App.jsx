import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./index";
import Layout from './components/layout/Layout';
import { StoreDashboardPage } from './features/dashboard/StoreDashboardPage';
import { OrderPage } from './features/order/OrderPage';
import { RacketPage } from './features/racket/RacketPage';
import { StringPage } from './features/string/StringPage';
import { UserPage } from './features/user/UserPage';
import { BrandPage } from './features/brand/BrandPage';
import { InquiryPage } from './features/inquiry/InquiryPage';
import './App.css'

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/store-dashboard" element={<StoreDashboardPage />} />
            <Route path="/edit-order/:orderId" element={<OrderPage />} />
            <Route path="/edit-racket/:racketId" element={<RacketPage />} />
            <Route path="/edit-string/:stringId" element={<StringPage />} />
            <Route path="/edit-user/:userId" element={<UserPage />} />
            <Route path="/edit-brand/:brandId" element={<BrandPage />} />
            <Route path="/edit-inquiry/:inquiryId" element={<InquiryPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App