import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Filter from './pages/Filter';
import Results from './pages/Results';
import BottomNav from './components/BottomNav';
import './App.css';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="mobile-app-container">
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
