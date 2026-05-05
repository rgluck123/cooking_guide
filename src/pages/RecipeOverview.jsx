import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, ChevronLeft, Play, Info, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import InteractiveIngredient from '../components/InteractiveIngredient';
import SubstituteModal from '../components/SubstituteModal';
import DeboningModal from '../components/DeboningModal';
import { useRecipes } from '../context/RecipeContext';

const initialIngredients = [
  { id: 1, name: 'Chicken Thighs', quantity: '400g', originalName: 'Chicken Thighs', edited: false, removed: false, originalPosition: 1 },
  { id: 2, name: 'White Rice', quantity: '190g', originalName: 'White Rice', edited: false, removed: false, originalPosition: 2 },
  { id: 3, name: 'Water', quantity: '380ml', originalName: 'Water', edited: false, removed: false, originalPosition: 3 },
  { id: 4, name: 'Yellow Onion', quantity: '1', originalName: 'Yellow Onion', edited: false, removed: false, originalPosition: 4 },
  { id: 5, name: 'Garlic', quantity: '3 cloves', originalName: 'Garlic', edited: false, removed: false, originalPosition: 5 },
  { id: 6, name: 'Lebanese Spice Mix', quantity: '1 tbsp', originalName: 'Lebanese Spice Mix', edited: false, removed: false, originalPosition: 6 },
  { id: 7, name: 'Lemon Juice', quantity: '2 tbsp', originalName: 'Lemon Juice', edited: false, removed: false, originalPosition: 7 },
  { id: 8, name: 'Salt & Pepper', quantity: 'to taste', originalName: 'Salt & Pepper', edited: false, removed: false, originalPosition: 8 },
];

const cookingSteps = [
  { id: 1, title: 'Cook the rice', instruction: 'Rinse 190g white rice and add to a pot with 380ml water. Bring to a boil, then reduce heat and simmer covered for 18-20 minutes until tender.' },
  { id: 2, title: 'Debone the chicken', instruction: 'Let the cooked chicken cool for a few minutes. Carefully remove all bones and skin, shredding the meat into bite-sized pieces.' },
  { id: 3, title: 'Cut the onion', instruction: 'Peel 1 yellow onion and cut it into thin slices. Try to keep them roughly the same thickness for even cooking.' },
  { id: 4, title: 'Heat oil in the pan and put in the chopped onion', instruction: 'Heat oil in a large pan over medium heat and add the chopped onion. Sauté for 2-3 minutes until translucent and fragrant.' },
  { id: 5, title: 'Add your seasoning', instruction: 'Add a pinch of salt, pepper, and a teaspoon each of cumin, coriander, and cinnamon. Stir well to combine.' },
  { id: 6, title: 'Stir for 1 minute', instruction: 'Keep stirring the spices with the onions to toast them and release their aroma.' },
  { id: 7, title: 'Push the onions to the side and place your chicken thighs in the pan', instruction: 'Carefully add the chicken thighs to the pan and mix well with the spiced onions.' },
  { id: 8, title: 'Cook for about 8 minutes on each side until they look golden brown and juicy', instruction: 'Allow the chicken to cook through and develop a nice golden color on all sides.' },
  { id: 9, title: 'Squeeze half a lemon over the chicken to brighten the flavors.', instruction: 'Drizzle fresh lemon juice over the cooked chicken for added zest and flavor.' },
  { id: 10, title: 'Cut the other half of the lemon in slices', instruction: 'Slice the remaining lemon half into thin slices for serving.' },
  { id: 11, title: 'Drain the water from the rice', instruction: 'Separate the rice grains and prepare for serving.' },
  { id: 12, title: 'Serve half of the rice together with half of the chicken and the lemon slices', instruction: 'Plate the chicken and rice nicely with lemon slices on the side.' },
  { id: 13, title: 'Put the other half in a container once it cools', instruction: 'Save the remaining portions for later.' }
];

const RecipeOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { savedRecipes, saveRecipe, deleteRecipe } = useRecipes();
  const [ingredients, setIngredients] = useState(initialIngredients);
  const nextIngredientIdRef = useRef(initialIngredients.length + 1);
  const nextIngredientPositionRef = useRef(initialIngredients.length + 1);
  
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeSubIngredient, setActiveSubIngredient] = useState(null);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [activeActionIngredient, setActiveActionIngredient] = useState(null);

  const [isDeboneModalOpen, setIsDeboneModalOpen] = useState(false);
  const [isAddIngredientModalOpen, setIsAddIngredientModalOpen] = useState(false);
  const [addIngredientForm, setAddIngredientForm] = useState({ name: '', quantity: '', stepId: cookingSteps[0].id.toString() });
  const [showIngredientTips, setShowIngredientTips] = useState(false);
  const [showSavedNotice, setShowSavedNotice] = useState(false);
  const [savedNoticeText, setSavedNoticeText] = useState('Saved to my recipe book');
  const saveNoticeTimeoutRef = useRef(null);
  const ingredientTipsRef = useRef(null);
  const recipeBookId = 'lebanese-spicy-chicken';
  const isSavedToRecipeBook = savedRecipes.some((recipe) => recipe.id === recipeBookId);

  const handleRemove = (item) => {
    setIngredients(prev => prev.map(i => i.id === item.id ? { ...i, removed: true } : i));
    setIsActionMenuOpen(false);
  };

  const handleRestore = (item) => {
    setIngredients(prev => prev.map(i => i.id === item.id ? { ...i, removed: false } : i));
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

  const handleAddIngredient = () => {
    const trimmedName = addIngredientForm.name.trim();
    if (!trimmedName) {
      return;
    }

    const newId = nextIngredientIdRef.current;
    nextIngredientIdRef.current += 1;

    setIngredients(prev => [
      ...prev,
      {
        id: newId,
        name: trimmedName,
        quantity: addIngredientForm.quantity.trim(),
        originalName: trimmedName,
        edited: false,
        removed: false,
        originalPosition: nextIngredientPositionRef.current,
        assignedStep: Number(addIngredientForm.stepId)
      }
    ]);

    nextIngredientPositionRef.current += 1;

    setAddIngredientForm({ name: '', quantity: '', stepId: cookingSteps[0].id.toString() });
    setIsAddIngredientModalOpen(false);
  };

  const handleSaveToRecipeBook = () => {
    if (isSavedToRecipeBook) {
      deleteRecipe(recipeBookId);
      setSavedNoticeText('Removed from my recipe book');
    } else {
      saveRecipe({
        id: recipeBookId,
        name: 'Authentic Lebanese Chicken with Rice',
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80',
        time: '40 mins',
        difficulty: 'Intermediate',
        portions: '2 portions'
      });
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
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', left: '20px', width: '44px', height: '44px', background: 'rgba(255,255,255,0.88)', borderRadius: '50%', border: 'none', padding: 0, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          onClick={handleSaveToRecipeBook}
          style={{ position: 'absolute', top: 'calc(24px + env(safe-area-inset-top))', right: '20px', width: '44px', height: '44px', background: isSavedToRecipeBook ? 'var(--accent-green)' : 'rgba(255,255,255,0.88)', borderRadius: '50%', border: 'none', padding: 0, lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Book size={18} color={isSavedToRecipeBook ? 'white' : 'var(--text)'} />
        </button>

        {showSavedNotice && (
          <div style={{ position: 'absolute', top: 'calc(76px + env(safe-area-inset-top))', right: '20px', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--accent-green)', border: '1px solid rgba(74, 107, 68, 0.3)', borderRadius: '12px', padding: '8px 12px', fontSize: '12px', fontWeight: '600', boxShadow: 'var(--shadow)' }}>
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
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>Authentic Lebanese Chicken with Rice</h1>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', padding: '6px 12px', borderRadius: '16px', fontWeight: '700', fontSize: '14px' }}>40 min</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>Intermediate</div>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '16px', fontWeight: '600', fontSize: '14px' }}>2 Portions</div>
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

            {showIngredientTips && (
              <div style={{ position: 'absolute', top: '40px', left: 'calc(50% - 8px)', transform: 'translateX(-50%)', zIndex: 5, width: 'min(360px, calc(100vw - 64px))', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '10px 12px', boxShadow: 'var(--shadow)' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-light)', margin: 0, lineHeight: '1.5' }}>
                  Swipe right<ArrowRight size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '2px', position: 'relative', top: '-1px' }} /> to substitute, left<ArrowLeft size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '2px', position: 'relative', top: '-1px' }} /> to remove or restore, or long press for options.
                </p>
              </div>
            )}
          </div>
          
          <div>
            {orderedIngredients.map(item => (
              <InteractiveIngredient 
                key={item.id} 
                item={item} 
                onSwipeLeft={item.removed ? handleRestore : handleRemove}
                onSwipeRight={item.removed ? handleRestore : openSubstitute}
                onLongPress={handleLongPress}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAddIngredientModalOpen(true)}
            style={{
              width: '100%',
              marginTop: '8px',
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
                    <p style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: 'var(--text)', lineHeight: '1.4' }}>
                      {step.title}
                    </p>
                    <div style={{ borderBottom: '1px dotted var(--border)', marginTop: '8px' }} />
                  </div>
                </div>
                {step.id === 2 && (
                  <button
                    onClick={() => setIsDeboneModalOpen(true)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--accent-green-light)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--accent-green)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginLeft: '12px'
                    }}
                  >
                    More info
                  </button>
                )}
              </div>
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
            <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>{activeActionIngredient.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!activeActionIngredient.removed && (
                <button 
                  onClick={() => openSubstitute(activeActionIngredient)}
                  style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--accent-green-light)', color: 'var(--accent-green)', fontWeight: '700', border: 'none', fontSize: '16px' }}
                >
                  Substitute Ingredient
                </button>
              )}
              <button 
                onClick={() => activeActionIngredient.removed ? handleRestore(activeActionIngredient) : handleRemove(activeActionIngredient)}
                style={{ padding: '16px', borderRadius: '12px', backgroundColor: activeActionIngredient.removed ? 'var(--accent-green-light)' : '#fff7ed', color: activeActionIngredient.removed ? 'var(--accent-green)' : '#c2410c', fontWeight: '700', border: 'none', fontSize: '16px' }}
              >
                {activeActionIngredient.removed ? 'Restore Ingredient' : 'Remove Ingredient'}
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