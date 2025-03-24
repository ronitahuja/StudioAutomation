import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DarwinboxLogo from "../assets/darwinboxlogo.png";

const Header = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    const user = Cookies.get("firstName");
    if (user) {
      setUsername(user);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("email");
    Cookies.remove("id");
    Cookies.remove("token"); // Remove auth token if stored
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 h-16 px-12 w-full shadow-md text-white flex items-center justify-between">
      {/* Left Side - Logo & Navigation */}
      <div className="flex items-center gap-6">
        <NavLink to="/">
          <div className="text-lg h-16 flex items-center bg-white font-bold">
            <img src={DarwinboxLogo} />
          </div>
        </NavLink>

        <div className="flex gap-6">
          <NavLink
            to="/app"
            className={({ isActive }) =>
              `hover:text-gray-300 ${isActive ? "font-bold text-gray-200" : ""}`
            }
          >
            Application
          </NavLink>

          <NavLink
            to="/appActions"
            className={({ isActive }) =>
              `hover:text-gray-300 ${isActive ? "font-bold text-gray-200" : ""}`
            }
          >
            App Actions
          </NavLink>
        </div>
      </div>

      {/* Right Side - User Info & Logout (Only if user is logged in) */}
      {token && (
        <div className="flex items-center gap-4">
          {username && <span className="font-semibold">Hello, {username}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
