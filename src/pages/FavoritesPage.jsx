import React, { useState, useEffect } from "react";
import DogCard from "../components/DogCard";
import { useAuth } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [match, setMatch] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const getFromStorage = (key, defaultValue = null) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const fetchDogs = async (ids) => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids),
      }
    );
    const data = await response.json();
    return data;
  };

  const fetchMatch = async (favorites) => {
    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
      }
    );
    const data = await response.json();
    return data.match;
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      const storedFavorites = getFromStorage(user.email, []);
      const storedMatch = getFromStorage(`match-${user.email}`, null);

      setFavorites(storedFavorites);
      setMatch(storedMatch);

      if (storedFavorites.length === 0) {
        setDogs([]);
        return;
      }

      try {
        const dogsData = await fetchDogs(storedFavorites);
        setDogs(dogsData);
      } catch (error) {
        console.error("Failed to fetch favorite dogs:", error);
      }
    };

    loadUserData();
  }, [user, navigate]);

  const handleToggleFavorite = (dogId) => {
    const userFavorites = getFromStorage(user.email, []);
    const updatedFavorites = userFavorites.includes(dogId)
      ? userFavorites.filter((id) => id !== dogId)
      : [...userFavorites, dogId];

    localStorage.setItem(user.email, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);

    setDogs((prevDogs) =>
      prevDogs.filter((dog) => updatedFavorites.includes(dog.id))
    );
  };

  const handleClearFavorites = () => setShowModal(true);

  const confirmClearFavorites = () => {
    localStorage.removeItem(user.email);
    setFavorites([]);
    setDogs([]);
    setShowModal(false);
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) return;
    setLoadingMatch(true);

    try {
      const matchId = await fetchMatch(favorites);

      if (!matchId) {
        console.error("No match returned");
        return;
      }

      const matchedDogs = await fetchDogs([matchId]);
      const matchedDog = matchedDogs[0];

      if (!matchedDog) {
        console.error("Matched dog not found");
        return;
      }

      setMatch(matchedDog);
      localStorage.setItem(`match-${user.email}`, JSON.stringify(matchedDog));
    } catch (error) {
      console.error("Failed to generate match:", error);
    } finally {
      setLoadingMatch(false);
    }
  };

  if (!user) return <p>Please login to view your favorites.</p>;

  return (
    <div className="container mx-auto p-4 mb-24">
      <div
        className="flex justify-between items-center py-6
      border-b-1 border-gray-200 mb-20"
      >
        <h1 className="text-gray-700 text-2xl font-semibold">Your Favorites</h1>

        <div className="flex gap-4">
          <button
            disabled={favorites.length === 0}
            onClick={handleClearFavorites}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
          >
            Clear Favorites
          </button>

          <button
            onClick={handleGenerateMatch}
            disabled={favorites.length === 0 || loadingMatch}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            {match ? "Generate New Match" : "Find Match"}
          </button>
        </div>
      </div>

      {loadingMatch && (
        <div className="text-center my-6">
          <p className="text-lg font-semibold animate-pulse">
            Finding your perfect match...
          </p>
        </div>
      )}

      {match && !loadingMatch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center"
        >
          <div className="border-2 border-teal-600 rounded-xl p-8 shadow-lg text-center max-w-md w-full">
            <h2 className="text-3xl font-extrabold text-teal-600 mb-4">
              🎉 Your Perfect Match! 🎉
            </h2>
            <DogCard
              dog={match}
              isFavorite={favorites.includes(match.id)}
              onToggleFavorite={handleToggleFavorite}
              showFavoriteButton={false}
            />
          </div>
        </motion.div>
      )}

      {!loadingMatch && dogs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Favorite Dogs</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {!loadingMatch && dogs.length === 0 && !match && (
        <p>You haven't added any favorite dogs yet.</p>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-50"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4">Clear Favorites</h2>
              <p className="mb-4">
                Are you sure you want to clear all favorite dogs?
              </p>
              <p className="mb-6">
                You will not be able to generate a new match until you add new
                favorites.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearFavorites}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Yes, Clear Favorites
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesPage;
