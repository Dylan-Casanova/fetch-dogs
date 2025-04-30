import React from "react";
import { LuLogOut } from "react-icons/lu";

const LogoutButton = ({ onClick, isLoggingOut }) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent text-gray-700 text-lg px-4 py-2 rounded-md hover:bg-[#f5f5f5] cursor-pointer"
      disabled={isLoggingOut}
    >
      <LuLogOut />
    </button>
  );
};

export default LogoutButton;
