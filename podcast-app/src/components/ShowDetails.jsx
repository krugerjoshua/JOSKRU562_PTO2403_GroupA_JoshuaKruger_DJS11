import React, { useState, useEffect, useContext } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import AudioPlayer from "./AudioPlayer";

function ShowDetails({ show }) {
    const [loading, setLoading] = useState(true);
    const { favorites, toggleFavorite } = useContext(FavoritesContext);
    const [selectedSeason, setSelectedSeason] = useState(
        show.seasons[0]?.title || ""
    );

    useEffect(() => {
        if (show) {
            setTimeout(() => setLoading(false), 1000); // Simulate loading time
        }
    }, [show]);

    const selectedSeasonData = show.seasons.find(
        (season) => season.title === selectedSeason
    );

    const isFavorite = (episodeId, seasonTitle) => {
        const seasonKey = `${seasonTitle}-${episodeId}`;
        return favorites[seasonKey] || false; // return true if favorited, otherwise false
    };

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
            {loading ? (
                // 🔹 Loading Spinner
                <div className="flex justify-center items-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <h2 className="text-3xl font-extrabold text-blue-900 mb-4">
                        {show.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{show.description}</p>

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
                            {show.seasons.map((season) => (
                                <option key={season.title} value={season.title}>
                                    {season.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Season Details with Preview Image and Description */}
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

                    {/* Episodes List for Selected Season */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            Episodes for {selectedSeasonData.title}
                        </h3>
                        <ul>
                            {selectedSeasonData.episodes.map((episode) => {
                                const episodeKey = `${show.title}-${selectedSeasonData.title}-${episode.episode}`;
                                return (
                                    <li
                                        key={episode.episode}
                                        className="space-y-4"
                                    >
                                        <h4 className="text-lg font-semibold text-blue-700">
                                            {episode.title}
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                            {episode.description}
                                        </p>
                                        <AudioPlayer src={episode.file} />

                                        {/* Favorite Button */}
                                        <button
                                            onClick={() =>
                                                toggleFavorite(
                                                    episode,
                                                    selectedSeasonData.title,
                                                    show.title,
                                                    show.id
                                                )
                                            }
                                            className={`text-xl ${favorites[episodeKey] ? "text-red-500" : "text-gray-400"}`}
                                        >
                                            {favorites[episodeKey] ? "♥" : "♡"}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default ShowDetails;
