import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Filter from './pages/Filter';
import Results from './pages/Results';
import RecipeOverview from './pages/RecipeOverview';
import LiveCooking from './pages/LiveCooking';
import Settings from './pages/Settings';
import SaveRecipe from './pages/SaveRecipe';
import RecipeBook from './pages/RecipeBook';
import UnderConstruction from './pages/UnderConstruction';
import { RecipeProvider } from './context/RecipeContext';
import './App.css';

function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="mobile-app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/results" element={<Results />} />
          <Route path="/recipe/:id" element={<RecipeOverview />} />
          <Route path="/live-cooking" element={<LiveCooking />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/save-recipe" element={<SaveRecipe />} />
          <Route path="/recipe-book" element={<RecipeBook />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <RecipeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppLayout />
      </BrowserRouter>
    </RecipeProvider>
  );
}

export default App;



