import { Outlet } from 'react-router-dom';

import { Sidebar } from '../../components/sidebar/Sidebar';
import './Store.css';

export const Store = () => {
  return (
    <div className="store-page">
        <Sidebar />
        <div className='store-page-content'>
          <Outlet />
        </div>
    </div>
  );
};