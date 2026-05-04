import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Clock } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

const RecipeBook = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState([
    { id: 1, title: 'Lebanese Spicy Chicken', time: '45', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'White Bean Basil Chicken Chili', time: '70', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Veggie & Rice Stir-Fry', time: '65', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80' }
  ]);

  const removeRecipe = (id, e) => {
    e.stopPropagation();
    setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingBottom: '40px' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', padding: '24px 20px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '24px', fontWeight: '700', marginRight: '44px' }}>
          My Recipe Book
        </h1>
      </header>

      {/* Grid */}
      <div style={{ 
        padding: '0 20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '24px 16px',
        justifyItems: 'center'
      }}>
        {savedRecipes.map((r) => (
          <div key={r.id} style={{ position: 'relative' }}>
            <RecipeCard 
              title={r.title} 
              time={r.time} 
              image={r.image} 
              onClick={() => navigate(`/recipe/${r.id}`)}
            />
            <button 
              onClick={(e) => removeRecipe(r.id, e)}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 5,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {savedRecipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
          <p>Your recipe book is empty.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeBook;
