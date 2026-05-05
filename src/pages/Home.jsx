import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, User, Clock } from 'lucide-react';
import HorizontalScroll from '../components/HorizontalScroll';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

const Home = () => {
  const navigate = useNavigate();
  const { savedRecipes, recentRecipes, recipeProgress } = useRecipes();

  const handleSearchClick = () => {
    // Potentially open full search or just navigate to results
  };

  const handleRecipeClick = (recipeId) => {
    if (recipeId === 'lebanese-spicy-chicken') {
      const progress = recipeProgress[recipeId];
      // Only resume if user has actually moved past the first step
      if (progress && progress.currentStep > 0) {
        navigate('/live-cooking');
      } else {
        navigate(`/recipe/${recipeId}`);
      }
    } else {
      navigate('/under-construction');
    }
  };

  const cuisines = [
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=200&q=80' },
    { name: 'Lebanese', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80' },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80' },
    { name: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80' },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80' }
  ];

  const renderRecentSection = () => {
    const hasRecents = recentRecipes.length > 0;
    // Check if any recipe has progress
    const recipesWithProgress = Object.keys(recipeProgress).filter(id => recipeProgress[id].currentStep > 0);
    
    // Combine recents and recipes with progress for the first carousel
    // For simplicity in this prototype, we'll just prioritize recipes with progress
    const displayRecipes = hasRecents ? recentRecipes : [
      { id: 'lebanese-spicy-chicken', name: 'Authentic Lebanese Chicken with Rice', time: '40', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=300&q=80' },
      { id: '2', name: 'White Bean Basil Chicken Chili', time: '70', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80' },
      { id: '3', name: 'Veggie & Rice Stir-Fry', time: '65', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80' },
      { id: '4', name: 'Beef Tacos', time: '30', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80' }
    ];

    return (
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasRecents ? <Clock size={20} /> : null}
          {hasRecents ? 'Recently Cooked' : 'Recent Recipes'}
        </h3>
        <HorizontalScroll gap="8px">
          {displayRecipes.map((recipe) => {
            const progress = recipeProgress[recipe.id];
            const percent = progress ? Math.round((progress.currentStep / (progress.totalSteps - 1)) * 100) : null;
            
            return (
              <RecipeCard 
                key={recipe.id}
                title={recipe.name} 
                time={recipe.time.toString().replace(' mins', '')} 
                image={recipe.image} 
                progress={percent}
                onClick={() => handleRecipeClick(recipe.id)} 
              />
            );
          })}
        </HorizontalScroll>
      </section>
    );
  };

  return (
    <div style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <header style={{ padding: 'calc(32px + env(safe-area-inset-top)) 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-green)' }}>Cooking Guide</h1>
        <button
          onClick={() => navigate('/settings')}
          aria-label="Open settings"
          style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', padding: 0 }}
        >
          <User size={20} color="var(--accent-green)" />
        </button>
      </header>

      {/* Search and Filter */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: '12px' }}>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'var(--surface)', 
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <Search size={20} color="var(--text-light)" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/under-construction');
              }
            }}
            style={{ 
              border: 'none', 
              outline: 'none', 
              marginLeft: '12px', 
              width: '100%',
              fontSize: '16px',
              fontFamily: 'var(--sans)'
            }} 
          />
        </div>
        <button 
          onClick={() => navigate('/filter')}
          style={{
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0 20px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            fontWeight: '700',
            fontFamily: 'var(--sans)',
            fontSize: '16px'
          }}
        >
          <SlidersHorizontal size={20} />
          Filter
        </button>
      </div>

      {renderRecentSection()}

      {/* Cuisines */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px' }}>Cuisines</h3>
        <HorizontalScroll>
          {cuisines.map(c => (
            <div key={c.name} onClick={() => navigate('/under-construction')} style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              flexShrink: 0
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${c.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ 
                  color: 'white', 
                  fontWeight: '700', 
                  fontFamily: 'var(--heading)',
                  fontSize: '14px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {c.name}
                </span>
              </div>
            </div>
          ))}
        </HorizontalScroll>
      </section>

      {/* My Recipe Book */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px' }}>My Recipe Book</h3>
        <HorizontalScroll gap="8px">
          <RecipeCard isBookLink onClick={() => navigate('/recipe-book')} />
          {savedRecipes.length > 0 ? (
            savedRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id}
                title={recipe.name} 
                time={recipe.time.replace(' mins', '')} 
                image={recipe.image} 
                onClick={() => navigate(`/recipe/${recipe.id}`)} 
              />
            ))
          ) : (
            <div style={{
              minWidth: '72%',
              minHeight: '180px',
              padding: '24px 0',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              textAlign: 'left'
            }}>
              <p style={{
                fontSize: '10px',
                color: 'var(--text-light)',
                fontWeight: '400',
                margin: '0 0 6px 0',
                maxWidth: '130px',
                lineHeight: '1.4'
              }}>
                No saved recipes yet
              </p>
              <p style={{
                fontSize: '10px',
                color: 'var(--text-light)',
                lineHeight: '1.5',
                margin: 0,
                maxWidth: '130px'
              }}>
                Cook and save<br />a recipe!
              </p>
            </div>
          )}
        </HorizontalScroll>
      </section>
    </div>
  );
};

export default Home;
