import React from 'react';
import { NavLink } from 'react-router-dom';
import DarwinboxLogo from '../assets/darwinboxlogo.png';

const Header = () => {
  return (
    <nav className="bg-blue-600 h-16 px-12 w-full shadow-md text-white flex items-center gap-6">
      {/* Logo */}
      <NavLink to="/">
      <div className="text-lg h-16 flex items-center bg-white font-bold">
        <img src={DarwinboxLogo} />
      </div>
      </NavLink>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <NavLink
          to="/app"
          className={({ isActive }) =>
            `hover:text-gray-300 ${isActive ? 'font-bold text-gray-200' : ''}`
          }
        >
          Application
        </NavLink>

        <NavLink
          to="/appActions"
          className={({ isActive }) =>
            `hover:text-gray-300 ${isActive ? 'font-bold text-gray-200' : ''}`
          }
        >
          App Actions
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
