import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Bookmark, Info } from 'lucide-react';
import InteractiveIngredient from '../components/InteractiveIngredient';
import SubstituteModal from '../components/SubstituteModal';
import DeboningModal from '../components/DeboningModal';

const initialIngredients = [
  { id: 1, name: 'Chicken Breast', quantity: '500g', originalName: 'Chicken Breast', edited: false },
  { id: 2, name: 'Olive Oil', quantity: '2 tbsp', originalName: 'Olive Oil', edited: false },
  { id: 3, name: 'Garlic', quantity: '3 cloves', originalName: 'Garlic', edited: false },
  { id: 4, name: 'Lebanese Spice Mix', quantity: '1 tbsp', originalName: 'Lebanese Spice Mix', edited: false },
  { id: 5, name: 'Lemon Juice', quantity: '2 tbsp', originalName: 'Lemon Juice', edited: false },
];

const RecipeOverview = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState(initialIngredients);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeSubIngredient, setActiveSubIngredient] = useState(null);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeActionIngredient, setActiveActionIngredient] = useState(null);

  const [isDeboneModalOpen, setIsDeboneModalOpen] = useState(false);

  const handleDelete = (item) => {
    setIngredients(prev => prev.filter(i => i.id !== item.id));
    setIsActionMenuOpen(false);
  };

  const openSubstitute = (item) => {
    setActiveSubIngredient(item);
    setIsSubModalOpen(true);
    setIsActionMenuOpen(false);
  };

  const handleLongPress = (item) => {
    setActiveActionIngredient(item);
    setIsActionMenuOpen(true);
  };

  const handleSubstitute = (id, newName, newQty) => {
    setIngredients(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, name: newName, quantity: newQty, edited: true };
      }
      return item;
    }));
  };

  return (
    <div style={{ paddingBottom: '100px', backgroundColor: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      
      {/* Top Image & Header */}
      <div style={{ position: 'relative', height: '300px' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(rgba(0,0,0,0.5), transparent)'
        }} />
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', left: '20px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', right: '20px', background: 'rgba(255,255,255,0.8)', borderRadius: '50%', border: 'none', padding: '8px', cursor: 'pointer' }}
        >
          <Bookmark size={24} color="var(--accent-green)" />
        </button>
      </div>

      {/* Recipe Info */}
      <div style={{
        marginTop: '-30px',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        padding: '32px 24px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>Lebanese Spicy Chicken</h1>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', padding: '6px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '14px' }}>45 min</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>Intermediate</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>4 Portions</div>
        </div>

        {/* Deboning Info Banner */}
        <div 
          onClick={() => setIsDeboneModalOpen(true)}
          style={{
            backgroundColor: '#e0f2fe', // light blue
            border: '1px solid #bae6fd',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Info size={24} color="#0284c7" />
            <span style={{ color: '#0369a1', fontWeight: '600' }}>How to debone the chicken?</span>
          </div>
          <ChevronLeft size={20} color="#0284c7" style={{ transform: 'rotate(180deg)' }} />
        </div>

        {/* Ingredients */}
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Ingredients</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '24px' }}>
            Swipe right to substitute, left to delete, or long press for options.
          </p>
          
          <div>
            {ingredients.map(item => (
              <InteractiveIngredient 
                key={item.id} 
                item={item} 
                onSwipeLeft={handleDelete}
                onSwipeRight={openSubstitute}
                onLongPress={handleLongPress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Floating Action */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '432px',
        zIndex: 50
      }}>
        <button 
          onClick={() => navigate('/live-cooking')}
          style={{
            width: '100%',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            padding: '20px',
            fontSize: '18px',
            fontWeight: '800',
            fontFamily: 'var(--heading)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 10px 20px rgba(74, 107, 68, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Play size={24} fill="currentColor" />
          Start Cooking
        </button>
      </div>

      {/* Modals */}
      <SubstituteModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        ingredient={activeSubIngredient} 
        onSubstitute={handleSubstitute}
      />

      <DeboningModal 
        isOpen={isDeboneModalOpen}
        onClose={() => setIsDeboneModalOpen(false)}
      />

      {/* Long Press Action Menu Overlay */}
      {isActionMenuOpen && activeActionIngredient && (
        <div 
          onClick={() => setIsActionMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            maxWidth: '480px', margin: '0 auto'
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>{activeActionIngredient.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => openSubstitute(activeActionIngredient)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
              >
                Substitute Ingredient
              </button>
              <button 
                onClick={() => handleDelete(activeActionIngredient)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: '700', border: 'none', fontSize: '16px' }}
              >
                Delete Ingredient
              </button>
              <button 
                onClick={() => setIsActionMenuOpen(false)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: '600', fontSize: '16px', marginTop: '8px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecipeOverview;