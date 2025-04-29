import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LuLogOut } from "react-icons/lu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const capitalizeName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        logout();
        navigate("/");
      } else {
        console.error("Logout failed on server.");
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <Link to="/search" className="text-white text-xl font-bold">
          Fetch Dogs
        </Link>

        <Link to="/favorites" className="text-white hover:text-gray-200">
          Favorites
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-white">
                Welcome, {capitalizeName(user.name)}
              </span>
              <button
                onClick={handleLogout}
                className="text-white px-2 py-2 rounded-md hover:bg-blue-300"
                disabled={isLoggingOut}
              >
                <LuLogOut />
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
