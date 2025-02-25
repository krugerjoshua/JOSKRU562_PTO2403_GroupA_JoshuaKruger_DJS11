import React from 'react';
import { Link } from 'react-router-dom';

function ShowList({ shows }) {
  return (
    <div className="show-list">
      {shows.map((show) => (
        <div key={show.id} className="show-card">
          <Link to={`/show/${show.id}`}>
            <h3>{show.title}</h3>
          </Link>
          <p>{show.description}</p>
          <p>Genres: {show.genres.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default ShowList;