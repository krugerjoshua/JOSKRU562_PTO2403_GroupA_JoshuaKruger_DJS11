import { useEffect, useState } from "react";
import ShowList from "../components/ShowList";
import GenreFilter from "../components/GenreFilter";
import { fetchShows } from "../utils/api";

export default function Home() {
    const [shows, setShows] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");

    useEffect(() => {
        fetchShows().then((data) => {
            setShows(data);
            setFilteredShows(data);
        });
    }, []);

    useEffect(() => {
        if (selectedGenre) {
            const filtered = shows.filter((show) =>
                show.genres.includes(Number(selectedGenre))
            );
            setFilteredShows(filtered);
        } else {
            setFilteredShows(shows);
        }
    }, [selectedGenre, shows]);

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4">
            <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-8">
                🎙 Discover Podcasts
            </h2>
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                        Filter by Genre
                    </h3>
                    <GenreFilter
                        selectedGenre={selectedGenre}
                        onGenreChange={setSelectedGenre}
                    />
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                        Available Shows
                    </h3>
                    <ShowList shows={filteredShows} />
                </div>
            </div>
        </div>
    );
}
