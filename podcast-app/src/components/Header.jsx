import { Link } from "react-router-dom";

export default function Header() {
    return (
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white font-mono text-xl font-bold shadow-lg p-4 rounded-b-2xl">
        <h1 className="text-center text-2xl">Podcast App</h1>
        <nav className="mt-2 flex justify-center space-x-6">
          <a href="/" className="hover:underline hover:text-gray-300 transition">🏠 Home</a>
          <Link to="/favorites" className="hover:underline hover:text-gray-300 transition">❤️ Favorites</Link>
        </nav>
      </header>
    );
  }