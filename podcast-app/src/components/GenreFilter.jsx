import React from 'react';
import { GENRE_MAPPING } from '../utils/constants';

function GenreFilter({ selectedGenre, onGenreChange }) {
  return (
    <div className="genre-filter">
      <label htmlFor="genre">Filter by Genre:</label>
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