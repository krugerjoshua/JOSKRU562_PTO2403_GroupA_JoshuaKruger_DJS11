const API_BASE_URL = 'https://podcast-api.netlify.app';

export async function fetchShows() {
  const response = await fetch(`${API_BASE_URL}`);
  return response.json();
}

export async function fetchShowById(id) {
  const response = await fetch(`${API_BASE_URL}/id/${id}`);
  return response.json();
}

export async function fetchGenreById(id) {
  const response = await fetch(`${API_BASE_URL}/genre/${id}`);
  return response.json();
}