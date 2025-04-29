import React from "react";
import "./DogCard.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const DogCard = ({
  dog,
  isFavorite,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  return (
    <div className="dog-card p-4 rounded-lg shadow hover:shadow-lg transition">
      <img
        src={dog.img}
        alt={dog.name}
        className="h-48 w-58 object-fit rounded-lg mb-4 justify-self-center "
        onError={(e) => (e.target.src = "/fallback-dog.png")}
      />
      <h2 className="text-lg font-semibold">{dog.name}</h2>

      <div className="grid grid-cols-3 gap-1 text-gray-600 text-sm">
        <p>{dog.breed}</p>
        <p>{dog.age}</p>
        <p>{dog.zip_code}</p>
      </div>
      <div className="grid grid-cols-3 gap-1 text-gray-600 text-sm">
        <p>Breed</p>
        <p>Age</p>
        <p>Zip Code</p>
      </div>

      {showFavoriteButton && (
        <button
          type="button"
          onClick={() => onToggleFavorite(dog.id)}
          className={`mt-4 w-20 py-2 ${
            isFavorite
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded flex items-center justify-center space-x-2 justify-self-center  `}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}
    </div>
  );
};

export default DogCard;
