import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DogCard from "../components/DogCard";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GoChevronDown } from "react-icons/go";

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

      const searchRes = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!searchRes.ok) {
        throw new Error("Failed to fetch search results");
      }

      const searchData = await searchRes.json();

      const dogsRes = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(searchData.resultIds),
        }
      );

      if (!dogsRes.ok) {
        throw new Error("Failed to fetch dogs data");
      }

      const dogsData = await dogsRes.json();

      setDogs(dogsData);
      setNext(searchData.next);
      setPrev(searchData.prev);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "Error fetching dogs");
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
    <div className="container mx-auto p-4 sm:grid search-page">
      <div className="md:flex md:justify-between md:items-center border-b-1 border-gray-200 mb-20">
        <h1 className="text-2xl font-semibold text-gray-700">Search Dogs</h1>

        {/* Filters */}
        <div>
          <p className="place-self-start">Filters:</p>
          <div className="flex justify-start md:justify-end space-x-4 mb-6 text-gray-900">
            {/* Breed dropdown menu */}
            <Menu as="div" className="relative inline-block text-left">
              {/* <p>Filter Results:</p> */}
              <div>
                <MenuButton className="flex justify-between sm:w-64 rounded-md bg-white px-3 py-2 text-md text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                  {selectedBreed || "All Breeds"}
                  <GoChevronDown
                    aria-hidden="true"
                    className="-mr-1 mt-0.5 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute left-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg max-h-60 overflow-y-auto ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedBreed("")}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      All Breeds
                    </button>
                  )}
                </MenuItem>
                {breeds.map((breed) => (
                  <div key={breed} className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedBreed(breed)}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {breed}
                        </button>
                      )}
                    </MenuItem>
                  </div>
                ))}
              </MenuItems>
            </Menu>

            {/* Sort dropdown menu */}
            <Menu as="div" className="relative inline-block text-left">
              {/* <p>Sort:</p> */}
              <div>
                <MenuButton className="flex justify-between sm:w-24 rounded-md bg-white px-3 py-2 text-md text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                  {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                  <GoChevronDown
                    aria-hidden="true"
                    className="-mr-1 mt-0.5 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 sm:w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none max-h-60 overflow-y-auto"
              >
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => setSortField("breed")}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        Breed
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => setSortField("name")}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        Name
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => setSortField("age")}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        Age
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>

            {/* Order dropdown menu */}

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="flex justify-between sm:w-32 rounded-md bg-white px-3 py-2 text-md text-gray-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                  <GoChevronDown
                    aria-hidden="true"
                    className="-mr-1 size-5 text-gray-400"
                  />
                </MenuButton>
              </div>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 sm:w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <div className="py-1">
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => setSortDirection("asc")}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        Ascending
                      </button>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={() => setSortDirection("desc")}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                      >
                        Descending
                      </button>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 max-w-screen">
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
      <div className="flex justify-between mt-11 mb-10">
        <button
          onClick={() => handlePagination(prev)}
          disabled={!prev || isLoading}
          className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePagination(next)}
          disabled={!next || isLoading}
          className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
