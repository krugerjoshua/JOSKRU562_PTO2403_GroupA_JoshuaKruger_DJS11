import React from 'react';
import { GENRE_MAPPING } from '../utils/constants';

function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:space-x-4 md:space-y-0 mb-6">
      <label htmlFor="genre" className='text-lg font-medium text-gray-700'>Filter by Genre:</label>
      <select
        id="genre"
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="">All</option>
        {Object.entries(GENRE_MAPPING).map(([id, title]) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;