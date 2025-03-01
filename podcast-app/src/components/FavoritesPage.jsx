import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import AudioPlayer from "./AudioPlayer";
import { Link } from "react-router-dom";

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

function FavoritesPage() {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [localFavorites, setLocalFavorites] = useState({ ...favorites });
    const [sortOrder, setSortOrder] = useState("asc"); // Sorting state
    const [sortOption, setSortOption] = useState("recent");

    useEffect(() => {
        setLocalFavorites({ ...favorites }); // Update local state when favorites change
    }, [favorites]);

    // Sorting function: by recently updated or title.
    const sortedFavorites = Object.values(localFavorites).sort((a, b) => {
        if (sortOption === "recent") {
            return sortOrder === "desc"
                ? new Date(b.addedAt) - new Date(a.addedAt) // Newest first
                : new Date(a.addedAt) - new Date(b.addedAt); // Oldest first
        } else {
            return sortOrder === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        }
    });

    // Group favorites by show and season.
    const groupedEpisodes = sortedFavorites.reduce((acc, episode) => {
        const showKey = episode.showTitle;
        const seasonKey = episode.seasonTitle;
        if (!acc[showKey]) acc[showKey] = {};
        if (!acc[showKey][seasonKey]) acc[showKey][seasonKey] = [];
        acc[showKey][seasonKey].push(episode);
        return acc;
    }, {});

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
            <h2 className="text-3xl font-extrabold text-blue-900 mb-4">
                Favorite Episodes
            </h2>

            {/* Sorting Options */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-lg font-semibold text-gray-700">📅 Sort By:</span>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2 border rounded-md bg-white text-gray-700"
                >
                    <option value="recent">Most Recently Updated</option>
                    <option value="title">Title (A-Z / Z-A)</option>
                </select>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex items-center"
                >
                    {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                </button>
            </div>

            {sortedFavorites.length === 0 ? (
                <p className="text-gray-600">No favorite episodes yet.</p>
            ) : (
                <div>
                    {Object.keys(groupedEpisodes).map((showTitle) => (
                        <div key={showTitle} className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{showTitle}</h2>
                            {Object.keys(groupedEpisodes[showTitle]).map((seasonTitle) => (
                                <div key={seasonTitle} className="ml-4 mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{seasonTitle}</h3>
                                    <ul className="ml-6 space-y-4">
                                        {groupedEpisodes[showTitle][seasonTitle].map((episode) => {
                                            const episodeUniqueId = `${episode.showTitle}-${episode.seasonTitle}-${episode.episode}`;
                                            return (
                                                <li key={episodeUniqueId} className="space-y-2">
                                                    {/* Episode Title */}
                                                    <h4 className="text-lg font-semibold text-blue-700">
                                                        {episode.title}
                                                    </h4>
                                                    {/* Episode Description */}
                                                    <p className="text-gray-500 text-sm">
                                                        {episode.description}
                                                    </p>
                                                    {/* Audio Player */}
                                                    <AudioPlayer src={episode.file} />
                                                    {/* Added Timestamp */}
                                                    <p className="text-gray-500 text-xs">
                                                        📌 Added: {formatDate(episode.addedAt)}
                                                    </p>
                                                    {/* Link to Show Page */}
                                                    {episode.showId ? (
                                                        <Link to={`/show/${episode.showId}`} className="text-blue-500 underline">
                                                            View Show
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-500">Show ID Missing</span>
                                                    )}
                                                    {/* Remove from Favorites */}
                                                    <button
                                                        onClick={() => {
                                                            toggleFavorite(
                                                                episode,
                                                                episode.seasonTitle,
                                                                episode.showTitle,
                                                                episode.showId
                                                            );
                                                        }}
                                                        className="ml-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;