import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineXMark } from "react-icons/hi2";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const capitalizeName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

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
        alert("Logout failed on server.");
      }
    } catch (error) {
      alert("Network error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className=" bg-[#9FDCE2] shadow-xl py-3 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 ">
        <div className="flex items-center">
          <Link
            to="/search"
            className="text-gray-700 text-xl lg:text-2xl font-bold hover:text-[#f5f5f5]"
          >
            SideKick
          </Link>
        </div>

        <div className="hidden md:flex gap-8 items-center text-gray-700">
          <Link
            to="/search"
            className="text-xl text-gray-700 hover:text-[#f5f5f5]"
          >
            Find a pet
          </Link>
          <Link to="/favorites" className="text-xl hover:text-[#f5f5f5]">
            Favorites
          </Link>
        </div>

        <div className="flex items-center gap-4 text-gray-700">
          {user && (
            <span className=" text-base lg:text-lg">
              {capitalizeName(user.name)}
            </span>
          )}
          <div className="hidden md:flex items-center gap-4 text-gray-700">
            <LogoutButton
              isLoggingOut={isLoggingOut}
              onClick={handleLogout}
              disabled={isLoggingOut}
            />
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <HiOutlineXMark className="w-6 h-6 text-gray-700" />
            ) : (
              <RxHamburgerMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-4 p-4 md:hidden">
          <Link
            to="/search"
            className="text-lg text-gray-700 hover:text-[#f5f5f5]"
          >
            Find a pet
          </Link>
          <Link
            to="/favorites"
            className="text-lg text-gray-700 hover:text-[#f5f5f5]"
          >
            Favorites
          </Link>
          <div className="md:flex items-center gap-4 text-gray-700">
            <LogoutButton
              isLoggingOut={isLoggingOut}
              onClick={handleLogout}
              disabled={isLoggingOut}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
