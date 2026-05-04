import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus } from 'lucide-react';

const Filter = () => {
  const navigate = useNavigate();
  
  const [difficulty, setDifficulty] = useState(['Beginner']);
  const [protein, setProtein] = useState(['Chicken']);
  const [portions, setPortions] = useState(1);
  const [time, setTime] = useState(['15 min']);

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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', padding: 'calc(24px + env(safe-area-inset-top)) 20px', position: 'sticky', top: 0, backgroundColor: 'var(--bg)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={28} color="var(--text)" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: '24px', fontWeight: '700', marginRight: '44px' }}>
          Filter
        </h1>
      </header>

      {/* Content */}
      <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
        
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'var(--surface)', padding: '12px 24px', borderRadius: '16px', alignSelf: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}>
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

      {/* Sticky Bottom Button */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        padding: '20px',
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)'
      }}>
        <button
          onClick={() => navigate('/results')}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontSize: '18px',
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
