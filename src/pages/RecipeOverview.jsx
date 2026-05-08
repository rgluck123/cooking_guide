import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Book, ChevronLeft, Play, Info, Plus, Minus, Pencil } from 'lucide-react';
import InteractiveIngredient from '../components/InteractiveIngredient';
import SubstituteModal from '../components/SubstituteModal';
import DeboningModal from '../components/DeboningModal';
import { useRecipes } from '../context/RecipeContext';

const RecipeOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    savedRecipes, saveRecipe, deleteRecipe, clearProgress, 
    activeRecipe, setActiveRecipeById, updateActiveRecipeIngredients, 
    addActiveRecipeIngredient, scaleActiveRecipePortions, updateActiveRecipe 
  } = useRecipes();
  
  const recipeId = id || 'authentic-lebanese-chicken';
  const location = useLocation();
  const hasResetRef = useRef(false);
  const portionPopupRef = useRef(null);

  useEffect(() => {
    // If we're coming from a "standard" entry (not from recipe book or recent), reset to default
    const isStandardEntry = location.state?.from === 'results' || location.state?.from === 'home';
    
    // We only want to trigger the automatic reset IF we are navigating to the base recipe ID
    // and we haven't already performed a reset in this mount cycle.
    const isBaseRecipe = recipeId === 'authentic-lebanese-chicken';

    if (isStandardEntry && isBaseRecipe && !hasResetRef.current) {
      hasResetRef.current = true;
      setActiveRecipeById(recipeId, true); // Force reset
    } else if (!activeRecipe || (activeRecipe.id !== recipeId && !activeRecipe.id.startsWith('instance-'))) {
      // Only set by ID if we don't have an active recipe OR the current one doesn't match and isn't a custom instance
      setActiveRecipeById(recipeId);
    }
  }, [recipeId, activeRecipe, setActiveRecipeById, location.state]);

  const ingredients = activeRecipe?.ingredients || [];
  const cookingSteps = activeRecipe?.steps || [];

  const nextIngredientIdRef = useRef(1);
  const nextIngredientPositionRef = useRef(1);

  useEffect(() => {
    if (ingredients.length > 0) {
      nextIngredientIdRef.current = Math.max(...ingredients.map(i => i.id), 0) + 1;
      nextIngredientPositionRef.current = Math.max(...ingredients.map(i => i.originalPosition), 0) + 1;
    }
  }, [ingredients]);

  const ingredientTipsRef = useRef(null);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeSubIngredients, setActiveSubIngredients] = useState([]);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeActionIngredient, setActiveActionIngredient] = useState(null);
  const [activeActionTargetIds, setActiveActionTargetIds] = useState([]);

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [groupSwipeOffset, setGroupSwipeOffset] = useState(0);

  const [isDeboneModalOpen, setIsDeboneModalOpen] = useState(false);
  const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
  const [addIngredientForm, setAddIngredientForm] = useState({ name: '', quantity: '', stepId: '1' });
  
  const [isPortionPopupOpen, setIsPortionPopupOpen] = useState(false);

  const [showIngredientTips, setShowIngredientTips] = useState(false);
  const [showSavedNotice, setShowSavedNotice] = useState(false);
  const [savedNoticeText, setSavedNoticeText] = useState('Saved to my recipe book');
  const saveNoticeTimeoutRef = useRef(null);

  useEffect(() => {
    if (cookingSteps.length > 0 && addIngredientForm.stepId === '1' && cookingSteps[0].id !== 1) {
      setAddIngredientForm(prev => ({ ...prev, stepId: cookingSteps[0].id.toString() }));
    }
  }, [cookingSteps, addIngredientForm.stepId]);

  // Handle outside click for portion popup
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isPortionPopupOpen && portionPopupRef.current && !portionPopupRef.current.contains(event.target)) {
        setIsPortionPopupOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isPortionPopupOpen]);

  if (!activeRecipe) return null;

  const currentPortions = parseInt(activeRecipe.portions) || 2;
  const isSavedToRecipeBook = savedRecipes.some(r => r.id === activeRecipe.id || r.baseRecipeId === activeRecipe.id || r.id === 'authentic-lebanese-chicken');
  const savedRecipeInstance = savedRecipes.find(r => r.id === activeRecipe.id) || savedRecipes.find(r => r.baseRecipeId === activeRecipe.id) || savedRecipes.find(r => r.id === 'authentic-lebanese-chicken');
  const hasSavedModifications = activeRecipe.isModified || (isSavedToRecipeBook && savedRecipeInstance?.modifications?.length > 0);

  const handleToggleSelect = (id) => {
    setSelectedIngredientIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getTargetIds = (item) => selectedIngredientIds.includes(item.id) ? selectedIngredientIds : [item.id];

  const clearSelectionIfMode = () => {
    if (isSelectMode) {
      setSelectedIngredientIds([]);
      setIsSelectMode(false);
    }
  };

  const executeRemove = (item) => {
    const targetIds = getTargetIds(item);
    const newIngredients = ingredients.map(i => targetIds.includes(i.id) ? { ...i, removed: true } : i);
    updateActiveRecipeIngredients(newIngredients);
    setIsActionMenuOpen(false);
    clearSelectionIfMode();
  };

  const executeRestore = (item) => {
    const targetIds = getTargetIds(item);
    const newIngredients = ingredients.map(i => targetIds.includes(i.id) ? { ...i, removed: false } : i);
    updateActiveRecipeIngredients(newIngredients);
    setIsActionMenuOpen(false);
    clearSelectionIfMode();
  };

  const executeReset = (item) => {
    const targetIds = getTargetIds(item);
    let next = [...ingredients];
    targetIds.forEach(id => {
      const target = next.find(i => i.id === id);
      if (target && target.replacedIds) {
        next = next.filter(i => i.id !== id);
        next = next.map(i => target.replacedIds.includes(i.id) ? { ...i, removed: false, hidden: false } : i);
      } else if (target && target.edited) {
        next = next.map(i => i.id === id ? { ...i, name: i.originalName, quantity: i.originalQuantity || i.quantity, edited: false } : i);
      }
    });
    updateActiveRecipeIngredients(next);
    setIsActionMenuOpen(false);
    clearSelectionIfMode();
  };

  const openSubstitute = (item) => {
    const targetIds = getTargetIds(item);
    const targetItems = ingredients.filter(i => targetIds.includes(i.id));
    setActiveSubIngredients(targetItems);
    setIsSubModalOpen(true);
    setIsActionMenuOpen(false);
  };

  const handleSwipeLeft = (item) => {
    if (item.removed) {
      executeRestore(item);
    } else {
      executeRemove(item);
    }
  };

  const handleSwipeRight = (item) => {
    const isSubbed = item.edited || item.replacedIds;
    if (isSubbed) {
      executeReset(item);
    } else {
      openSubstitute(item);
    }
  };

  const handleLongPress = (item) => {
    const targetIds = getTargetIds(item);
    setActiveActionIngredient(item);
    setActiveActionTargetIds(targetIds);
    setIsActionMenuOpen(true);
  };

  const handleSubstitute = (ids, newName, newQty, targetStepId = null) => {
    let next = [...ingredients];
    if (ids.length === 1) {
      next = next.map(item => {
        if (item.id === ids[0]) {
          return { 
            ...item, 
            name: newName, 
            quantity: newQty, 
            edited: true, 
            originalQuantity: item.originalQuantity || item.quantity,
            assignedSteps: targetStepId ? [Number(targetStepId)] : item.assignedSteps
          };
        }
        return item;
      });
    } else {
      next = next.map(item => ids.includes(item.id) ? { ...item, hidden: true } : item);
      const selectedItems = ingredients.filter(i => ids.includes(i.id));
      const minPos = Math.min(...selectedItems.map(i => i.originalPosition));
      const newId = nextIngredientIdRef.current;
      nextIngredientIdRef.current += 1;

      const steps = targetStepId ? [Number(targetStepId)] : selectedItems.reduce((acc, curr) => {
        if (curr.assignedSteps) {
          curr.assignedSteps.forEach(s => { if (!acc.includes(s)) acc.push(s); });
        }
        return acc;
      }, []);

      next.push({
         id: newId,
         name: newName,
         quantity: newQty,
         originalName: newName,
         edited: false,
         removed: false,
         originalPosition: minPos,
         replacedIds: ids,
         assignedSteps: steps
      });
    }
    updateActiveRecipeIngredients(next);
    clearSelectionIfMode();
  };

  const handlePortionChange = (val) => {
    const newVal = Math.max(1, Math.min(20, currentPortions + val));
    scaleActiveRecipePortions(newVal);
  };

  const handleAddIngredient = () => {
    const trimmedName = addIngredientForm.name.trim();
    if (!trimmedName) {
      return;
    }

    const newId = nextIngredientIdRef.current;
    nextIngredientIdRef.current += 1;

    addActiveRecipeIngredient({
      id: newId,
      name: trimmedName,
      quantity: addIngredientForm.quantity.trim(),
      originalName: trimmedName,
      edited: false,
      removed: false,
      originalPosition: nextIngredientPositionRef.current,
      assignedSteps: [Number(addIngredientForm.stepId)]
    });

    nextIngredientPositionRef.current += 1;

    setAddIngredientForm({ name: '', quantity: '', stepId: cookingSteps[0].id.toString() });
    setIsAddIngredientModalOpen(false);
  };

  const handleSaveToRecipeBook = () => {
    if (isSavedToRecipeBook) {
      deleteRecipe(savedRecipeInstance?.id || activeRecipe.id);
      setSavedNoticeText('Removed from my recipe book');
    } else {
      const newId = (activeRecipe.id === 'authentic-lebanese-chicken' || activeRecipe.id === activeRecipe.baseRecipeId) 
        ? `instance-${Date.now()}` 
        : activeRecipe.id;

      saveRecipe({
        ...activeRecipe,
        id: newId,
        baseRecipeId: activeRecipe.baseRecipeId || activeRecipe.id,
      });
      
      if (newId !== activeRecipe.id) {
        updateActiveRecipe({ id: newId, baseRecipeId: activeRecipe.baseRecipeId || activeRecipe.id });
      }
      
      setSavedNoticeText('Saved to my recipe book');
    }

    setShowSavedNotice(true);
    if (saveNoticeTimeoutRef.current) {
      clearTimeout(saveNoticeTimeoutRef.current);
    }
    saveNoticeTimeoutRef.current = setTimeout(() => {
      setShowSavedNotice(false);
    }, 1800);
  };

  const orderedIngredients = [...ingredients].sort((a, b) => {
    if (a.removed === b.removed) {
      return a.originalPosition - b.originalPosition;
    }
    return a.removed ? 1 : -1;
  });

  useEffect(() => {
    return () => {
      if (saveNoticeTimeoutRef.current) {
        clearTimeout(saveNoticeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!showIngredientTips) {
        return;
      }

      if (ingredientTipsRef.current && !ingredientTipsRef.current.contains(event.target)) {
        setShowIngredientTips(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showIngredientTips]);

  return (
    <div style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', backgroundColor: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      
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
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', left: '20px', width: '44px', height: '44px', background: 'rgba(255,255,255,0.88)', borderRadius: '50%', border: 'none', padding: 0, zIndex: 10, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          onClick={handleSaveToRecipeBook}
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', right: '20px', width: '44px', height: '44px', background: isSavedToRecipeBook ? 'var(--accent-green)' : 'rgba(255,255,255,0.88)', borderRadius: '50%', border: 'none', padding: 0, zIndex: 10, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Book size={18} color={isSavedToRecipeBook ? 'white' : 'var(--text)'} />
        </button>

        {hasSavedModifications && (
          <div style={{
            position: 'absolute',
            bottom: '42px',
            right: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--accent-green)',
            fontSize: '11px',
            fontWeight: '800',
            padding: '6px 12px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}>
            <Pencil size={11} strokeWidth={2.5} />
            CUSTOMIZED
          </div>
        )}

        {showSavedNotice && (
          <div style={{ position: 'absolute', top: 'calc(76px + env(safe-area-inset-top))', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--accent-green)', border: '1px solid rgba(74, 107, 68, 0.3)', borderRadius: '12px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', boxShadow: 'var(--shadow)', zIndex: 20 }}>
            {savedNoticeText}
          </div>
        )}
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, lineHeight: '1.2' }}>{activeRecipe.name}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', position: 'relative' }}>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>40 min</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>Intermediate</div>
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsPortionPopupOpen(!isPortionPopupOpen)}
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {activeRecipe.portions}
            </div>

            {/* Inline Portion Scaling Popup - Repositioned */}
            {isPortionPopupOpen && (
              <div 
                ref={portionPopupRef}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '105%',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 60,
                  whiteSpace: 'nowrap'
                }}
              >
                <button 
                  onClick={() => handlePortionChange(-1)}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <button 
                  onClick={() => handlePortionChange(1)}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div ref={ingredientTipsRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Ingredients</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowIngredientTips((prev) => !prev);
              }}
              aria-label="Toggle ingredient interaction tips"
              aria-expanded={showIngredientTips}
              style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: 'pointer' }}
            >
              <Info size={16} color="var(--text-light)" />
            </button>

            <button
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                if (isSelectMode) setSelectedIngredientIds([]);
              }}
              style={{
                marginLeft: 'auto',
                padding: '6px 12px',
                borderRadius: '16px',
                border: isSelectMode ? '1px solid rgba(0,0,0,0.1)' : '1px solid var(--border)',
                backgroundColor: isSelectMode ? 'var(--accent-green-light)' : 'transparent',
                color: isSelectMode ? 'var(--accent-green)' : 'var(--text-light)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelectMode ? 'inset 0 2px 4px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {isSelectMode ? 'Done' : 'Select'}
            </button>

            {showIngredientTips && (
              <div style={{ position: 'absolute', top: '40px', left: 'calc(50% - 8px)', transform: 'translateX(-50%)', zIndex: 5, width: 'min(360px, calc(100vw - 64px))', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', boxShadow: 'var(--shadow)' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-light)', margin: 0, lineHeight: '1.6' }}>
                  <p style={{ margin: '0 0 8px 0' }}>Tap <strong>Select</strong> to choose multiple ingredients. Swipe or long press a selected item to perform actions on the whole group.</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Not substituted:</strong> Swipe right to substitute, left to remove.</p>
                  <p style={{ margin: '0 0 8px 0' }}><strong>Substituted:</strong> Swipe right to reset, left to remove.</p>
                  <p style={{ margin: '0' }}><strong>Removed:</strong> Swipe right to substitute, left to restore.</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            {orderedIngredients.filter(i => !i.hidden).map(item => (
              <InteractiveIngredient 
                key={item.id} 
                item={item} 
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onLongPress={handleLongPress}
                isSelectMode={isSelectMode}
                isSelected={selectedIngredientIds.includes(item.id)}
                onToggleSelect={handleToggleSelect}
                groupOffsetX={selectedIngredientIds.includes(item.id) && selectedIngredientIds.length > 1 ? groupSwipeOffset : undefined}
                onGroupDrag={(offset) => setGroupSwipeOffset(offset)}
                onGroupDragEnd={() => setGroupSwipeOffset(0)}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAddIngredientModalOpen(true)}
            style={{
              width: '100%',
              marginTop: '32px',
              padding: '14px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-green-light)',
              color: 'var(--accent-green)',
              border: '1px solid transparent',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} />
            Add ingredient
          </button>
        </div>

        {/* Steps Overview */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Steps</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cookingSteps.map((step) => (
              <div key={step.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--accent-green)', minWidth: '24px', lineHeight: '1.5' }}>
                    {step.id}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: 'var(--text)', lineHeight: '1.4' }}>
                        {step.title}
                      </p>
                      {step.id === 2 && (
                        <button 
                          onClick={() => setIsDeboneModalOpen(true)}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '4px', 
                            padding: '4px 8px', borderRadius: '8px', 
                            border: '1.5px solid var(--accent-green)', 
                            backgroundColor: 'white',
                            color: 'var(--accent-green)',
                            fontSize: '11px', fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow)'
                          }}
                        >
                          <Info size={12} color="var(--accent-green)" />
                          More
                        </button>
                      )}
                    </div>
                    <div style={{ borderBottom: '1px dotted var(--border)', marginTop: '8px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div style={{ marginTop: '48px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 16px 0' }}>Notes</h2>
          <textarea
            placeholder="Add personal notes, substitutions, or tips here..."
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontFamily: 'var(--sans)',
              fontSize: '15px',
              minHeight: '120px',
              resize: 'none',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
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
          onClick={async () => {
            // Explicitly request microphone access during this user gesture ONLY on Android
            // This fixes the missing prompt on Android Chrome PWAs without breaking Safari
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
              try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  // We stop it immediately, we just needed the permission prompt to trigger
                  stream.getTracks().forEach(track => track.stop());
                }
              } catch (err) {
                console.log("Microphone permission interaction handled", err);
              }
            }

            // Prime speech synthesis for Safari/Mobile
            try {
              const silent = new SpeechSynthesisUtterance("");
              silent.volume = 0;
              window.speechSynthesis.speak(silent);
            } catch(e) {}
            
            clearProgress(activeRecipe.id);
            navigate('/live-cooking', { state: { recipeId: activeRecipe.id } });
          }}
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
        onClose={() => {
          setIsSubModalOpen(false);
          setIsSelectMode(false);
          setSelectedIngredientIds([]);
        }} 
        ingredients={activeSubIngredients} 
        onSubstitute={handleSubstitute}
        cookingSteps={cookingSteps}
      />

      <DeboningModal 
        isOpen={isDeboneModalOpen}
        onClose={() => setIsDeboneModalOpen(false)}
      />

      {isAddIngredientModalOpen && (
        <div
          onClick={() => setIsAddIngredientModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: 'var(--surface)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.14)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Add ingredient</h3>
              <button
                onClick={() => setIsAddIngredientModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--text-light)', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                Ingredient name
                <input
                  type="text"
                  value={addIngredientForm.name}
                  onChange={(e) => setAddIngredientForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Tomatoes"
                  style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                Quantity (optional)
                <input
                  type="text"
                  value={addIngredientForm.quantity}
                  onChange={(e) => setAddIngredientForm(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="e.g. 2 tbsp"
                  style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none' }}
                />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                Add to step
                <select
                  value={addIngredientForm.stepId}
                  onChange={(e) => setAddIngredientForm(prev => ({ ...prev, stepId: e.target.value }))}
                  style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '14px', fontFamily: 'var(--sans)', outline: 'none', backgroundColor: 'white' }}
                >
                  {cookingSteps.map(step => (
                    <option key={step.id} value={step.id}>
                      Step {step.id} - {step.title}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={handleAddIngredient}
                style={{
                  marginTop: '6px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--accent-green)',
                  color: 'white',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Add ingredient
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>
              {activeActionTargetIds.length > 1 ? `${activeActionTargetIds.length} Ingredients Selected` : activeActionIngredient.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(activeActionIngredient.edited || activeActionIngredient.replacedIds) ? (
                <>
                  <button 
                    onClick={() => openSubstitute(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Substitute Again
                  </button>
                  <button 
                    onClick={() => executeReset(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Reset to Original
                  </button>
                  <button 
                    onClick={() => executeRemove(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Remove {activeActionTargetIds.length > 1 ? 'Group' : 'Ingredient'}
                  </button>
                </>
              ) : activeActionIngredient.removed ? (
                <>
                  <button 
                    onClick={() => executeRestore(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Restore {activeActionTargetIds.length > 1 ? 'Group' : 'Ingredient'}
                  </button>
                  <button 
                    onClick={() => openSubstitute(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Substitute {activeActionTargetIds.length > 1 ? 'Group' : 'Ingredient'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => openSubstitute(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Substitute {activeActionTargetIds.length > 1 ? 'Group' : 'Ingredient'}
                  </button>
                  <button 
                    onClick={() => executeRemove(activeActionIngredient)}
                    style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: '700', border: 'none', fontSize: '16px' }}
                  >
                    Remove {activeActionTargetIds.length > 1 ? 'Group' : 'Ingredient'}
                  </button>
                </>
              )}
              <button 
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setIsSelectMode(false);
                  setSelectedIngredientIds([]);
                }}
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