import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const DogCard = ({
  dog,
  isFavorite,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  return (
    <div className="p-4 rounded-lg shadow-xl bg-gray-100">
      <img
        src={dog.img}
        alt={dog.name}
        className="h-48 w-58 object-fit rounded-lg mb-4 justify-self-center mb-8 "
        onError={(e) => (e.target.src = "/fallback-dog.png")}
      />
      <h2 className="text-lg font-semibold mb-6">{dog.name}</h2>

      <div className="grid grid-cols-3 gap-1 text-gray-900 text-sm">
        <p className="border-r border-gray-300 ">{dog.breed}</p>
        <p className="border-r border-gray-300 px-2 text-center ">
          {dog.age === 0 ? " < 1" : dog.age}
        </p>
        <p>{dog.zip_code}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 text-gray-400 text-xs">
        <p className="border-r border-gray-300 px-2 text-center">Breed</p>
        <p className="border-r border-gray-300 px-2 text-center">Age</p>
        <p>Zip Code</p>
      </div>

      {showFavoriteButton && (
        <button
          type="button"
          onClick={() => onToggleFavorite(dog.id)}
          className={`mt-8 w-20 py-2 ${
            isFavorite
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-teal-600 hover:bg-teal-700"
          } text-white rounded flex items-center justify-center space-x-2 justify-self-center  `}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}
    </div>
  );
};

export default DogCard;
