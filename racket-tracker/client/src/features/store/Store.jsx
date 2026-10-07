import { Outlet } from 'react-router-dom';

import { Sidebar } from '../../components/sidebar/Sidebar';
import './Store.css';

export const Store = () => {
  return (
    <div className="store">
      <div className='store-sidebar'>
        <Sidebar />
      </div>
      <div className='store-content'>
        <Outlet />
      </div>
    </div>
  );
};