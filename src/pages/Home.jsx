import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, User, Clock } from 'lucide-react';
import HorizontalScroll from '../components/HorizontalScroll';
import RecipeCard from '../components/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

const Home = () => {
  const navigate = useNavigate();
  const { savedRecipes, recentRecipes } = useRecipes();

  const handleSearchClick = () => {
    // Potentially open full search or just navigate to results
  };

  const cuisines = [
    { name: 'Lebanese', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80' },
    { name: 'Italian', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=200&q=80' },
    { name: 'Mexican', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=200&q=80' },
    { name: 'Japanese', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=80' },
    { name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80' }
  ];

  return (
    <div style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <header style={{ padding: 'calc(32px + env(safe-area-inset-top)) 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-green)' }}>Cooking Guide</h1>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <User size={20} color="var(--accent-green)" />
        </div>
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
                navigate('/results');
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

      {/* Recent Recipes */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px' }}>Recent Recipes</h3>
        <HorizontalScroll>
          <RecipeCard title="Greek Yogurt Lemon Chicken" time="35" image="https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=300&q=80" onClick={() => navigate('/recipe/1')} />
          <RecipeCard title="White Bean Basil Chicken Chili" time="70" image="https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=300&q=80" onClick={() => navigate('/recipe/1')} />
          <RecipeCard title="Veggie & Rice Stir-Fry" time="65" image="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80" onClick={() => navigate('/recipe/1')} />
          <RecipeCard title="Beef Tacos" time="30" image="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80" onClick={() => navigate('/recipe/1')} />
        </HorizontalScroll>
      </section>

      {/* Cuisines */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px' }}>Cuisines</h3>
        <HorizontalScroll>
          {cuisines.map(c => (
            <div key={c.name} onClick={() => navigate('/results')} style={{
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

      {/* Recents */}
      {recentRecipes.length > 0 && (
        <section style={{ marginBottom: '32px' }}>
          <h3 style={{ padding: '0 20px', fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} /> Recently Cooked
          </h3>
          <HorizontalScroll gap="8px">
            {recentRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id}
                title={recipe.name} 
                time={recipe.time.replace(' mins', '')} 
                image={recipe.image} 
                onClick={() => navigate(`/recipe/${recipe.id}`)} 
              />
            ))}
          </HorizontalScroll>
        </section>
      )}

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
              padding: '40px 20px',
              textAlign: 'center',
              color: 'var(--text-light)',
              fontSize: '14px'
            }}>
              No saved recipes yet. Cook and save a recipe!
            </div>
          )}
        </HorizontalScroll>
      </section>
    </div>
  );
};

export default Home;
