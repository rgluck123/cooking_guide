import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, Search, SlidersHorizontal, Users } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const Filter = () => {
  const navigate = useNavigate();
  const { scaleActiveRecipePortions } = useRecipes();
  
  const [difficulty, setDifficulty] = useState([]);
  const [protein, setProtein] = useState([]);
  const [portions, setPortions] = useState(2);
  const [time, setTime] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const proteins = ['Chicken', 'Fish', 'Pig', 'Cow', 'Vegetarian', '+'];
  const times = ['15 min', '30 min', '45 min', '60 min', '75 min', '90 min'];

  const toggleSelection = (setter, item) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const Pill = ({ label, isSelected, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: '24px',
        border: `1px solid ${isSelected ? 'var(--accent-green)' : 'var(--border)'}`,
        backgroundColor: isSelected ? 'var(--accent-green-light)' : 'var(--surface)',
        color: isSelected ? 'var(--accent-green)' : 'var(--text)',
        fontWeight: isSelected ? '600' : '400',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'calc(16px + env(safe-area-inset-top)) 20px 12px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 20, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>
          Filter
        </h1>
        <div style={{ width: '28px' }} />
      </header>

      {/* Content */}
      <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ 
            flex: 1, 
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate('/results', { state: { query: searchTerm } });
                }
              }}
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
        
        {/* Difficulty */}
        <section>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Difficulty</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {difficulties.map(d => (
              <Pill key={d} label={d} isSelected={difficulty.includes(d)} onClick={() => toggleSelection(setDifficulty, d)} />
            ))}
          </div>
        </section>

        {/* Type of Protein */}
        <section>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Type of protein</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {proteins.map(p => (
              <Pill key={p} label={p} isSelected={protein.includes(p)} onClick={() => toggleSelection(setProtein, p)} />
            ))}
          </div>
        </section>

        {/* Portions */}
        <section>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Portions</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', alignSelf: 'flex-start' }}>
            <button 
              onClick={() => setPortions(Math.max(1, portions - 1))}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Minus size={20} color="var(--text)" />
            </button>
            <span style={{ fontSize: '20px', fontWeight: '700', width: '20px', textAlign: 'center' }}>{portions}</span>
            <button 
              onClick={() => setPortions(portions + 1)}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Plus size={20} color="var(--text)" />
            </button>
          </div>
        </section>

        {/* Time */}
        <section>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Time</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {times.map(t => (
              <Pill key={t} label={t} isSelected={time.includes(t)} onClick={() => toggleSelection(setTime, t)} />
            ))}
          </div>
        </section>

      </div>

      {/* Pinned Footer with Apply Button */}
      <div style={{
        flexShrink: 0,
        padding: '12px 20px calc(16px + env(safe-area-inset-bottom))',
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid rgba(234, 234, 234, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 30
      }}>
        <button
          onClick={() => navigate('/results', { state: { query: searchTerm, difficulty, protein, portions, time } })}
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '14px 20px',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: 'var(--heading)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow)'
          }}
        >
          Apply Filters
        </button>
      </div>

    </div>
  );
};

export default Filter;
