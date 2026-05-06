import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { savedRecipes } = useRecipes();
  
  const locationState = location.state || {};
  const [searchTerm, setSearchTerm] = useState(locationState.query ?? '');

  const baseResults = [
    { id: '1', title: 'White Bean Basil Chicken Chili', time: '70', protein: 'Chicken', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: 'Veggie & Rice Stir-Fry', time: '65', protein: 'Vegetarian', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80' },
    { id: 'lebanese-spicy-chicken', title: 'Lebanese Spicy Chicken', time: '45', protein: 'Chicken', difficulty: 'Intermediate', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: 'Turkey Tacos', time: '45', protein: 'Chicken', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: 'Lebanese Fattoush Salad', time: '20', protein: 'Vegetarian', difficulty: 'Beginner', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }
  ];

  const allResults = useMemo(() => {
    const combined = [...baseResults];
    
    // Add saved recipes with reactive metadata
    savedRecipes.forEach(saved => {
      let dynamicProtein = 'Chicken'; // default base for lebanese chicken
      const hasModifications = saved.modifications && saved.modifications.length > 0;
      
      if (hasModifications) {
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

      // Note: Time and Portions filtering could be added here similarly if needed in the future

      return true;
    });
  }, [searchTerm, allResults, locationState]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg)', 
      paddingBottom: 'calc(90px + env(safe-area-inset-bottom))',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(24px + env(safe-area-inset-top)) 20px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700', textAlign: 'center', flex: 1, padding: '0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {searchTerm.trim() ? `Results for "${searchTerm.trim()}"` : 'Results'}
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
            placeholder="Search recipes..."
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
              if (r.id === 'lebanese-spicy-chicken') {
                navigate(`/recipe/${r.id}`);
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

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Results;
