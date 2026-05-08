import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedRecipes, setActiveRecipeById } = useRecipes();
  
  const locationState = location.state || {};
  const initialQuery = locationState.query || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const handleRecipeClick = (recipeId, isSavedVersion) => {
    setActiveRecipeById(recipeId, !isSavedVersion); // Force reset if it's the base version
    navigate(`/recipe/${recipeId}`, { state: { from: isSavedVersion ? 'saved' : 'results' } });
  };

  const baseResults = [
    { id: '1', title: 'White Bean Basil Chicken Chili', time: '70', protein: 'Chicken', difficulty: 'Intermediate', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: 'Veggie & Rice Stir-Fry', time: '65', protein: 'Vegetarian', difficulty: 'Beginner', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80' },
    { id: 'authentic-lebanese-chicken', title: 'Authentic Lebanese Chicken with Rice', time: '40', protein: 'Chicken', difficulty: 'Intermediate', cuisine: 'Lebanese', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: 'Turkey Tacos', time: '45', protein: 'Chicken', difficulty: 'Beginner', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: 'Lebanese Fattoush Salad', time: '20', protein: 'Vegetarian', difficulty: 'Beginner', cuisine: 'Lebanese', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
    { id: '5', title: 'Lebanese Hummus & Pita', time: '15', protein: 'Vegetarian', difficulty: 'Beginner', cuisine: 'Lebanese', image: 'https://images.unsplash.com/photo-1577348981446-24e52bfaf10c?auto=format&fit=crop&w=400&q=80' },
    { id: '6', title: 'Lebanese Falafel Wrap', time: '30', protein: 'Vegetarian', difficulty: 'Intermediate', cuisine: 'Lebanese', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80' },
    { id: '7', title: 'Spicy Ramen Bowl', time: '25', protein: 'Pork', difficulty: 'Beginner', cuisine: 'Japanese', image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=400&q=80' },
    { id: '8', title: 'Mushroom Risotto', time: '45', protein: 'Vegetarian', difficulty: 'Advanced', cuisine: 'Italian', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=400&q=80' },
    { id: '9', title: 'Beef Burrito Bowl', time: '20', protein: 'Cow', difficulty: 'Beginner', cuisine: 'Mexican', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80' },
    { id: '10', title: 'Chicken Tikka Masala', time: '50', protein: 'Chicken', difficulty: 'Intermediate', cuisine: 'Indian', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80' }
  ];

  const allResults = useMemo(() => {
    // Determine which base IDs are already in savedRecipes
    const savedBaseIds = new Set(savedRecipes.map(s => s.baseRecipeId || s.id));
    
    // Filter baseResults to only include those NOT in savedRecipes
    const filteredBase = baseResults.filter(base => !savedBaseIds.has(base.id));
    
    const combined = [...filteredBase];
    
    // Add saved recipes with reactive metadata
    savedRecipes.forEach(saved => {
      let dynamicProtein = 'Chicken'; // default base for lebanese chicken
      const hasModifications = saved.isModified || (saved.modifications && saved.modifications.length > 0);
      
      if (saved.modifications && saved.modifications.length > 0) {
         const modText = saved.modifications.map(m => m.name?.toLowerCase() || '').join(' ');
         if (modText.includes('tofu') || modText.includes('tempeh') || modText.includes('beans') || modText.includes('paneer') || modText.includes('soy')) {
           dynamicProtein = 'Vegetarian';
         } else if (modText.includes('beef') || modText.includes('cow') || modText.includes('steak')) {
           dynamicProtein = 'Cow';
         } else if (modText.includes('pork') || modText.includes('pig') || modText.includes('bacon')) {
           dynamicProtein = 'Pig';
         } else if (modText.includes('fish') || modText.includes('salmon') || modText.includes('tuna') || modText.includes('shrimp')) {
           dynamicProtein = 'Fish';
         }
      }

      combined.push({
         id: saved.id,
         title: saved.name,
         time: saved.time?.toString().replace(' mins', '').trim() || '',
         protein: dynamicProtein,
         difficulty: saved.difficulty || 'Intermediate',
         cuisine: saved.cuisine || 'Lebanese', // since the only savable right now is lebanese
         image: saved.image,
         isModified: hasModifications,
         isSavedVersion: true
      });
    });
    
    return combined;
  }, [savedRecipes]);

  const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const filteredResults = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    return allResults.filter((recipe) => {
      // 1. Text Search
      if (normalizedSearch && !normalizeText(recipe.title).includes(normalizedSearch)) {
        return false;
      }
      
      // 2. Difficulty Filter
      if (locationState.difficulty && locationState.difficulty.length > 0) {
        if (!locationState.difficulty.includes(recipe.difficulty)) return false;
      }
      
      // 3. Protein Filter
      if (locationState.protein && locationState.protein.length > 0) {
        if (!locationState.protein.includes(recipe.protein)) return false;
      }

      // 4. Cuisine Filter (from Home page chips)
      if (locationState.cuisine) {
        if (recipe.cuisine !== locationState.cuisine) return false;
      }

      return true;
    });
  }, [searchTerm, allResults, locationState]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg)', 
      paddingBottom: 'calc(90px + env(safe-area-inset-bottom))'
    }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(24px + env(safe-area-inset-top)) 20px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', flex: 1, padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {initialQuery.trim() ? `Results for "${initialQuery.trim()}"` : locationState.cuisine ? `${locationState.cuisine} Recipes` : 'Results'}
        </h1>
        <button onClick={() => navigate('/filter')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '-8px' }}>
          <SlidersHorizontal size={24} color="var(--text)" />
        </button>
      </header>

      {/* Search */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '8px 14px',
          minHeight: '44px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <Search size={20} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Filter by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              marginLeft: '10px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'var(--sans)',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div style={{ 
        padding: '0 20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '16px',
        justifyItems: 'center'
      }}>
        {filteredResults.map((r, i) => (
          <RecipeCard 
            key={`${r.id}-${i}`} 
            title={r.title} 
            time={r.time} 
            image={r.image} 
            isModified={r.isModified}
            onClick={() => {
              if (r.cuisine === 'Lebanese' || r.isSavedVersion) {
                handleRecipeClick(r.id, r.isSavedVersion);
              } else {
                navigate('/under-construction');
              }
            }}
          />
        ))}
        {filteredResults.length === 0 && (
          <div style={{ gridColumn: '1 / -1', width: '100%', textAlign: 'center', padding: '32px 0', color: 'var(--text-light)', fontSize: '14px' }}>
            No recipes match your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
