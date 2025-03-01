import { useEffect, useState } from "react";
import ShowList from "../components/ShowList";
import GenreFilter from "../components/GenreFilter";
import { fetchShows } from "../utils/api";
import ResetHistoryButton from "./ResetHistoryButton";
import ShowCarousel from "./ShowCarousel";
import Fuse from "fuse.js";

export default function Home() {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortShows = (shows, order) => {
    return shows.sort((a, b) => {
      return order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
  };

  useEffect(() => {
    fetchShows().then((data) => {
      const sortedShows = sortShows(data, sortOrder);
      setShows(sortedShows);
      setFilteredShows(sortedShows);
      setLoading(false);
    });
  }, [sortOrder]);

  // Fuzzy search using Fuse.js
  useEffect(() => {
    // If no search text, filter by genre only
    if (searchText.trim() === "") {
      let filtered = shows;
      if (selectedGenre) {
        filtered = filtered.filter((show) =>
          show.genres.includes(Number(selectedGenre))
        );
      }
      setFilteredShows(filtered);
      return;
    }

    // Setup Fuse options: search in title and description
    const options = {
      keys: ["title", "description"],
      threshold: 0.4, // Lower values = more exact matching
    };

    const fuse = new Fuse(shows, options);
    const results = fuse.search(searchText);
    let fuzzyMatches = results.map((result) => result.item);

    // Also filter by genre if selected
    if (selectedGenre) {
      fuzzyMatches = fuzzyMatches.filter((show) =>
        show.genres.includes(Number(selectedGenre))
      );
    }
    setFilteredShows(fuzzyMatches);
  }, [searchText, selectedGenre, shows]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-6">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
        🎙 Discover Podcasts
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
          {/* Show Carousel */}
          <ShowCarousel />

          {/* Search Input for fuzzy matching */}
          <div className="mb-8">
            <label
              htmlFor="searchInput"
              className="text-2xl font-bold text-gray-700 mb-3 block"
            >
              Search by Concept:
            </label>
            <input
              id="searchInput"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter keywords, concepts, or show title..."
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Genre Filter */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              🎧 Filter by Genre
            </h3>
            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
          </div>

          {/* Sorting Button */}
          <div className="mb-8">
            <button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
            </button>
          </div>

          {/* Shows List */}
          <div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              📻 Available Shows
            </h3>
            <ShowList shows={filteredShows} />
          </div>

          {/* Reset History Button */}
          <ResetHistoryButton />
        </div>
      )}
    </div>
  );
}
