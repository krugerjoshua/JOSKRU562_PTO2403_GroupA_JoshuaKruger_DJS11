import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import { fetchShowById } from "../utils/api";
import { FavoritesContext } from "../contexts/FavoritesContext";

// Format Date Helper Function
function formatDate(dateString) {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  // Default "all" lets the user view episodes from all seasons; otherwise, a specific season title.
  const [selectedSeason, setSelectedSeason] = useState("all");
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  // Load completed episodes from localStorage when component mounts
  useEffect(() => {
    try {
      const storedCompleted =
        JSON.parse(localStorage.getItem("completedEpisodes")) || [];
      setCompletedEpisodes(storedCompleted);
    } catch (error) {
      console.error("Error parsing completedEpisodes:", error);
      setCompletedEpisodes([]);
    }
  }, []);

  // Fetch show data by ID
  useEffect(() => {
    async function getShowData() {
      try {
        const data = await fetchShowById(id);
        setShow(data);
      } catch (error) {
        console.error("Error fetching show:", error);
      }
    }
    getShowData();
  }, [id]);

  // Callback when an episode completes
  const handleCompletion = (episodeUniqueId) => {
    setCompletedEpisodes((prev) => {
      const updated = [...prev, episodeUniqueId];
      localStorage.setItem("completedEpisodes", JSON.stringify(updated));
      return updated;
    });
  };

  if (!show) {
    return <div>Loading show data...</div>;
  }

  // Determine which episodes to display based on selectedSeason.
  let episodesToDisplay = [];
  if (selectedSeason === "all") {
    // Flatten episodes from all seasons, adding the season title to each episode object.
    episodesToDisplay =
      show.seasons?.flatMap((season) =>
        season.episodes.map((episode) => ({
          ...episode,
          seasonTitle: season.title,
        }))
      ) || [];
  } else {
    const seasonData = show.seasons.find(
      (season) => season.title === selectedSeason
    );
    episodesToDisplay = seasonData ? seasonData.episodes : [];
  }

  // Calculate episode count for current view
  const episodeCount =
    selectedSeason === "all"
      ? episodesToDisplay.length
      : (show.seasons.find((season) => season.title === selectedSeason)
          ?.episodes.length || 0);

  // Get selected season data for preview (if not in "all" view)
  const selectedSeasonData =
    selectedSeason === "all"
      ? null
      : show.seasons.find((season) => season.title === selectedSeason);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10">
      {/* Show Title and Description */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {show.title} — Episodes
      </h2>
      <p className="text-gray-700 mb-4">{show.description}</p>

      {/* Season Selection Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="seasonSelect"
          className="text-lg font-semibold text-gray-800"
        >
          Select a Season:
        </label>
        <select
          id="seasonSelect"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="ml-4 p-2 border rounded-md"
        >
          <option value="all">All Seasons</option>
          {show.seasons.map((season) => (
            <option key={season.title} value={season.title}>
              {season.title}
            </option>
          ))}
        </select>
      </div>

      {/* Season Preview (if a specific season is selected) */}
      {selectedSeason !== "all" && selectedSeasonData && (
        <div className="flex items-center mb-6">
          <img
            src={selectedSeasonData.image}
            alt={`Season ${selectedSeasonData.title} Preview`}
            className="w-48 h-48 object-cover rounded-lg mr-6"
          />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              {selectedSeasonData.title}
            </h3>
            <p className="text-gray-600">
              {selectedSeasonData.description}
            </p>
            <p className="text-sm text-gray-500">
              Episodes: {selectedSeasonData.episodes.length}
            </p>
          </div>
        </div>
      )}

      {/* Display total episode count for current view */}
      <div className="mb-4">
        <p className="text-gray-700">Episodes: {episodeCount}</p>
      </div>

      {episodesToDisplay.length > 0 ? (
        <ul className="space-y-4">
          {episodesToDisplay.map((episode) => {
            // Determine the season to use for the key.
            const seasonForKey =
              selectedSeason === "all" ? episode.seasonTitle : selectedSeason;
            const episodeUniqueId = `${show.title}-${seasonForKey}-${episode.episode}`;
            const isFavorited = favorites.hasOwnProperty(episodeUniqueId);
            return (
              <li
                key={episodeUniqueId}
                className="p-4 bg-white shadow-md rounded-lg"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {episode.title}
                </h3>
                <p className="text-gray-500">{episode.description}</p>
                <AudioPlayer
                  src={episode.file}
                  episodeId={episodeUniqueId}
                  onComplete={(uniqueId) => handleCompletion(uniqueId)}
                />
                <p className="text-gray-500 text-xs">
                  Added to Favorites on {formatDate(favorites[episodeUniqueId]?.addedAt)}
                </p>
                {isFavorited ? (
                  <button
                    onClick={() =>
                      toggleFavorite(
                        episode,
                        seasonForKey,
                        show.title,
                        episode.showId || show.id
                      )
                    }
                    className="ml-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                  >
                    Remove from Favorites
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      toggleFavorite(
                        episode,
                        seasonForKey,
                        show.title,
                        episode.showId || show.id
                      )
                    }
                    className="ml-4 bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
                  >
                    Add to Favorites
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div>No episodes available for this view.</div>
      )}
    </div>
  );
}