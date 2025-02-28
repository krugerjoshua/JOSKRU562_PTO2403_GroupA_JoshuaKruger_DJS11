import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GENRE_MAPPING } from "../utils/constants";
import { fetchShowById } from "../utils/api";

function ShowList({ shows }) {
    const [showDetails, setShowDetails] = useState({});
    const [loading, setLoading] = useState(true);

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

    // Format date to a human-readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Fallback if date is missing
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A"; // Fallback for invalid dates
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="show-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shows.map((show) => {
                const genres = show.genres
                    .map((id) => GENRE_MAPPING[id] || "Unknown")
                    .join(", ");
                const seasonCount = showDetails[show.id]?.seasons?.length || 0; // Get number of seasons
                const lastUpdated = formatDate(show.updated); // Use the `updated` field

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
                                🎭 Genres: {genres} {/* Display genre names */}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                📂 Seasons: {seasonCount}{" "}
                                {/* Display number of seasons */}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                                🕒 Last Updated: {lastUpdated}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ShowList;
