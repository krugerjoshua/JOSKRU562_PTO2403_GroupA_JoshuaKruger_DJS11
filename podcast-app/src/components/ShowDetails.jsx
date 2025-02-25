import React from 'react';
import AudioPlayer from './AudioPlayer';

function ShowDetails({ show }) {
  return (
    <div className="show-details">
      <h2>{show.title}</h2>
      <p>{show.description}</p>
      <div>
        {show.seasons.map((season) => (
          <div key={season.id} className="season">
            <h3>Season {season.number}</h3>
            <ul>
              {season.episodes.map((episode) => (
                <li key={episode.id}>
                  <h4>{episode.title}</h4>
                  <p>{episode.description}</p>
                  <AudioPlayer src={episode.file} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowDetails;