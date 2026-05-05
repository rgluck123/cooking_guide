import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state?.query ?? '');

  const results = [
    { id: '1', title: 'White Bean Basil Chicken Chili', time: '70', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80' },
    { id: '2', title: 'Veggie & Rice Stir-Fry', time: '65', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80' },
    { id: 'lebanese-spicy-chicken', title: 'Lebanese Spicy Chicken', time: '45', image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80' },
    { id: '3', title: 'Turkey Tacos', time: '45', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80' },
    { id: '4', title: 'Lebanese Fattoush Salad', time: '20', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }
  ];

  const normalizeText = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const filteredResults = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());

    if (!normalizedSearch) {
      return results;
    }

    return results.filter((recipe) => normalizeText(recipe.title).includes(normalizedSearch));
  }, [searchTerm]);

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
            key={i} 
            title={r.title} 
            time={r.time} 
            image={r.image} 
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
            No recipes match "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
