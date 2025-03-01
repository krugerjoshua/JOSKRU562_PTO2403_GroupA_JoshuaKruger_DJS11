import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GENRE_MAPPING } from "../utils/constants";
import { fetchShowById } from "../utils/api";

function ShowList({ shows }) {
    const [showDetails, setShowDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("recent"); // ✅ Default sorting by recently updated
    const [sortOrder, setSortOrder] = useState("desc"); // ✅ Default to newest first

    // Fetch full show details (including seasons) for each show
    useEffect(() => {
        if (shows.length > 0) {
            const fetchAllShowDetails = async () => {
                const details = {};
                for (const show of shows) {
                    const data = await fetchShowById(show.id);
                    details[show.id] = data;
                }
                setShowDetails(details);
                setLoading(false);
            };
            fetchAllShowDetails();
        }
    }, [shows]);

    // ✅ Sorting Function: Sort Shows by Date or Title
    const sortedShows = [...shows].sort((a, b) => {
        if (sortOption === "recent") {
            return sortOrder === "desc"
                ? new Date(b.updated) - new Date(a.updated) // Newest First
                : new Date(a.updated) - new Date(b.updated); // Oldest First
        } else {
            return sortOrder === "asc"
                ? a.title.localeCompare(b.title) // A-Z
                : b.title.localeCompare(a.title); // Z-A
        }
    });

    return (
        <div>
            {/* 🔄 Sorting Options */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-lg font-semibold text-gray-700">📅 Sort By:</span>
                
                {/* Dropdown for Sorting Method */}
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="px-4 py-2 border rounded-md bg-white text-gray-700"
                >
                    <option value="recent">Most Recently Updated</option>
                    <option value="title">Title (A-Z / Z-A)</option>
                </select>

                {/* Toggle Ascending / Descending */}
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex items-center"
                >
                    {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
                </button>
            </div>

            <div className="show-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedShows.map((show) => {
                    const genres = show.genres
                        .map((id) => GENRE_MAPPING[id] || "Unknown")
                        .join(", ");
                    const seasonCount = showDetails[show.id]?.seasons?.length || 0;
                    const lastUpdated = new Date(show.updated).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });

                    return (
                        <div
                            key={show.id}
                            className="show-card bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition"
                        >
                            {/* Show Image */}
                            <img
                                src={show.image}
                                alt={show.title}
                                className="w-full object-cover"
                            />
                            {/* Show Details */}
                            <div className="p-4">
                                <Link to={`/show/${show.id}`} className="block">
                                    <h3 className="text-xl font-semibold text-blue-900 hover:text-blue-700 mb-2">
                                        {show.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                    {show.description}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    🎭 Genres: {genres}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    📂 Seasons: {seasonCount}
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    🕒 Last Updated: {lastUpdated}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ShowList;
