import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          Racket Tracker 🎾
        </NavLink>
        
        <ul className={"nav-menu"}>
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/brands"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Brands
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/strings"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Strings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/rackets"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Rackets
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                "nav-links" + (isActive ? " activated" : "")
              }
            >
              Orders
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;