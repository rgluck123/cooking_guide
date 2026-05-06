import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Mic, MicOff, Volume2, VolumeX, X } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';

const SaveRecipe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRecipe, liveCookingDefaults, activeRecipe, clearProgress } = useRecipes();
  const [recipeName, setRecipeName] = useState('Authentic Lebanese Chicken with Rice');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedModifications, setSelectedModifications] = useState(new Set());

  // Voice States
  const [voiceEnabled, setVoiceEnabled] = useState(liveCookingDefaults.micEnabled);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(liveCookingDefaults.voiceOverEnabled);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);
  const loopTimeoutRef = useRef(null);

  const recipeId = 'authentic-lebanese-chicken';

  // Get modifications from LiveCooking via navigation state
  const liveModifications = useMemo(() => location.state?.modifications || [], [location.state]);

  // Get modifications from RecipeOverview via activeRecipe context
  const overviewModifications = useMemo(() => {
    return activeRecipe ? activeRecipe.ingredients
      .filter(ing => (ing.edited || ing.removed || ing.replacedIds) && !ing.hidden)
      .map(ing => ({
        id: `ov-${ing.id}`,
        name: ing.name,
        amount: ing.quantity,
        type: ing.removed ? 'Deleted' : (ing.edited ? 'Substituted' : 'Modified'),
        notes: ing.removed ? 'Removed' : (ing.edited ? `Substituted for ${ing.originalName}` : 'Added/Modified'),
        isFromOverview: true
      })) : [];
  }, [activeRecipe]);

  const allModifications = useMemo(() => [
    ...overviewModifications, 
    ...liveModifications.map(m => ({ ...m, type: 'Added' }))
  ], [overviewModifications, liveModifications]);

  // Initialize all modifications as selected by default
  useEffect(() => {
    if (allModifications.length > 0 && selectedModifications.size === 0) {
      const allIds = new Set(allModifications.map(m => m.id));
      setSelectedModifications(allIds);
    }
  }, [allModifications, selectedModifications.size]);

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

  const handleSaveRecipe = useCallback(() => {
    const activeModifications = allModifications.filter(mod => selectedModifications.has(mod.id));
    
    const recipeData = {
      name: recipeName,
      image: activeRecipe?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      time: activeRecipe?.time || '40 mins',
      portions: activeRecipe?.portions || '2 Portions',
      modifications: activeModifications,
      notes: notes,
      savedAt: new Date().toLocaleString(),
      isModified: true
    };

    saveRecipe(recipeData);
    
    // Clear the cooking progress ONLY on successful save
    clearProgress(recipeId);

    if (voiceOutputEnabled) {
      try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
      const utterance = new SpeechSynthesisUtterance("Recipe saved successfully");
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [allModifications, selectedModifications, recipeName, notes, activeRecipe, saveRecipe, voiceOutputEnabled, navigate, clearProgress, recipeId]);

  const handleExit = useCallback(() => {
    try { window.speechSynthesis.cancel(); } catch(e) { /* ignore */ }
    navigate(-1); // Returns exactly to the previous LiveCooking step
  }, [navigate]);

  // Voice Interaction Logic
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onend = () => {
      if (voiceEnabled) {
        loopTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && voiceEnabled) {
            try { recognitionRef.current.start(); } catch(e) { /* ignore */ }
          }
        }, 500);
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      if (/(home screen|home page|go to home)/i.test(transcript)) {
        navigate('/');
      }
      else if (transcript.startsWith('remove ')) {
        const query = transcript.replace('remove ', '').trim();
        const items = query.split(' and ').map(s => s.trim());
        items.forEach(itemName => {
          const modToRemove = allModifications.find(m => m.name.toLowerCase().includes(itemName));
          if (modToRemove && selectedModifications.has(modToRemove.id)) {
            toggleSelectModification(modToRemove.id);
          }
        });
      }
      else if (transcript.startsWith('include ') || transcript.startsWith('restore ')) {
        const query = transcript.replace(/(include|restore) /, '').trim();
        const items = query.split(' and ').map(s => s.trim());
        items.forEach(itemName => {
          const modToInclude = allModifications.find(m => m.name.toLowerCase().includes(itemName));
          if (modToInclude && !selectedModifications.has(modToInclude.id)) {
            toggleSelectModification(modToInclude.id);
          }
        });
      }
      else if (transcript === 'undo') {
        const lastSelectedId = allModifications.find(m => !selectedModifications.has(m.id))?.id;
        if (lastSelectedId) toggleSelectModification(lastSelectedId);
      }
      else if (/save recipe/i.test(transcript)) {
        handleSaveRecipe();
      }
    };

    recognitionRef.current = recognition;
    if (voiceEnabled) {
      try { recognition.start(); } catch(e) { /* ignore */ }
    }

    return () => {
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
      try { recognitionRef.current?.abort(); } catch(e) { /* ignore */ }
    };
  }, [voiceEnabled, allModifications, selectedModifications, voiceOutputEnabled, handleExit, handleSaveRecipe, navigate]);

  const toggleVoiceListening = async () => {
    if (!voiceEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) { return; }
    }
    setVoiceEnabled(prev => !prev);
  };

  const handleRecipeNameChange = (e) => {
    const value = e.target.value;
    const capitalized = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    setRecipeName(capitalized);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)', width: '100%', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {showSuccess && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-green)', color: 'white', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2000, boxShadow: 'var(--shadow)', animation: 'slideDown 0.3s ease-out' }}>
          <Check size={20} />
          <span style={{ fontWeight: '600' }}>Recipe saved successfully!</span>
        </div>
      )}

      <header style={{ padding: 'calc(24px + env(safe-area-inset-top)) 20px 12px', backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleExit} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
            <ChevronLeft size={24} color="var(--text)" />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)', margin: 0, fontFamily: 'var(--heading)' }}>Save Recipe</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleVoiceListening} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', backgroundColor: voiceEnabled ? 'var(--accent-green-light)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {voiceEnabled ? <Mic size={18} color="var(--accent-green)" /> : <MicOff size={18} color="var(--text-light)" />}
          </button>
          <button onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border)', backgroundColor: voiceOutputEnabled ? 'var(--accent-green-light)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {voiceOutputEnabled ? <Volume2 size={18} color="var(--accent-green)" /> : <VolumeX size={18} color="var(--text-light)" />}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxWidth: '600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ position: 'relative', marginBottom: '24px', borderRadius: '24px', overflow: 'hidden', height: '260px', boxShadow: 'var(--shadow)' }}>
          <img src={activeRecipe?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"} alt={recipeName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text)', border: '1.5px solid var(--text)' }}>
              {activeRecipe?.time || '40 min'}
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text)', border: '1.5px solid var(--text)' }}>
              {activeRecipe?.portions || '2 Portions'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Recipe Name</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input type="text" value={recipeName} onChange={handleRecipeNameChange} placeholder="Type recipe name..." style={{ width: '100%', padding: '14px 44px 14px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '15px', fontFamily: 'var(--sans)', color: 'var(--text)', backgroundColor: 'var(--surface)', boxSizing: 'border-box', outline: 'none' }} />
            {recipeName && (
              <button onClick={() => setRecipeName('')} style={{ position: 'absolute', right: '12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E0E0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="#666" />
              </button>
            )}
          </div>
        </div>

        {allModifications.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text)', marginBottom: '12px', fontFamily: 'var(--heading)' }}>Modified Ingredients</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {allModifications.map((mod) => {
                const isSelected = selectedModifications.has(mod.id);
                return (
                  <div key={mod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed var(--border)', opacity: isSelected ? 1 : 0.4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text)', textDecoration: isSelected ? 'none' : 'line-through', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{mod.name}{mod.amount ? ` (${mod.amount})` : ''}</span>
                        {mod.type && <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>[{mod.type}]</span>}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSelectModification(mod.id)} 
                      style={{ background: 'none', border: 'none', color: isSelected ? 'var(--text-light)' : 'var(--accent-green)', fontSize: '14px', fontWeight: '700', cursor: 'pointer', padding: '4px 8px' }}
                    >
                      {isSelected ? 'Remove' : 'Undo'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add cooking notes..." style={{ width: '100%', padding: '14px 16px', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '15px', fontFamily: 'var(--sans)', color: 'var(--text)', backgroundColor: 'var(--surface)', boxSizing: 'border-box', outline: 'none', minHeight: '100px', resize: 'none' }} />
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '24px' }}>
          This will save a new version of the recipe with your modifications to your “<strong>My Recipe Book</strong>”.
        </p>

        <button onClick={handleSaveRecipe} style={{ width: '100%', padding: '18px 24px', backgroundColor: 'var(--accent-green)', color: 'white', border: 'none', borderRadius: '24px', fontWeight: '800', fontSize: '17px', cursor: 'pointer', fontFamily: 'var(--heading)', boxShadow: '0 4px 12px rgba(74, 107, 68, 0.2)' }}>
          Save Recipe
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SaveRecipe;
