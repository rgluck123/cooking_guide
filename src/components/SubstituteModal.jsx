import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const SubstituteModal = ({ isOpen, onClose, ingredients, onSubstitute, cookingSteps = [] }) => {
  const [customName, setCustomName] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [selectedStepId, setSelectedStepId] = useState('');

  if (!isOpen || !ingredients || ingredients.length === 0) return null;

  // Recommendations database expanded with Lo-Fi Design options for Yellow Onion
  const recommendations = {
    'Yellow Onion': [
      { name: 'Red onion', quantity: '1' },
      { name: 'Shallots', quantity: '3' },
      { name: 'Spring onions', quantity: '5-6 stalks' },
      { name: 'Onion powder', quantity: '1 tbsp' },
      { name: 'Garlic', quantity: '4 cloves' }
    ],
    'Chicken Thighs': [
      { name: 'Tofu', quantity: '400g' },
      { name: 'Chickpeas', quantity: '2 cans' }
    ],
    'Olive Oil': [
      { name: 'Avocado Oil', quantity: '2 tbsp' },
      { name: 'Butter', quantity: '2 tbsp' }
    ]
  };

  const isGroup = ingredients.length > 1;
  const originalName = isGroup ? 'Group' : ingredients[0].originalName;
  const displayTitle = isGroup ? `${ingredients.length} ingredients` : originalName;
  
  const recs = isGroup ? [] : (recommendations[originalName] || []);

  // Determine if ingredients are from different steps
  const uniqueSteps = Array.from(new Set(ingredients.flatMap(ing => ing.assignedSteps || [])));
  const isMultiStep = isGroup && uniqueSteps.length > 1;

  const handleSelect = (name, quantity) => {
    onSubstitute(ingredients.map(i => i.id), name, quantity, selectedStepId || null);
    resetForm();
    onClose();
  };

  const handleCustomSubmit = () => {
    if (customName && customQty) {
      onSubstitute(ingredients.map(i => i.id), customName, customQty, selectedStepId || null);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setCustomName('');
    setCustomQty('');
    setSelectedStepId('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        maxHeight: '80vh',
        overflowY: 'auto',
        width: '100%',
        maxWidth: '480px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Substitute {displayTitle}</h2>
          <button onClick={() => { resetForm(); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} color="var(--text)" />
          </button>
        </div>

        {/* Step Selection - Only if multi-step substitution */}
        {isMultiStep && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign to Cooking Step</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '12px', lineHeight: '1.4' }}>These ingredients are currently used in different steps. Select one step for the new substitute:</p>
            <select 
              value={selectedStepId}
              onChange={(e) => setSelectedStepId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontFamily: 'var(--sans)', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Keep current steps (split)</option>
              {cookingSteps.map(step => (
                <option key={step.id} value={step.id}>Step {step.id}: {step.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* Removed "Recommended" header as it is obvious */}
        {recs.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recs.map((rec, i) => (
                <div 
                  key={i}
                  onClick={() => handleSelect(rec.name, rec.quantity)}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{rec.name}</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: '700' }}>{rec.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 style={{ fontSize: '16px', color: 'var(--text-light)', marginBottom: '12px' }}>Custom Substitute</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              placeholder="Ingredient name" 
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              style={{ flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--sans)', boxSizing: 'border-box', minWidth: 0 }}
            />
            <input 
              type="text" 
              placeholder="Qty" 
              value={customQty}
              onChange={(e) => setCustomQty(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--sans)', boxSizing: 'border-box', minWidth: 0 }}
            />
          </div>
          <button 
            onClick={handleCustomSubmit}
            disabled={!customName || !customQty}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: (customName && customQty) ? 'var(--accent-green)' : 'var(--border)',
              color: (customName && customQty) ? 'white' : 'var(--text-light)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: (customName && customQty) ? 'pointer' : 'not-allowed',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Check size={20} />
            Apply Custom Substitute
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubstituteModal;
