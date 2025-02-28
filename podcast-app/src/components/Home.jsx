import { useEffect, useState } from "react";
import ShowList from "../components/ShowList";
import GenreFilter from "../components/GenreFilter";
import { fetchShows } from "../utils/api";

export default function Home() {
    const [shows, setShows] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        fetchShows().then((data) => {
            const sortedShows = sortShows(data, sortOrder);
            setShows(sortedShows);
            setFilteredShows(sortedShows);
            setLoading(false); // Set loading to false after data is fetched
        });
    }, [sortOrder]);

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

    const sortShows = (shows, order) => {
        return shows.sort((a, b) => {
            if (order === 'asc') {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
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
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            🎧 Filter by Genre
                        </h3>
                        <GenreFilter
                            selectedGenre={selectedGenre}
                            onGenreChange={setSelectedGenre}
                        />
                        <h3 className="text-2xl font-bold text-gray-700">
                            🗃️ Sort
                        </h3>
                        <button
                            onClick={toggleSortOrder}
                            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
                        </button>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">
                            📻 Available Shows
                        </h3>
                        <ShowList shows={filteredShows} />
                    </div>
                </div>
            )}
        </div>
    );
}