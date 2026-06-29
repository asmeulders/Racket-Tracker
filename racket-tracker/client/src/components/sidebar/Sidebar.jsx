import { NavLink } from 'react-router-dom';

import './Sidebar.css';

export const Sidebar = () => {

    return (
        <div className="sidebar">
            <NavLink to="/" end className="sidebar-logo" >Racket Tracker</NavLink>
            <NavLink to="/store" end className="sidebar-link" >Dashboard</NavLink>
            <NavLink to="/store/view-list/orders" className="sidebar-link">Orders</NavLink>
            <NavLink to="/store/view-list/rackets" className="sidebar-link">Rackets</NavLink>
            <NavLink to="/store/view-list/strings" className="sidebar-link">Strings</NavLink>
            <NavLink to="/store/view-list/brands" className="sidebar-link">Brands</NavLink>
            <NavLink to="/store/view-list/users" className="sidebar-link">Users</NavLink>
            <NavLink to="/store/view-list/inquiries" className="sidebar-link">Inquiries</NavLink>
            <NavLink to="/store/settings" className="sidebar-link">Settings</NavLink>
        </div>
    )
}