import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites");
        return savedFavorites ? JSON.parse(savedFavorites) : {};
    });

    // ✅ Update localStorage only when `favorites` state changes
    useEffect(() => {
        console.log("📝 Saving favorites to localStorage:", favorites);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (episode, seasonTitle, showTitle, showId) => {
      if (!showId) {
          console.error("Missing showId.", episode);
          return;
      }
  
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
                  addedAt: new Date().toISOString(), // ✅ Store timestamp
              };
          }
  
          console.log("🔄 Updated Favorites after update:", updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  
          return JSON.parse(JSON.stringify(updatedFavorites)); // ✅ Force state update
      });
  };
  
  
  

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}
