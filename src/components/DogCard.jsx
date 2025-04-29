import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const DogCard = ({
  dog,
  isFavorite,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-48 object-contain rounded-2xl mb-4"
        onError={(e) => (e.target.src = "/fallback-dog.png")}
      />
      <h2 className="text-lg font-semibold">{dog.name}</h2>
      <p className="text-gray-600 text-sm">Breed: {dog.breed}</p>
      <p className="text-gray-600 text-sm">Age: {dog.age}</p>
      <p className="text-gray-600 text-sm">Zip: {dog.zip_code}</p>

      {showFavoriteButton && (
        <button
          type="button"
          onClick={() => onToggleFavorite(dog.id)}
          className={`mt-4 w-full py-2 ${
            isFavorite
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white rounded flex items-center justify-center space-x-2`}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      )}
    </div>
  );
};

export default DogCard;
