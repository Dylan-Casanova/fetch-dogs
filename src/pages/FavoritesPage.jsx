import React, { useState, useEffect } from "react";
import DogCard from "../components/DogCard";
import { useAuth } from "../context/AuthContext";

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    if (!user) return; 
    
    const userFavorites = JSON.parse(localStorage.getItem(user.email)) || [];
    setFavorites(userFavorites);
    
    const fetchFavoriteDogs = async () => {
      if (userFavorites.length === 0) return;
      try {
        const response = await fetch(
          "https://frontend-take-home-service.fetch.com/dogs",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userFavorites),
          }
        );
        const data = await response.json();
        setDogs(data);
      } catch (error) {
        console.error("Failed to fetch favorite dogs:", error);
      }
    };

    fetchFavoriteDogs();
  }, [user]);

  const handleToggleFavorite = (dogId) => {
    const userFavorites = JSON.parse(localStorage.getItem(user.email)) || [];
    let updatedFavorites;

    if (userFavorites.includes(dogId)) {
      updatedFavorites = userFavorites.filter((id) => id !== dogId);
    } else {
      updatedFavorites = [...userFavorites, dogId];
    }
    localStorage.setItem(user.email, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    
    setDogs((prevDogs) =>
      prevDogs.filter((dog) => updatedFavorites.includes(dog.id))
    );
  };

  if (!user) return <p>Please login to view your favorites.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Favorite Dogs</h1>

      {dogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              isFavorite={favorites.includes(dog.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p>You haven't added any favorite dogs yet.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
