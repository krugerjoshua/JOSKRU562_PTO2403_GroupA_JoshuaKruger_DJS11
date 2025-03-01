import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : {};
    });

    // Update localStorage when favorites change.
    useEffect(() => {
        console.log("📝 Saving favorites to localStorage:", favorites);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (episode, seasonTitle, showTitle, showId) => {
        if (!showId) {
            console.error("Missing showId.", episode);
            return;
        }

        // Generate a unique key for the episode.
        const episodeKey = `${showTitle}-${seasonTitle}-${episode.episode}`;
        console.log("Attempting to toggle favorite for:", episodeKey);
        console.log("Current favorites before update:", favorites);

        setFavorites((prev) => {
            const updatedFavorites = { ...prev };

            if (updatedFavorites[episodeKey]) {
                console.log("Removing:", episodeKey);
                delete updatedFavorites[episodeKey];
            } else {
                console.log("Adding:", episodeKey);
                updatedFavorites[episodeKey] = {
                    ...episode,
                    seasonTitle,
                    showTitle,
                    showId: showId || episode.showId || "UNKNOWN",
                    addedAt: new Date().toISOString(), // Save timestamp
                };
            }

            console.log("🔄 Updated Favorites after update:", updatedFavorites);
            // Force a new object reference so that the UI re-renders.
            return JSON.parse(JSON.stringify(updatedFavorites));
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
