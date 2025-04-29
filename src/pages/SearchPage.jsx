import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DogCard from "../components/DogCard";

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    if (!user) return []; // No favorites if not logged in
    const saved = localStorage.getItem(user.email);
    return saved ? JSON.parse(saved) : [];
  });

  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [sortField, setSortField] = useState("breed");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    if (!user) navigate("/");

    const fetchBreeds = async () => {
      try {
        const { data } = await axios.get(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          { withCredentials: true }
        );
        setBreeds(data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching breeds");
      }
    };

    fetchBreeds();
  }, [user, navigate]);

  const buildQueryParams = (pageQuery = "") => {
    const params = new URLSearchParams(pageQuery);
    if (selectedBreed) params.set("breeds", selectedBreed);
    params.set("size", "24");
    params.set("sort", `${sortField}:${sortDirection}`);
    return params;
  };

  const fetchDogs = async (pageQuery = null, resetPagination = false) => {
    setIsLoading(true);
    setError(null);

    if (resetPagination) {
      setNext(null);
      setPrev(null);
    }

    try {
      const params = buildQueryParams(pageQuery);
      const url = `https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`;

      const { data: searchData } = await axios.get(url, {
        withCredentials: true,
      });
      const { data: dogsData } = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs",
        searchData.resultIds,
        { withCredentials: true }
      );

      setDogs(dogsData);
      setNext(searchData.next);
      setPrev(searchData.prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching dogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagination = (query) => {
    if (query) fetchDogs(query);
  };

  const toggleFavorite = (dogId) => {
    const updatedFavorites = favorites.includes(dogId)
      ? favorites.filter((id) => id !== dogId)
      : [...favorites, dogId];

    setFavorites(updatedFavorites);

    // Save updated favorites to localStorage under the user's email
    if (user) {
      localStorage.setItem(user.email, JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, sortField, sortDirection]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Dogs</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="breed" className="mr-2">
            Breed:
          </label>
          <select
            id="breed"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortField" className="mr-2">
            Sort by:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="breed">Breed</option>
            <option value="name">Name</option>
            <option value="age">Age</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection" className="mr-2">
            Direction:
          </label>
          <select
            id="sortDirection"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-200 animate-pulse h-64 rounded-lg"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs.length > 0 ? (
            dogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.includes(dog.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p>No dogs found. Try adjusting your filters.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePagination(prev)}
          disabled={!prev || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePagination(next)}
          disabled={!next || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
