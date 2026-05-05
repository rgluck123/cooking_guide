import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

const Results = () => {
  const navigate = useNavigate();

  const results = [
    { title: 'Lebanese Spicy Chicken', time: '45', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80' },
    { title: 'White Bean Basil Chicken Chili', time: '70', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
    { title: 'Veggie & Rice Stir-Fry', time: '65', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80' },
    { title: 'Turkey Tacos', time: '45', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
    { title: 'Lebanese Fattoush Salad', time: '20', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(24px + env(safe-area-inset-top)) 20px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>
          Results
        </h1>
        <button onClick={() => navigate('/filter')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SlidersHorizontal size={24} color="var(--text)" />
        </button>
      </header>

      {/* Results Grid */}
      <div style={{ 
        padding: '0 20px', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
        gap: '16px',
        justifyItems: 'center'
      }}>
        {results.map((r, i) => (
          <RecipeCard 
            key={i} 
            title={r.title} 
            time={r.time} 
            image={r.image} 
            onClick={() => navigate('/recipe/1')}
          />
        ))}
      </div>
    </div>
  );
};

export default Results;
