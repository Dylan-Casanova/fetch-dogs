import React from "react";
import { LuLogOut } from "react-icons/lu";

const LogoutButton = ({ onClick, isLoggingOut }) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent text-gray-700 text-lg px-4 py-2 rounded-md hover:bg-orange-700"
      disabled={isLoggingOut}
    >
      <LuLogOut />
    </button>
  );
};

export default LogoutButton;
