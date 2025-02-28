import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ShowPage from "./components/ShowPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FavoritesPage from "./components/FavoritesPage";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "./App.css";

function App() {
    return (
      <FavoritesProvider> {/* ✅ Wrap the entire Router in FavoritesProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route path="/favorites" element={<FavoritesPage />} /> {/* ✅ FavoritesPage route */}
        </Routes>
        <Footer />
      </Router>
    </FavoritesProvider>
    );
}

export default App;
