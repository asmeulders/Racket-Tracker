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
            <Route path="/view-order/:orderId" element={<OrderPage />} />
            <Route path="/view-racket/:racketId" element={<RacketPage />} />
            <Route path="/view-string/:stringId" element={<StringPage />} />
            <Route path="/view-user/:userId" element={<UserPage />} />
            <Route path="/view-brand/:brandId" element={<BrandPage />} />
            <Route path="/view-inquiry/:inquiryId" element={<InquiryPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App