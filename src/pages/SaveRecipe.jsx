import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const SaveRecipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRecipe } = useRecipes();
  const [recipeName, setRecipeName] = useState('Lebanese Spicy Chicken');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedModifications, setSelectedModifications] = useState(new Set());

  // Get modifications from navigation state
  const modifications = location.state?.modifications || [];

  const toggleSelectModification = (id) => {
    setSelectedModifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSaveRecipe = () => {
    // Keep only selected modifications
    const activeModifications = modifications.filter(mod => selectedModifications.has(mod.id));
    
    const recipeData = {
      name: recipeName,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      time: '40 mins',
      portions: '2 portions',
      modifications: activeModifications,
      notes: notes,
      savedAt: new Date().toLocaleString()
    };

    saveRecipe(recipeData);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg)',
      maxWidth: '480px',
      margin: '0 auto',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Header */}
      <header style={{ 
        padding: 'calc(24px + env(safe-area-inset-top)) 20px 12px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '4px',
            color: 'var(--text)',
            display: 'flex'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: 'var(--text)',
          margin: 0,
          fontFamily: 'var(--heading)'
        }}>
          Save Recipes
        </h1>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {/* Recipe Image with Metadata */}
        <div style={{ 
          position: 'relative',
          marginBottom: '24px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'var(--surface)',
          border: '2px solid var(--border)',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" 
            alt="Lebanese Spicy Chicken"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {/* Metadata Badges */}
          <div style={{ 
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '12px',
            zIndex: 10
          }}>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              ⏱️ 40mins
            </div>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text)'
            }}>
              👥 2 portions
            </div>
          </div>
        </div>

        {/* Recipe Name */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--text)',
            display: 'block',
            marginBottom: '8px'
          }}>
            Recipe Name
          </label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              color: 'var(--text)',
              backgroundColor: 'var(--surface)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>

        {/* Modifications - Only show if there are any */}
        {modifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: 'var(--text)',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              Modifications
            </h3>
            
            {modifications.map((mod) => {
              const isSelected = selectedModifications.has(mod.id);
              return (
                <div key={mod.id} style={{ marginBottom: '0' }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    paddingBottom: '12px',
                    borderBottom: '1px dotted var(--border)',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSelectModification(mod.id)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{
                        marginTop: '4px',
                        cursor: 'pointer',
                        accentColor: 'var(--accent-green)'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '14px',
                        color: isSelected ? 'var(--text)' : 'var(--text-light)',
                        fontWeight: isSelected ? '500' : '400'
                      }}>
                        {mod.name && mod.amount && `${mod.name} (${mod.amount})`}
                        {mod.name && !mod.amount && mod.name}
                        {!mod.name && mod.amount && `Added: ${mod.amount}`}
                      </div>
                      {mod.notes && (
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--text-light)',
                          marginTop: '2px'
                        }}>
                          {mod.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notes Field */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--text)',
            display: 'block',
            marginBottom: '8px'
          }}>
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add cooking notes or personal comments..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'var(--sans)',
              color: 'var(--text)',
              backgroundColor: 'var(--surface)',
              boxSizing: 'border-box',
              outline: 'none',
              minHeight: '80px',
              resize: 'none'
            }}
          />
        </div>

        {/* Info Message */}
        <p style={{
          fontSize: '13px',
          color: 'var(--text-light)',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          This will save a new version of the recipe with your modifications to your "📖 Recipe Book".
        </p>

        {/* Save Recipe Button */}
        <button
          onClick={handleSaveRecipe}
          style={{
            width: '100%',
            padding: '16px 24px',
            backgroundColor: 'var(--accent-green)',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            fontFamily: 'var(--sans)'
          }}
        >
          Save Recipe
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--accent-green)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: 'calc(480px - 40px)',
          width: 'calc(100% - 40px)',
          boxShadow: '0 4px 12px rgba(74, 107, 68, 0.3)',
          animation: 'slideUp 0.3s ease-out',
          zIndex: 1000
        }}>
          <Check size={20} />
          <span style={{ fontWeight: '600', fontSize: '16px' }}>Recipe saved successfully!</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SaveRecipe;
