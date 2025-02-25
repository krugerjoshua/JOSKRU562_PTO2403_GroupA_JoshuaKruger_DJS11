import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ShowPage from './components/ShowPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;