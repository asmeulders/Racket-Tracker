import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./index";
import Layout from './components/layout/Layout';
import { StoreDashboard } from './features/dashboard/components/StoreDashboard';
import { Store } from './features/store/Store';
import { ItemList } from './features/store';
import { ViewItem } from './features/viewItem/ViewItem';
import { NewItem } from './features/newItem/NewItem';
import { EditItem } from './features/editItem/EditItem';
import { StoreSettings } from './features/store/components/StoreSettings';
import './App.css'


function App() {
  const router = createBrowserRouter([
    {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "store",
        element: <Store />,
        children: [
          { index: true, element: <StoreDashboard /> },
          { path: "view-list/:type", element: <ItemList /> },
          { path: "view-item/:type/:id", element: <ViewItem /> },
          { path: "settings", element: <StoreSettings /> },
          { path: "new-item/:type", element: <NewItem /> },
          { path: "edit-item/:type/:id", element: <EditItem /> },
        ],
      },
    ],
  },
  ]);
  
  return <RouterProvider router={router} />;
}

export default App