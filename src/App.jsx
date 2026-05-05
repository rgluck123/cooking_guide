import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Filter from './pages/Filter';
import Results from './pages/Results';
import RecipeOverview from './pages/RecipeOverview';
import LiveCooking from './pages/LiveCooking';
import SaveRecipe from './pages/SaveRecipe';
import RecipeBook from './pages/RecipeBook';
import BottomNav from './components/BottomNav';
import { RecipeProvider } from './context/RecipeContext';
import './App.css';

function AppLayout() {
  const location = useLocation();
  const hideNavRoutes = ['/recipe', '/live-cooking', '/save-recipe', '/recipe-book'];
  const shouldHideNav = hideNavRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="mobile-app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/results" element={<Results />} />
          <Route path="/recipe/:id" element={<RecipeOverview />} />
          <Route path="/live-cooking" element={<LiveCooking />} />
          <Route path="/save-recipe" element={<SaveRecipe />} />
          <Route path="/recipe-book" element={<RecipeBook />} />
        </Routes>
      </div>
      {!shouldHideNav && <BottomNav />}
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



