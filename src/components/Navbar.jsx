import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RxHamburgerMenu } from "react-icons/rx";
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
    setIsMenuOpen(false); // Close mobile menu on route change
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
        throw new Error("Logout failed on server.");
      }
    } catch (error) {
      console.error("Network error during logout:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-transparent shadow-sm navbar text-white p-4">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link
            to="/search"
            className="text-xl lg:text-2xl font-bold"
          >
            BF Finder
          </Link>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          <Link to="/search" className="text-xl  hover:text-gray-200">
            Find a Buddy
          </Link>
          <Link to="/favorites" className="text-xl  hover:text-gray-200">
            Your Favorites
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-base lg:text-lg">
              {capitalizeName(user.name)}
            </span>
          )}
          <div className="hidden md:flex items-center gap-4">
            <LogoutButton isLoggingOut={isLoggingOut} onClick={handleLogout} />
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <RxHamburgerMenu className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="flex flex-col items-center gap-4 p-4 md:hidden transition-all ease-in-out duration-300"
        >
          <Link
            to="/search"
            className="text-lg text-gray-900 hover:text-gray-200"
          >
            Find a Buddy
          </Link>
          <Link
            to="/favorites"
            className="text-lg text-gray-900 hover:text-gray-200"
          >
            Your Favorites
          </Link>
          <LogoutButton isLoggingOut={isLoggingOut} onClick={handleLogout} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
